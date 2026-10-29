import Link from "next/link";
import { navigation } from "@/lib/site";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100063492199643", icon: "facebook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hermella-doukaga-351962411", icon: "linkedin" },
  { label: "X", href: "https://x.com/DoukagaDestine1", icon: "x" },
  { label: "E-mail", href: "mailto:juvalinlessengui@gmail.com", icon: "email" },
  { label: "WhatsApp", href: "https://wa.me/message/2VWPINXB6L34A1", icon: "whatsapp" },
  { label: "TikTok", href: "https://www.tiktok.com/@christjuvalin1?_r=1&_t=ZS-9AwlJ7gWJyq", icon: "tiktok" },
] as const;

type SocialIconName = (typeof socialLinks)[number]["icon"];

function SocialIcon({ name }: { name: SocialIconName }) {
  const paths: Record<SocialIconName, React.ReactNode> = {
    facebook: <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4z" />,
    linkedin: <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.42v6.32ZM5.36 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.58V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56c0 .95.79 1.72 1.77 1.72h20.44c.98 0 1.79-.77 1.79-1.72V1.72C24 .77 23.2 0 22.22 0Z" />,
    x: <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.84h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.59l5.25 6.94 6.06-6.94Zm-1.29 19.49h2.04L6.48 3.24H4.29l13.32 17.4Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    whatsapp: <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z" /><path d="M8.2 7.8c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4 0 .6l-.6.7c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .3-.2 1-.7 1.4-.5.5-1.2.7-1.8.6-.7-.1-1.6-.4-2.8-1.1-1.4-.8-2.4-2-2.8-2.7-.4-.7-.8-1.7-.8-2.5 0-.8.4-1.3.7-1.5Z" /></>,
    tiktok: <path d="M19.6 6.1a5.1 5.1 0 0 1-3.2-3.2V2h-3.5v13.6a2.9 2.9 0 1 1-2-2.8v-3.6a6.4 6.4 0 1 0 5.5 6.4V8.7a8.5 8.5 0 0 0 4.9 1.5V6.7a5.1 5.1 0 0 1-1.7-.6Z" />,
  };

  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-identity">
        <Link className="brand footer-brand" href="/"><span className="brand-seal"><span>DDH</span></span><span className="brand-name">DOUKAGA <b>Destinée Hermella</b></span></Link>
        <p>Le site officiel de DOUKAGA Destinée Hermella.</p>
        <Link className="footer-contact-button footer-identity-button" href="/contact">Écrire un message <span>↗</span></Link>
      </div>
      <nav className="footer-navigation" aria-label="Navigation de pied de page">
        <span className="footer-heading">Explorer</span>
        {navigation.map((group) => <Link href={group.href} key={group.href}>{group.label}</Link>)}
      </nav>
      <nav className="footer-social" aria-label="Réseaux sociaux et contacts">
        <span className="footer-heading">Suivre & contacter</span>
        <div className="footer-social-links">
          {socialLinks.map((social) => (
            <a
              className={`footer-social-link footer-social-${social.icon}`}
              href={social.href}
              key={social.label}
              aria-label={social.label}
              title={social.label}
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            >
              <span className="footer-social-icon"><SocialIcon name={social.icon} /></span>
              <span>{social.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} DOUKAGA Destinée Hermella</span>
      <span>Site officiel · République du Congo</span>
      <Link href="/admin/login">Administration ↗</Link>
    </div>
  </footer>;
}
