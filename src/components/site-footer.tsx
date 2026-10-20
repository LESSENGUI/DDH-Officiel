import Link from "next/link";
import { navigation } from "@/lib/site";

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity">
        <Link className="brand footer-brand" href="/"><span className="brand-seal"><span>DDH</span></span><span className="brand-name">DOUKAGA <b>Destinée Hermella</b></span></Link>
        <p>Le site officiel de DOUKAGA Destinée Hermella.</p>
        <span className="footer-motto">ÉCOUTE · ENGAGEMENT · SERVICE PUBLIC</span>
      </div>
      <nav className="footer-navigation" aria-label="Navigation de pied de page">
        <span className="footer-heading">Explorer</span>
        {navigation.map((group) => <Link href={group.href} key={group.href}>{group.label}</Link>)}
      </nav>
      <div className="footer-contact">
        <span className="footer-heading">Contact institutionnel</span>
        <p>Pour vos demandes, invitations et propositions de partenariat, écrivez-nous ou utilisez le formulaire de contact.</p>
        <a href="mailto:contact@ddh.cg">contact@ddh.cg <span>↗</span></a>
        <Link className="footer-contact-button" href="/contact">Écrire un message <span>↗</span></Link>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} DOUKAGA Destinée Hermella</span>
      <span>Site officiel · République du Congo</span>
      <Link href="/admin/login">Administration ↗</Link>
    </div>
  </footer>;
}
