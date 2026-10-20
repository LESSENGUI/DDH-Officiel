import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20261017140000_ddh_backend_foundation.sql"), "utf8");
const applicationTables = [
  "profiles", "roles", "permissions", "role_permissions", "user_roles", "pages", "translations",
  "actions", "publications", "news", "media", "contact_messages", "site_settings", "audit_logs",
];

describe("Supabase security migration", () => {
  it("enables row-level security for every application table", () => {
    for (const table of applicationTables) {
      expect(migration).toMatch(new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    }
  });

  it("limits public content reads to published public records and protects contact messages", () => {
    expect(migration).toMatch(/status = 'published' and is_public and published_at is not null/i);
    expect(migration).toMatch(/create policy "contact_messages_staff_read"[\s\S]*?has_permission\('contacts\.read'\)/i);
    expect(migration).not.toMatch(/create policy[^;]+using\s*\(\s*true\s*\)/i);
  });

  it("restricts first-admin promotion to the one-time service-role function", () => {
    expect(migration).toMatch(/auth\.role\(\) is distinct from 'service_role'/i);
    expect(migration).toMatch(/A SUPERADMIN is already assigned/i);
    expect(migration).toMatch(/pg_advisory_xact_lock\(783214, 1\)/i);
    expect(migration).toMatch(/grant execute on function public\.promote_first_superadmin\(uuid\) to service_role/i);
  });

  it("limits administrative updates and prevents hard deletion of editorial translations", () => {
    expect(migration).toMatch(/grant update \(slug, status, is_public, published_at, updated_by\) on public\.pages to authenticated/i);
    expect(migration).not.toMatch(/grant select, insert, update, delete on public\.user_roles/i);
    expect(migration).not.toMatch(/create policy "translations_delete"/i);
    expect(migration).toMatch(/updated_by = \(select auth\.uid\(\)\)/i);
  });
});
