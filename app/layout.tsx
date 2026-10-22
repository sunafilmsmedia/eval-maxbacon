import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Manrope, Space_Grotesk } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import { BRAND } from "@/lib/brand";
import "./globals.css";

// Police générale — texte courant, remplace DM Sans.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Police spéciale (accent) — segments shimmer, signature, gros chiffres. Remplace Instrument Serif.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

// Police spéciale (affichage) — titres en gros bold majuscules. Remplace Montserrat.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND.teamName} — Est-ce le bon moment pour vendre ?`,
  description: `Une estimation personnalisée, propulsée par l'intelligence artificielle, pour savoir si le moment est favorable à la vente de votre propriété en ${BRAND.region}.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://exemple.vercel.app"),
  openGraph: {
    title: "Est-ce le bon moment pour vendre votre propriété ?",
    description: `Estimation personnalisée — ${BRAND.teamName}, courtier immobilier RE/MAX en ${BRAND.region}.`,
    locale: "fr_CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={`${manrope.variable} ${fraunces.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <Clarity />
        {children}
        <Script
          src="https://clarity-scanner.vercel.app/tracker.js"
          data-project={process.env.NEXT_PUBLIC_CLARITY_SCANNER_PROJECT ?? BRAND.slug}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
