import ContactForm from "@/components/contact-form";
import PageHero from "@/components/page-hero";

export default function ContactPage() {
  return <><PageHero variant="contact" eyebrow="ÉCHANGE · INFORMATION · PARTENARIAT" title="Entrons en contact." intro="Pour une demande institutionnelle, une invitation, une proposition de partenariat ou une demande de presse." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} /><section className="inner-body"><div className="inner-content contact-page"><aside className="contact-aside"><span className="eyebrow">NOUS ÉCRIRE</span><h2>Votre message<br />est le bienvenu.</h2><p>Utilisez le formulaire pour préciser votre demande. Les champs obligatoires sont marqués par le formulaire.</p><p>Les coordonnées publiques seront ajoutées après confirmation des informations officielles.</p></aside><ContactForm /></div></section></>;
}
