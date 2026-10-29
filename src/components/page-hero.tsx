import Link from "next/link";

type Breadcrumb = { label: string; href?: string };
export type PageHeroVariant = "default" | "about" | "actions" | "publications" | "contact";

export default function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs: Breadcrumb[];
  variant?: PageHeroVariant;
}) {
  return (
    <section className={`inner-hero page-hero page-hero-${variant}`}>
      <div className="page-hero-copy">
        <nav className="breadcrumbs" aria-label="Fil d’Ariane">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </span>
          ))}
        </nav>
        <span className="page-hero-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="page-hero-art" aria-hidden="true">
        <div className={`page-hero-seal page-hero-seal-${variant}`}>
          <span>{variant === "actions" ? "ACTION" : variant === "contact" ? "✉" : "DDH"}</span>
          <i>{variant === "actions" ? "SERVICE PUBLIC" : variant === "contact" ? "CONTACT INSTITUTIONNEL" : "RÉPUBLIQUE DU CONGO"}</i>
        </div>
      </div>
      <span className="page-hero-index">DOUKAGA DESTINÉE HERMELLA <i /> RÉPUBLIQUE DU CONGO</span>
    </section>
  );
}
