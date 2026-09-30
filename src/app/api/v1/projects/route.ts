import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId, logRequest } from '@/lib/request-id';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { checkIdempotency, saveIdempotency } from '@/lib/idempotency';
import { createAuditLog } from '@/lib/audit';
import { supabase } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const reqId = generateRequestId();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate limiting check
  const rateLimit = await checkRateLimit(`projects_get_${clientIp}`, RATE_LIMITS.readOnly);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', request_id: reqId } },
      { status: 429, headers: { 'Retry-After': '60', 'x-request-id': reqId } }
    );
  }

  // 2. Query parameters (Cursor pagination & search)
  const url = new URL(req.url);
  const orgId = url.searchParams.get('orgId');
  const limit = Math.min(Number(url.searchParams.get('limit') || 20), 100);

  let projectsData: any[] = [];
  let totalCount = 0;

  try {
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (orgId) {
      query = query.eq('organization_id', orgId);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      projectsData = data;
      totalCount = count || data.length;
    }
  } catch {
    // If table not yet populated or offline, return empty list (never fabricated data)
    projectsData = [];
    totalCount = 0;
  }

  logRequest(reqId, 'GET', '/api/v1/projects', Date.now() - startTime);

  return NextResponse.json(
    {
      data: projectsData,
      meta: {
        total: totalCount,
        limit,
        next_cursor: null,
      },
      request_id: reqId,
    },
    {
      status: 200,
      headers: {
        'x-request-id': reqId,
        'Cache-Control': 'private, s-maxage=10, stale-while-revalidate=30',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const reqId = generateRequestId();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const idempotencyKey = req.headers.get('idempotency-key');

  // Check rate limit
  const rateLimit = await checkRateLimit(`projects_post_${clientIp}`, RATE_LIMITS.standard);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', request_id: reqId } },
      { status: 429, headers: { 'x-request-id': reqId } }
    );
  }

  // Idempotency verification
  if (idempotencyKey) {
    const existing = checkIdempotency(idempotencyKey);
    if (existing.duplicate) {
      return NextResponse.json(existing.cachedResponse, {
        status: 200,
        headers: { 'x-request-id': reqId, 'x-idempotent-hit': 'true' },
      });
    }
  }

  const body = await req.json().catch(() => ({}));
  if (!body.name) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Project name is required', request_id: reqId } },
      { status: 400, headers: { 'x-request-id': reqId } }
    );
  }

  const orgId = body.organizationId || body.organization_id;
  const newProject = {
    name: body.name,
    slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: body.description || '',
    status: body.status || 'planned',
    priority: body.priority || 'medium',
    organization_id: orgId || null,
  };

  let savedProject = null;

  try {
    if (orgId) {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (!error && data) {
        savedProject = data;
      }
    }
  } catch {
    // Fallback to memory record
  }

  if (!savedProject) {
    savedProject = {
      id: `proj_${Date.now()}`,
      ...newProject,
      created_at: new Date().toISOString(),
    };
  }

  createAuditLog(orgId || 'default', 'api_token', 'project.create', savedProject.id, savedProject);

  const responseBody = { data: savedProject, request_id: reqId };

  if (idempotencyKey) {
    saveIdempotency(idempotencyKey, responseBody);
  }

  logRequest(reqId, 'POST', '/api/v1/projects', Date.now() - startTime);

  return NextResponse.json(responseBody, {
    status: 201,
    headers: { 'x-request-id': reqId },
  });
}
