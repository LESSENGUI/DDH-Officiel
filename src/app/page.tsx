import Image from "next/image";
import Link from "next/link";
import ScrollMotion from "@/components/scroll-motion";

const photos = [
  { src: "/images/Act1.jpg", alt: "Rencontre avec les habitants lors d’une visite de terrain", label: "Au plus près des populations" },
  { src: "/images/Act2.jpg", alt: "Échange avec des habitants au bord du fleuve", label: "Écouter, comprendre, agir" },
  { src: "/images/Herro accueil.jpg", alt: "Cérémonie officielle à l’Assemblée nationale", label: "L’engagement institutionnel" },
];

export default function Home() {
  return <>
    <ScrollMotion />
    <section className="hero home-hero">
      <div className="home-hero-photo">
        <Image src="/images/Herro accueil.jpg" alt="DOUKAGA Destinée Hermella à l’Assemblée nationale" fill priority sizes="(max-width: 760px) 100vw, 62vw" className="home-hero-image" />
      </div>
      <div className="home-hero-content">
        <div className="home-hero-copy">
          <p className="home-hero-kicker"><span />INGÉNIEURE · ENGAGEMENT PUBLIC</p>
          <h1>DOUKAGA<br /><em>Destinée</em><br />Hermella</h1>
          <p className="home-hero-role">Deuxième Questeur de l’Assemblée nationale</p>
          <p className="home-hero-intro">Un parcours guidé par le service, l’engagement et l’ambition d’agir pour le Congo.</p>
          <div className="home-hero-actions">
            <Link className="home-hero-primary" href="/a-propos">Découvrir son parcours <span>→</span></Link>
            <Link className="home-hero-secondary" href="/actions">Voir ses actions <span>→</span></Link>
          </div>
          <div className="home-hero-highlights" aria-label="Ses engagements">
            <div><span>01</span><p><strong>ÉDUCATION</strong><small>Former aujourd’hui</small></p></div>
            <div><span>02</span><p><strong>SERVICE PUBLIC</strong><small>Agir pour tous</small></p></div>
            <div><span>03</span><p><strong>CONGO</strong><small>Un avenir meilleur</small></p></div>
          </div>
        </div>
      </div>
      <div className="hero-ribbon" role="img" aria-label="Parcours : ingénieure, docteure, ancienne pilote, écrivaine, femme politique, députée, deuxième questeur">
        <div className="hero-ribbon-track">
          {[0, 1].map((copy) => (
            <div className="hero-ribbon-group" key={copy} aria-hidden="true">
              <span>INGÉNIEURE</span><b>✳</b>
              <span>DOCTEURE</span><b>✳</b>
              <span>ANCIENNE PILOTE</span><b>✳</b>
              <span>ÉCRIVAINE</span><b>✳</b>
              <span>FEMME POLITIQUE</span><b>✳</b>
              <span>DÉPUTÉE</span><b>✳</b>
              <span>DEUXIÈME QUESTEUR</span><b>✳</b>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="intro-section section-pad" data-reveal><div className="section-heading"><span className="eyebrow">UN PARCOURS, PLUSIEURS VIES</span><span className="section-count">01 / 04</span></div><div className="intro-grid"><h2>De la <em>précision</em><br />de l’ingénieure<br />à l’action publique.</h2><div className="intro-copy"><p>Ingénieure, docteure, ancienne pilote, écrivaine et femme politique (Députée du distric de Nyanag), DOUKAGA Destinée Hermella porte un regard ouvert sur les défis de son époque.</p><p>Son parcours se construit à la croisée de l’expertise, de l’engagement et de la volonté de contribuer au développement du Congo.</p><Link className="underlined-link" href="/a-propos">Lire son histoire <span>↗</span></Link></div></div></section>

    <section className="roles-section" data-reveal><div className="roles-header"><div><span className="eyebrow">UN ENGAGEMENT AU CROISEMENT DES EXPÉRIENCES</span><h2>Un parcours <em>en mouvement.</em></h2></div><span className="roles-side-note">EXPERTISE · SERVICE · TRANSMISSION</span></div><div className="role-list">{[
      { title: "Ingénieure & docteure", href: "/a-propos/parcours-professionnel" },
      { title: "Ancienne pilote", href: "/a-propos/parcours-professionnel" },
      { title: "Écrivaine & intellectuelle", href: "/a-propos/parcours-professionnel" },
      { title: "Femme politique", href: "/a-propos/parcours-professionnel" },
      { title: "Ancienne ministre", href: "/a-propos/parcours-professionnel" },
      { title: "Députée de Nyanga", href: "/a-propos/parcours-politique" },
      { title: "Deuxième Questeur de l’Assemblée nationale", href: "/a-propos/parcours-politique" },
    ].map((role, index) => <Link href={role.href} className="role-row" key={role.title}><span className="role-number">0{index + 1}</span><span className="role-title">{role.title}</span><span className="role-arrow">↗</span></Link>)}</div></section>

    <section className="actions-section section-pad" data-reveal><div className="section-heading"><span className="eyebrow">AU SERVICE DE L’ACTION</span><span className="section-count">02 / 04</span></div><div className="actions-intro"><h2>Faire avancer<br /><em>ce qui compte.</em></h2><p>Des initiatives présentées avec transparence : leur contexte, le rôle exercé, les partenaires et les résultats documentés.</p><Link className="button button-outline" href="/actions">Explorer les actions <span>↗</span></Link></div><div className="action-cards">
      <Link href="/actions/parlementaires" className="action-card action-card-red"><span className="card-index">01 — INSTITUTION</span><span className="action-card-icon">§</span><h3>Engagement<br />parlementaire</h3><span className="card-bottom">Activités & responsabilités <b>↗</b></span></Link>
      <Link href="/actions/education-formation" className="action-card action-card-gold"><span className="card-index">02 — TRANSMISSION</span><span className="action-card-icon">✳</span><h3>Éducation<br />& formation</h3><span className="card-bottom">Jeunesse & compétences <b>↗</b></span></Link>
      <Link href="/actions/developpement-infrastructures" className="action-card action-card-green"><span className="card-index">03 — TERRITOIRE</span><span className="action-card-icon">⌁</span><h3>Développement<br />local</h3><span className="card-bottom">Projets & initiatives <b>↗</b></span></Link>
    </div></section>

    <section className="photo-section" data-reveal><div className="photo-heading"><div><span className="eyebrow">INSTANTS D’ENGAGEMENT</span><h2>Sur le terrain,<br /><em>au quotidien.</em></h2></div><Link href="/actualites/galerie" className="text-link">Toute la galerie <span>↗</span></Link></div><div className="photo-track">{[...photos, ...photos].map((photo, index) => <article className="photo-item" key={`${photo.src}-${index}`}><div className="photo-image"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 78vw, 38vw" className="photo-img" /></div><div className="photo-caption"><span>{photo.label}</span><span>0{(index % 3) + 1} / 03</span></div></article>)}</div><div className="photo-track-note">FAIRE DÉFILER <span>⟶</span></div></section>

    <section className="quote-section" data-reveal><span className="quote-mark">✳</span><div><span className="eyebrow">UNE LIGNE DIRECTRICE</span><blockquote>Écoute, compétence et action au service de l’intérêt général.</blockquote><span className="quote-credit">ENGAGEMENT · SERVICE PUBLIC · TRANSMISSION</span></div><div className="quote-seal">DDH<span>✳</span></div></section>

    <section className="news-section section-pad" data-reveal><div className="section-heading"><span className="eyebrow">RESTER INFORMÉE</span><span className="section-count">03 / 04</span></div><div className="news-heading"><h2>La vie publique,<br /><em>en mouvement.</em></h2><Link className="underlined-link" href="/actualites">Toutes les actualités <span>↗</span></Link></div><div className="news-placeholder"><span className="news-date">ACTUALITÉS OFFICIELLES</span><p>Les dernières activités et prises de parole seront publiées ici.</p><Link href="/actualites/toutes">Accéder aux actualités <span>↗</span></Link></div></section>

    <section className="contact-band"><div><span className="eyebrow">ÉCHANGER, PROPOSER, COLLABORER</span><h2>La conversation<br /><em>continue.</em></h2></div><Link className="button button-light" href="/contact">Prendre contact <span>↗</span></Link><span className="contact-band-mark">DDH</span></section>
  </>;
}
