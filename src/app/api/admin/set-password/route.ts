import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logAdminAudit } from "@/lib/supabase/audit";
import { adminPasswordSchema } from "@/lib/validation/admin-auth";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_048) return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });
  const admin = await getAdminContext();
  if (!admin) return NextResponse.json({ error: "Authentification administrateur requise." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La requête doit contenir un JSON valide." }, { status: 400 });
  }
  const parsed = adminPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Le mot de passe ne respecte pas les critères de sécurité." }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    console.error("Unable to update the administrator password.", error.code);
    return NextResponse.json({ error: "Impossible de modifier le mot de passe." }, { status: 503 });
  }

  try {
    await logAdminAudit({ action: "admin.password_changed", entityType: "auth", metadata: { method: "invitation" } });
  } catch (auditError) {
    console.error("The password changed, but its audit event could not be recorded.", auditError);
    return NextResponse.json({ error: "Mot de passe modifié, mais journal d’audit indisponible. Contactez le SUPERADMIN." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
