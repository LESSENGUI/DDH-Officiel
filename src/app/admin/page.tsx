import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/admin-logout-button";
import { getAdminContext } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const modules = [
  ["01", "À propos", "/admin/a-propos", "Biographie, parcours, CV, valeurs et distinctions", "pages.read"],
  ["02", "Actions", "/admin/actions", "Actions, projets, réalisations et bilans", "actions.read"],
  ["03", "Publications", "/admin/publications", "Articles, livres, tribunes et discours", "publications.read"],
  ["04", "Actualités", "/admin/actualites", "Actualités, événements, communiqués et médias", "news.read"],
  ["05", "Contacts", "/admin/contacts", "Messages et demandes reçues", "contacts.read"],
  ["06", "Médiathèque", "/admin/mediatheque", "Photos, vidéos, PDF et fichiers", "media.read"],
  ["07", "Langues", "/admin/langues", "Traductions et contenus multilingues", "settings.read"],
  ["08", "Utilisateurs", "/admin/utilisateurs", "Comptes, rôles et permissions", "users.read"],
  ["09", "Paramètres", "/admin/parametres", "Identité visuelle, menus, SEO et sécurité", "settings.read"],
];

export default async function AdminDashboard() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");
  const availableModules = modules.filter((module) => admin.permissions.has(module[4]));
  return <section className="admin-dashboard"><aside className="admin-sidebar"><Link className="brand" href="/admin"><span className="brand-seal"><span>DDH</span></span><span className="brand-name">ADMINISTRATION <b>Site officiel</b></span></Link><span className="admin-side-label">GESTION DU SITE</span><Link className="admin-side-active" href="/admin">Tableau de bord</Link>{availableModules.map(([number, title, href]) => <Link className="admin-side-link" href={href} key={href}><span>{number}</span>{title}</Link>)}<Link className="admin-back" href="/">← Retour au site public</Link></aside>
    <div className="admin-main"><header className="admin-topbar"><div><span className="eyebrow">ESPACE ADMINISTRATEUR</span><h1>Tableau de bord</h1></div><AdminLogoutButton /></header><p className="admin-welcome">Bonjour, {admin.name}. Voici les espaces de gestion autorisés pour votre compte.</p><div className="admin-stat-grid"><div><span>CONTENUS</span><strong>—</strong><small>Statistiques disponibles après connexion à la base</small></div><div><span>MESSAGES REÇUS</span><strong>—</strong><small>Demandes de contact</small></div><div><span>ACCÈS</span><strong>{admin.permissions.size}</strong><small>Autorisations attribuées à votre rôle</small></div></div><div className="admin-module-heading"><h2>Modules de gestion</h2><span>ACCÈS AUTORISÉS</span></div><div className="admin-module-grid">{availableModules.map(([number, title, href, description]) => <Link href={href} key={href}><span>{number}</span><h3>{title}</h3><p>{description}</p><b>Ouvrir le module ↗</b></Link>)}</div></div></section>;
}
