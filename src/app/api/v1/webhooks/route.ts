import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId, logRequest } from '@/lib/request-id';
import { checkIdempotency, saveIdempotency } from '@/lib/idempotency';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const reqId = generateRequestId();
  const startTime = Date.now();
  const eventId = req.headers.get('x-webhook-event-id') || `evt_${Date.now()}`;

  // Check idempotency for webhook event deduplication
  const existing = checkIdempotency(eventId);
  if (existing.duplicate) {
    return NextResponse.json(
      { message: 'Event already processed', event_id: eventId, request_id: reqId },
      { status: 200, headers: { 'x-request-id': reqId, 'x-duplicate-event': 'true' } }
    );
  }

  const payload = await req.json().catch(() => ({}));

  createAuditLog(
    'a0000000-0000-0000-0000-000000000001',
    'webhook_worker',
    payload.type || 'webhook.received',
    eventId,
    payload
  );

  saveIdempotency(eventId, { status: 'acknowledged' });

  logRequest(reqId, 'POST', '/api/v1/webhooks', Date.now() - startTime);

  // Return 202 Accepted immediately for background async processing
  return NextResponse.json(
    {
      status: 'accepted',
      event_id: eventId,
      request_id: reqId,
      processed_async: true,
    },
    {
      status: 202,
      headers: { 'x-request-id': reqId },
    }
  );
}
