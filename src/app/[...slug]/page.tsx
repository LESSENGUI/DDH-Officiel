import Link from "next/link";
import { notFound } from "next/navigation";
import { findRoute, pageCopy } from "@/lib/site";
import PageHero from "@/components/page-hero";

type Props = { params: Promise<{ slug: string[] }> };

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  if (path === "/contact" || path.startsWith("/admin")) notFound();
  const route = findRoute(path);
  if (!route) notFound();
  const overview = pageCopy[path];
  const group = route.group;

  return <>
    <PageHero
      eyebrow={route.parent ? `${route.parent} · ${route.title}` : "DOUKAGA DESTINÉE HERMELLA · SITE OFFICIEL"}
      title={overview?.title ?? route.title}
      intro={overview?.intro ?? `${route.title} : informations, repères et documents associés au parcours et aux engagements de DOUKAGA Destinée Hermella.`}
      variant={
        group.href === "/a-propos" ? "about"
          : group.href === "/actions" ? "actions"
            : group.href === "/publications" ? "publications"
              : "default"
      }
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        ...(route.parent ? [{ label: group.label, href: group.href }] : []),
        { label: route.title },
      ]}
    />
    <section className="inner-body"><div className="inner-content"><span className="eyebrow">{route.parent ? `${route.parent.toUpperCase()} · ${route.title.toUpperCase()}` : "EXPLORER LA RUBRIQUE"}</span>
      {route.parent ? <><p className="detail-intro">Les informations publiées dans cette rubrique ont vocation à être documentées et mises à jour. Les dates, fonctions, réalisations et références seront ajoutées après validation des sources correspondantes.</p><div className="detail-note"><span>INFORMATIONS À DOCUMENTer</span><p>La présentation distinguera les responsabilités exercées, les périodes concernées, le rôle précis de DDH et les sources disponibles, afin de garantir une information fidèle et vérifiable.</p></div><Link className="underlined-link" href={group.href}>Retour à {group.label.toLowerCase()} <span>↗</span></Link></> : <><p className="detail-intro">Parcourez les différentes facettes de cette rubrique. Chaque page détaillée est conçue pour présenter les informations utiles avec leurs repères et documents associés.</p><div className="inner-link-grid">{group.items.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}<span>↗</span></Link>)}</div></>}
    </div></section>
  </>;
}
