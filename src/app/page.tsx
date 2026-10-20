import Image from "next/image";
import Link from "next/link";
import ScrollMotion from "@/components/scroll-motion";
import HeroCanvas from "@/components/hero-canvas";
import HeroEffects from "@/components/hero-effects";

const photos = [
  { src: "/images/Act1.jpg", alt: "Rencontre avec les habitants lors d’une visite de terrain", label: "Au plus près des populations" },
  { src: "/images/Act2.jpg", alt: "Échange avec des habitants au bord du fleuve", label: "Écouter, comprendre, agir" },
  { src: "/images/Herro accueil.jpg", alt: "Cérémonie officielle à l’Assemblée nationale", label: "L’engagement institutionnel" },
];

export default function Home() {
  return <>
    <ScrollMotion />
    <section className="hero">
      <Image src="/images/Act2.jpg" alt="" fill priority sizes="100vw" className="hero-backdrop" />
      <div className="hero-backdrop-shade" />
      <HeroEffects />
      <div className="hero-grid" />
      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="flag-mark"><i /><i /><i /></span><span>INGÉNIEURE · DOCTEURE · FEMME D’ENGAGEMENT</span></div>
          <h1>DOUKAGA<br /><em>Destinée</em><br />Hermella<span className="title-period">.</span></h1>
          <p className="hero-role">Deuxième Questeur de l’Assemblée nationale</p>
          <p className="hero-intro">Un parcours singulier, de l’ingénierie à la vie publique, guidé par le sens du service et l’ambition d’agir pour le Congo.</p>
          <div className="hero-actions"><Link className="button button-gold" href="/a-propos">Découvrir mon parcours <span>↗</span></Link><Link className="text-link" href="/actions">Voir les actions <span>→</span></Link></div>
          <div className="hero-index"><span>01</span><i /><span>05</span><span className="index-label">PARCOURS & ENGAGEMENT</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-glow" /><div className="scene-wrap"><HeroCanvas /></div>
          <div className="hero-photo-frame"><Image src="/images/Act2.jpg" alt="DOUKAGA Destinée Hermella échange avec les habitants" fill priority sizes="(max-width: 760px) 85vw, 43vw" className="hero-photo" /></div>
          <div className="hero-photo-caption"><span>ENGAGEMENT DE TERRAIN</span><span>RÉPUBLIQUE DU CONGO</span></div>
          <div className="hero-stamp"><span>DDH</span><i>ENGAGEMENT<br />& SERVICE</i></div><span className="hero-vertical">DOUKAGA DESTINÉE HERMELLA · SITE OFFICIEL</span>
        </div>
      </div>
      <div className="hero-ribbon"><div className="hero-ribbon-track">INGÉNIEURE <b>✳</b> DOCTEURE <b>✳</b> ANCIENNE PILOTE <b>✳</b> ÉCRIVAINE <b>✳</b> FEMME POLITIQUE <b>✳</b> DEUXIÈME QUESTEUR <b>✳</b> INGÉNIEURE <b>✳</b> DOCTEURE <b>✳</b> ANCIENNE PILOTE <b>✳</b> ÉCRIVAINE <b>✳</b></div></div>
      <span className="hero-scroll">DÉFILER POUR DÉCOUVRIR <span>↓</span></span>
    </section>

    <section className="intro-section section-pad" data-reveal><div className="section-heading"><span className="eyebrow">UN PARCOURS, PLUSIEURS VIES</span><span className="section-count">01 / 04</span></div><div className="intro-grid"><h2>De la <em>précision</em><br />de l’ingénieure<br />à l’action publique.</h2><div className="intro-copy"><p>Ingénieure, docteure, ancienne pilote, écrivaine et femme politique, DOUKAGA Destinée Hermella porte un regard ouvert sur les défis de son époque.</p><p>Son parcours se construit à la croisée de l’expertise, de l’engagement et de la volonté de contribuer au développement du Congo.</p><Link className="underlined-link" href="/a-propos">Lire son histoire <span>↗</span></Link></div></div></section>

    <section className="roles-section" data-reveal><div className="roles-header"><div><span className="eyebrow">UN ENGAGEMENT AU CROISEMENT DES EXPÉRIENCES</span><h2>Un parcours <em>en mouvement.</em></h2></div><span className="roles-side-note">EXPERTISE · SERVICE · TRANSMISSION</span></div><div className="role-list">{["Ingénieure & docteure", "Ancienne pilote", "Écrivaine & intellectuelle", "Femme politique", "Ancienne ministre", "Deuxième Questeur"].map((role, index) => <Link href={index === 5 ? "/a-propos/parcours-politique" : "/a-propos/parcours-professionnel"} className="role-row" key={role}><span className="role-number">0{index + 1}</span><span className="role-title">{role}</span><span className="role-arrow">↗</span></Link>)}</div></section>

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
