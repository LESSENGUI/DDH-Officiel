import Link from "next/link";
import AdminLoginForm from "@/components/admin-login-form";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { getSafeAdminRedirect } from "@/lib/validation/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ config?: string; invited?: string; next?: string }> }) {
  const params = await searchParams;
  const configured = isSupabasePublicConfigured();
  return <section className="admin-body"><div className="admin-panel"><Link className="eyebrow" href="/">← RETOUR AU SITE</Link><h1>Espace administrateur</h1><p>Connexion sécurisée à l’administration du site officiel.</p>
    {!configured
      ? <div className="admin-notice" role="status">Supabase n’est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env, puis redémarrez le serveur.</div>
      : <>
        {params.config && <div className="admin-notice" role="alert">La connexion Supabase est indisponible. Vérifiez sa configuration serveur.</div>}
        {params.invited && <div className="admin-notice" role="status">Invitation confirmée. Définissez votre mot de passe pour terminer la configuration du compte.</div>}
        <AdminLoginForm nextPath={getSafeAdminRedirect(params.next)} />
      </>}
  </div></section>;
}
