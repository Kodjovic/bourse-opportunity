import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Guides pour postuler aux bourses",
  description:
    "Conseils pratiques pour préparer ton dossier de candidature : CV, " +
    "lettre de motivation, recommandations, entretien.",
  alternates: { canonical: "/guides" },
};

export default function PageGuides() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb
        entries={[{ label: "Accueil", href: "/" }, { label: "Guides" }]}
      />

      <header className="mt-6">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Guides pour postuler aux bourses
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Bientôt : conseils pratiques pour rédiger ton CV, ta lettre de
          motivation, choisir tes lettres de recommandation et préparer ton
          entretien.
        </p>
      </header>

      <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-8">
        <p className="text-stone-600">
          Cette section est en cours de rédaction. Reviens bientôt — ou
          parcours dès maintenant les{" "}
          <a
            href="/bourses/ouvertes"
            className="font-medium text-orange-700 hover:underline"
          >
            bourses ouvertes
          </a>
          .
        </p>
      </div>
    </main>
  );
}
