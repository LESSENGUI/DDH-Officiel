import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const modules: Record<string, { title: string; description: string; permission: string }> = {
  "a-propos": { title: "À propos", description: "Biographie, parcours, CV, valeurs et distinctions.", permission: "pages.read" },
  actions: { title: "Actions", description: "Actions, projets, réalisations et bilans.", permission: "actions.read" },
  publications: { title: "Publications", description: "Articles, ouvrages, contributions et discours.", permission: "publications.read" },
  actualites: { title: "Actualités", description: "Actualités, événements, communiqués et médias.", permission: "news.read" },
  contacts: { title: "Contacts", description: "Messages et demandes reçues.", permission: "contacts.read" },
  mediatheque: { title: "Médiathèque", description: "Photos, vidéos, PDF et documents.", permission: "media.read" },
  langues: { title: "Langues", description: "Traductions et contenus multilingues.", permission: "settings.read" },
  utilisateurs: { title: "Utilisateurs", description: "Comptes, rôles et permissions.", permission: "users.read" },
  parametres: { title: "Paramètres", description: "Identité visuelle, menus, SEO et sécurité.", permission: "settings.read" },
};

export default async function AdminModule({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const item = modules[module];
  if (!item) notFound();
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");
  if (!admin.permissions.has(item.permission)) redirect("/admin");
  return <section className="admin-module-page"><span className="eyebrow">ADMINISTRATION DDH</span><h1>{item.title}</h1><p>{item.description}</p><div className="admin-module-empty">Le module d’administration est raccordé aux permissions Supabase. Les opérations de gestion seront activées au fur et à mesure du développement éditorial.</div><Link className="underlined-link" href="/admin">← Retour au tableau de bord</Link></section>;
}
