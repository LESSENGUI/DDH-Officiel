"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, OrbitControls, Sphere, Torus } from "@react-three/drei";
import { useEffect, useState } from "react";

function Sculpture({ reducedMotion }: { reducedMotion: boolean }) {
  return <><ambientLight intensity={1.5} /><directionalLight position={[4, 5, 4]} intensity={3} color="#ffe4ad" /><pointLight position={[-3, -2, 2]} intensity={18} color="#b3312b" />
    <Float speed={reducedMotion ? 0 : 1.6} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.7}><Torus args={[1.26, 0.018, 16, 160]} rotation={[0.45, 0.22, -0.3]}><meshStandardMaterial color="#caa96b" metalness={0.82} roughness={0.22} /></Torus><Torus args={[1.06, 0.009, 12, 140]} rotation={[0.8, -0.7, 0.6]}><meshStandardMaterial color="#f1d7a0" metalness={0.8} roughness={0.18} /></Torus><Sphere args={[0.36, 64, 64]} position={[0.28, 0.08, 0.06]}><MeshDistortMaterial color="#dfbd7e" metalness={0.68} roughness={0.24} distort={0.16} speed={reducedMotion ? 0 : 1.2} /></Sphere></Float>
    <Environment preset="city" /><OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion} autoRotateSpeed={0.4} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.8} />
  </>;
}

export default function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return <Canvas camera={{ position: [0, 0, 4.4], fov: 44 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}><Sculpture reducedMotion={reducedMotion} /></Canvas>;
}
