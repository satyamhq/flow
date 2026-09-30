// In-memory sliding window fallback for local/edge serverless environments,
// with distributed database schema fallback in Postgres for multi-region scale.

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  auth: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 req/min
  ai: { maxRequests: 20, windowMs: 60 * 1000 },   // 20 req/min
  standard: { maxRequests: 120, windowMs: 60 * 1000 }, // 120 req/min
  readOnly: { maxRequests: 300, windowMs: 60 * 1000 }, // 300 req/min
};

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.standard
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const existing = memoryStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: Math.ceil((now + config.windowMs) / 1000),
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(existing.resetAt / 1000),
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    reset: Math.ceil(existing.resetAt / 1000),
  };
}
