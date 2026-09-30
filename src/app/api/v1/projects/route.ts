import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId, logRequest } from '@/lib/request-id';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { checkIdempotency, saveIdempotency } from '@/lib/idempotency';
import { createAuditLog } from '@/lib/audit';

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
  const orgId = url.searchParams.get('orgId') || 'a0000000-0000-0000-0000-000000000001';
  const limit = Math.min(Number(url.searchParams.get('limit') || 20), 100);
  const cursor = url.searchParams.get('cursor');

  const demoProjects = [
    { id: 'p1', name: 'Flow Core Platform Redesign', status: 'in_progress', priority: 'urgent', progress: 84 },
    { id: 'p2', name: 'Enterprise SSO & IAM Directory Sync', status: 'in_progress', priority: 'high', progress: 92 },
    { id: 'p3', name: 'Edge Latency & Distributed Read Replicas', status: 'in_progress', priority: 'medium', progress: 58 },
  ];

  logRequest(reqId, 'GET', '/api/v1/projects', Date.now() - startTime);

  return NextResponse.json(
    {
      data: demoProjects,
      meta: {
        total: demoProjects.length,
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

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Project name is required', request_id: reqId } },
      { status: 400, headers: { 'x-request-id': reqId } }
    );
  }

  const newProject = {
    id: `proj_${Date.now()}`,
    organization_id: body.organizationId || 'a0000000-0000-0000-0000-000000000001',
    name: body.name,
    status: body.status || 'planned',
    priority: body.priority || 'medium',
    created_at: new Date().toISOString(),
  };

  createAuditLog(newProject.organization_id, 'api_token', 'project.create', newProject.id, newProject);

  const responseBody = { data: newProject, request_id: reqId };

  if (idempotencyKey) {
    saveIdempotency(idempotencyKey, responseBody);
  }

  logRequest(reqId, 'POST', '/api/v1/projects', Date.now() - startTime);

  return NextResponse.json(responseBody, {
    status: 201,
    headers: { 'x-request-id': reqId },
  });
}
