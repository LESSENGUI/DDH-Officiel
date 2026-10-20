import "server-only";

import { createSupabaseServerClient } from "./server";

export type AdminContext = {
  id: string;
  email: string;
  name: string;
  permissions: ReadonlySet<string>;
};

export class AdminAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Unable to verify the Supabase session.", authError.code);
    return null;
  }
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("Unable to load the administrator profile.", profileError.code);
    throw new Error("Impossible de vérifier le profil administrateur.");
  }
  if (!profile?.is_active) return null;

  const { data: permissions, error: permissionsError } = await supabase.rpc("current_user_permissions");
  if (permissionsError) {
    console.error("Unable to load administrator permissions.", permissionsError.code);
    throw new Error("Impossible de vérifier les autorisations administrateur.");
  }
  if (!permissions?.length) return null;

  return {
    id: user.id,
    email: profile.email,
    name: profile.full_name ?? user.email ?? "Administrateur",
    permissions: new Set(permissions ?? []),
  };
}

export async function requirePermission(permission: string) {
  const admin = await getAdminContext();
  if (!admin) throw new AdminAuthorizationError("Authentification administrateur requise.");
  if (!admin.permissions.has(permission)) throw new AdminAuthorizationError("Permission administrateur insuffisante.");
  return admin;
}
