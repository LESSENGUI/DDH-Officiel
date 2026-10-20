"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => gsap.fromTo(element, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 90%", once: true } }));
      gsap.to(".hero-ribbon-track", { xPercent: -20, ease: "none", scrollTrigger: { trigger: ".hero-ribbon", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    });
    return () => context.revert();
  }, []);
  return null;
}
