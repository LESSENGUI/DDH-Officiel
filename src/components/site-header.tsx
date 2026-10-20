"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { mainNavigation, navigation } from "@/lib/site";

export default function SiteHeader() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  return <>
    <div className="topline"><span>RÉPUBLIQUE DU CONGO</span><span>Unité · Travail · Progrès</span><a href="mailto:contact@ddh.cg">Contact institutionnel ↗</a></div>
    <header className="site-header" onMouseLeave={() => setActive(null)}>
      <Link className="brand" href="/" aria-label="Accueil DDH"><span className="brand-seal"><span>DDH</span></span><span className="brand-name">DOUKAGA <b>Destinée Hermella</b></span></Link>
      <nav className="desktop-nav" aria-label="Navigation principale">{mainNavigation.map((item) => {
        const group = navigation.find((entry) => entry.href === item.href);
        return group
          ? <div className="nav-item" key={item.href} onMouseEnter={() => setActive(group.label)}><Link href={item.href} aria-expanded={active === group.label}>{item.label}<span className="nav-caret">⌄</span></Link></div>
          : <Link className={item.href === "/" ? "home-link" : "contact-link"} href={item.href} key={item.href}>{item.label}{item.href === "/contact" && <span> ↗</span>}</Link>;
      })}</nav>
      <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={mobileOpen}><span /><span /></button>
      <AnimatePresence>{active && <motion.div className="mega-menu" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
        {navigation.filter((group) => group.label === active).map((group) => <div className="mega-inner" key={group.href}><div className="mega-intro"><span className="eyebrow">EXPLORER</span><h2>{group.label}</h2><p>{group.description}</p><Link href={group.href}>Découvrir la rubrique <span>↗</span></Link></div><div className="mega-links">{group.items.map((item, index) => <Link href={item.href} key={item.href}><span className="mega-number">{String(index + 1).padStart(2, "0")}</span>{item.label}<span className="mega-arrow">↗</span></Link>)}</div></div>)}
      </motion.div>}</AnimatePresence>
    </header>
    <AnimatePresence>{mobileOpen && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} aria-label="Navigation mobile">{mainNavigation.map((item) => <div key={item.href}><Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}<span>↗</span></Link></div>)}</motion.nav>}</AnimatePresence>
  </>;
}
