const idempotencyCache = new Map<string, { response: unknown; timestamp: number }>();

export function checkIdempotency(key: string): { duplicate: boolean; cachedResponse?: unknown } {
  const existing = idempotencyCache.get(key);
  if (existing) {
    // 24-hour expiration check
    if (Date.now() - existing.timestamp < 24 * 60 * 60 * 1000) {
      return { duplicate: true, cachedResponse: existing.response };
    }
    idempotencyCache.delete(key);
  }
  return { duplicate: false };
}

export function saveIdempotency(key: string, response: unknown) {
  idempotencyCache.set(key, {
    response,
    timestamp: Date.now(),
  });
}
