import Link from "next/link";
import { redirect } from "next/navigation";
import AdminSetPasswordForm from "@/components/admin-set-password-form";
import { getAdminContext } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SetAdminPasswordPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");
  return <section className="admin-body"><div className="admin-panel"><Link className="eyebrow" href="/">← RETOUR AU SITE</Link><h1>Créer votre mot de passe</h1><p>Choisissez un mot de passe personnel pour sécuriser votre compte administrateur.</p><AdminSetPasswordForm /></div></section>;
}
