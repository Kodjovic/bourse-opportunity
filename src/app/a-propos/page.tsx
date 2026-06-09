import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    `${SITE_NAME} est un directory pour aider les étudiants et ` +
    "chercheurs africains à trouver les financements adaptés à leur projet.",
  alternates: { canonical: "/a-propos" },
};

export default function PageAPropos() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb
        entries={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
      />

      <header className="mt-6">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          À propos
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          {SITE_NAME} référence et structure des opportunités de
          financement pour les étudiants et chercheurs originaires d&apos;Afrique,
          afin qu&apos;ils puissent accéder plus facilement aux programmes
          internationaux.
        </p>
      </header>

      <section className="mt-10 space-y-4 text-stone-700">
        <p>
          Le directory est alimenté à partir de sources publiques (sites
          d&apos;organisations, programmes officiels, universités) et chaque
          opportunité est structurée pour faciliter la recherche par niveau,
          pays et type de financement.
        </p>
        <p>
          Cette section est en construction. Une page contact et l&apos;historique
          du projet seront ajoutés prochainement.
        </p>
      </section>
    </main>
  );
}
