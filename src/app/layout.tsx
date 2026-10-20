import type { Metadata } from "next";
import "./globals.css";
import "./extras.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "DOUKAGA Destinée Hermella | Site officiel",
  description: "Le site officiel de DOUKAGA Destinée Hermella. Parcours, actions, publications et actualités.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
