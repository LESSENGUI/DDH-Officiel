import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const emailSchema = z.email().max(254);
const email = emailSchema.safeParse(process.argv[2]);
if (!email.success) {
  console.error("Usage: npm run admin:create-first -- admin@example.org");
  process.exitCode = 1;
} else {
  const environment = z.object({
    url: z.url(),
    serviceRoleKey: z.string().min(1),
    siteUrl: z.url(),
  }).safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  });

  if (!environment.success) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the trusted environment.");
    process.exitCode = 1;
  } else {
    const supabase = createClient(environment.data.url, environment.data.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: superadminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("code", "SUPERADMIN")
      .single();
    const existingAdmin = roleError ? null : await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role_id", superadminRole.id)
      .limit(1);

    if (roleError || existingAdmin?.error) {
      console.error("Unable to verify the Supabase SUPERADMIN role before setup.", roleError?.message ?? existingAdmin?.error.message);
      process.exitCode = 1;
    } else if (existingAdmin.data.length) {
      console.error("A SUPERADMIN already exists; no invitation was sent.");
      process.exitCode = 1;
    } else {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email.data, {
        redirectTo: new URL("/auth/callback", environment.data.siteUrl).toString(),
      });

      if (error || !data.user) {
        console.error("Unable to invite the first SUPERADMIN.", error?.message ?? "Supabase returned no invited user.");
        process.exitCode = 1;
      } else {
        const { error: promotionError } = await supabase.rpc("promote_first_superadmin", {
          target_user_id: data.user.id,
        });
        if (promotionError) {
          console.error("The invitation was sent, but SUPERADMIN promotion failed. Do not rerun blindly; inspect Supabase and resolve the invitation first.", promotionError.message);
          process.exitCode = 1;
        } else {
          console.log("Invitation sent and the first SUPERADMIN role was assigned. The invited user must accept the email and set a personal password.");
        }
      }
    }
  }
}
