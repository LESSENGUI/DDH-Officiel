import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter } from "./rate-limit";

describe("InMemoryRateLimiter", () => {
  it("blocks attempts above the limit until the window expires", () => {
    const limiter = new InMemoryRateLimiter(2, 1_000);
    expect(limiter.consume("visitor", 100).allowed).toBe(true);
    expect(limiter.consume("visitor", 200).allowed).toBe(true);
    expect(limiter.consume("visitor", 300)).toEqual({ allowed: false, retryAfterSeconds: 1 });
    expect(limiter.consume("visitor", 1_101).allowed).toBe(true);
  });

  it("tracks different clients independently", () => {
    const limiter = new InMemoryRateLimiter(1, 1_000);
    expect(limiter.consume("one", 100).allowed).toBe(true);
    expect(limiter.consume("two", 100).allowed).toBe(true);
    expect(limiter.consume("one", 101).allowed).toBe(false);
  });
});
