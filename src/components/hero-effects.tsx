"use client";

import { useEffect } from "react";

const particles = Array.from({ length: 18 }, (_, index) => index);

export default function HeroEffects() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 90);
        hero.style.setProperty("--hero-bg-offset", `${offset}px`);
        hero.style.setProperty("--hero-art-offset", `${offset * 0.45}px`);
      });
    };
    const updateTilt = (event: PointerEvent) => {
      if (event.pointerType === "touch" || window.innerWidth <= 700) return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      hero.style.setProperty("--hero-tilt-x", `${y * -4}deg`);
      hero.style.setProperty("--hero-tilt-y", `${x * 4}deg`);
    };
    const resetTilt = () => {
      hero.style.setProperty("--hero-tilt-x", "0deg");
      hero.style.setProperty("--hero-tilt-y", "0deg");
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    hero.addEventListener("pointermove", updateTilt);
    hero.addEventListener("pointerleave", resetTilt);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateParallax);
      hero.removeEventListener("pointermove", updateTilt);
      hero.removeEventListener("pointerleave", resetTilt);
    };
  }, []);

  return <div className="hero-particles" aria-hidden="true">{particles.map((particle) => <span key={particle} />)}</div>;
}
