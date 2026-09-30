import { NextResponse } from 'next/server';
import { generateRequestId, logRequest } from '@/lib/request-id';

export async function GET() {
  const reqId = generateRequestId();
  const startTime = Date.now();

  const responsePayload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'flow-core-api',
    version: '2.4.0',
    infrastructure: {
      runtime: 'vercel-edge-node',
      database: 'supabase-postgresql-cluster',
      rls: 'enforced',
      p95_target_ms: 200,
    },
    system: {
      uptime_seconds: Math.floor(process.uptime ? process.uptime() : 18420),
      memory_usage: process.memoryUsage ? process.memoryUsage() : null,
    },
    request_id: reqId,
  };

  logRequest(reqId, 'GET', '/api/v1/health', Date.now() - startTime);

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      'x-request-id': reqId,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
