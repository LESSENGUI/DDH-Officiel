import Link from "next/link";
import HeroCanvas from "@/components/hero-canvas";

type Breadcrumb = { label: string; href?: string };

export default function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <section className="inner-hero page-hero">
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
        <div className="page-hero-orbit page-hero-orbit-one" />
        <div className="page-hero-orbit page-hero-orbit-two" />
        <div className="page-hero-glow" />
        <div className="page-hero-scene"><HeroCanvas /></div>
        <span className="page-hero-monogram">DDH</span>
        <span className="page-hero-art-caption">ENGAGEMENT · SERVICE · TRANSMISSION</span>
      </div>
      <span className="page-hero-index">DOUKAGA DESTINÉE HERMELLA <i /> RÉPUBLIQUE DU CONGO</span>
    </section>
  );
}
