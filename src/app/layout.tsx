import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  // Base absolue : transforme les `canonical` / OpenGraph relatifs des pages
  // (ex. "/bourses/xxx") en URLs absolues. Indispensable pour le SEO/partage.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bourses africaines",
    template: "%s · Bourses africaines",
  },
  description:
    "Directory de bourses d'études pour étudiants et chercheurs africains. " +
    "Trouvez la bourse adaptée à votre niveau, votre pays et votre domaine.",
  applicationName: "Bourses africaines",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bourses africaines",
    url: "/",
    title: "Bourses africaines",
    description:
      "Bourses, fellowships et grants sélectionnés pour les étudiants et " +
      "chercheurs africains. Mis à jour quotidiennement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bourses africaines",
    description:
      "Bourses, fellowships et grants pour les étudiants et chercheurs africains.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900 font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
