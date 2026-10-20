type AttemptWindow = { startedAt: number; count: number };

export class InMemoryRateLimiter {
  private readonly attempts = new Map<string, AttemptWindow>();

  constructor(private readonly limit: number, private readonly windowMs: number) {}

  consume(key: string, now = Date.now()) {
    for (const [storedKey, attempt] of this.attempts) {
      if (now - attempt.startedAt >= this.windowMs) this.attempts.delete(storedKey);
    }

    const current = this.attempts.get(key);
    if (!current || now - current.startedAt >= this.windowMs) {
      this.attempts.set(key, { startedAt: now, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= this.limit) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((this.windowMs - (now - current.startedAt)) / 1000)) };
    }
    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
