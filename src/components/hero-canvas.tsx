"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false, loading: () => <div className="scene-loading" /> });

export default function HeroCanvas() {
  return <HeroScene />;
}
