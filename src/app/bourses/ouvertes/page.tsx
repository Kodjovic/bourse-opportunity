import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ListeBourses } from "@/components/ListeBourses";
import { getAllBourses } from "@/lib/bourses";

export const metadata: Metadata = {
  title: "Bourses ouvertes aux candidatures",
  description:
    "Toutes les bourses pour étudiants et chercheurs africains actuellement " +
    "ouvertes aux candidatures. Filtre par niveau d'études et pays éligible.",
  alternates: { canonical: "/bourses/ouvertes" },
};

export default async function PageBoursesOuvertes() {
  const toutes = await getAllBourses();
  const ouvertes = toutes.filter((b) => b.statut === "ouvert");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumb
        entries={[
          { label: "Accueil", href: "/" },
          { label: "Bourses", href: "/bourses" },
          { label: "Ouvertes" },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Catégorie
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Bourses ouvertes aux candidatures
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Toutes les bourses pour étudiants et chercheurs africains qui
          acceptent encore les candidatures. Affine ta recherche par niveau
          d'études ou pays éligible pour cibler celles qui te correspondent,
          puis prépare ton dossier avant la date limite.
        </p>
      </header>

      <div className="mt-10">
        <ListeBourses bourses={ouvertes} />
      </div>
    </main>
  );
}
