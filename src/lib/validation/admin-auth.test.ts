import { describe, expect, it } from "vitest";
import { adminLoginSchema, adminPasswordSchema, getSafeAdminRedirect } from "./admin-auth";

describe("administrator input validation", () => {
  it("normalizes email addresses and rejects external redirects", () => {
    expect(adminLoginSchema.parse({ email: "  ADMIN@example.org ", password: "pass" }).email).toBe("admin@example.org");
    expect(getSafeAdminRedirect("//outside.example")).toBe("/admin");
    expect(getSafeAdminRedirect("/admin/actions")).toBe("/admin/actions");
  });

  it("requires a strong initial administrator password", () => {
    expect(adminPasswordSchema.safeParse({ password: "short" }).success).toBe(false);
    expect(adminPasswordSchema.safeParse({ password: "changeme-personal-2026" }).success).toBe(false);
    expect(adminPasswordSchema.safeParse({ password: "Strong-Personal-2026" }).success).toBe(true);
  });
});
