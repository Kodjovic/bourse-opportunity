import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ListeBourses } from "@/components/ListeBourses";
import {
  getBoursesParNiveau,
  getNiveauxUniques,
} from "@/lib/bourses";
import { capitalize, slugifyClient } from "@/lib/utils";

type Props = {
  params: Promise<{ niveau: string }>;
};

// ------------------------------------------------------------------
// SSG : une page par niveau d&apos;études présent dans le JSON
// ------------------------------------------------------------------
export async function generateStaticParams() {
  const niveaux = await getNiveauxUniques();
  return niveaux.map((n) => ({ niveau: slugifyClient(n) }));
}

async function trouverNiveau(slug: string): Promise<string | null> {
  const niveaux = await getNiveauxUniques();
  return niveaux.find((n) => slugifyClient(n) === slug) ?? null;
}

// ------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niveau: slug } = await params;
  const label = await trouverNiveau(slug);
  if (!label) return { title: "Niveau introuvable" };
  return {
    title: `Bourses ${capitalize(label)} pour étudiants africains`,
    description: `Toutes les bourses d&apos;études de niveau ${label} ouvertes aux candidats africains. Filtre par pays éligible et trouve celle qui correspond à ton profil.`,
    alternates: { canonical: `/bourses/niveau/${slug}` },
  };
}

// ------------------------------------------------------------------
export default async function PageNiveau({ params }: Props) {
  const { niveau: slug } = await params;
  const label = await trouverNiveau(slug);
  if (!label) notFound();

  const bourses = await getBoursesParNiveau(label);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumb
        entries={[
          { label: "Accueil", href: "/" },
          { label: "Bourses", href: "/bourses" },
          { label: "Niveau" },
          { label: capitalize(label) },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Niveau d&apos;études
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Bourses de niveau {capitalize(label)}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Toutes les bourses d&apos;études de niveau <strong>{label}</strong> ouvertes
          aux étudiants et chercheurs africains. Affine la liste par pays
          éligible, et consulte les conditions d&apos;admission de chaque programme
          avant de candidater.
        </p>
      </header>

      <div className="mt-10">
        <ListeBourses bourses={bourses} cacherFiltreNiveau />
      </div>
    </main>
  );
}
