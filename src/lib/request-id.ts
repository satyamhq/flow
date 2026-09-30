export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

export function logRequest(requestId: string, method: string, path: string, durationMs?: number) {
  const ts = new Date().toISOString();
  console.info(`[REQ] ${ts} ${requestId} | ${method} ${path} ${durationMs ? `(${durationMs}ms)` : ''}`);
}
