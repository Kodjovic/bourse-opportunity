import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ListeBourses } from "@/components/ListeBourses";
import {
  getBoursesParPays,
  getPaysUniques,
} from "@/lib/bourses";
import { slugifyClient } from "@/lib/utils";

type Props = {
  params: Promise<{ pays: string }>;
};

// ------------------------------------------------------------------
// SSG : une page par pays présent dans le JSON
// ------------------------------------------------------------------
export async function generateStaticParams() {
  const pays = await getPaysUniques();
  return pays.map((p) => ({ pays: slugifyClient(p) }));
}

async function trouverPays(slug: string): Promise<string | null> {
  const tous = await getPaysUniques();
  return tous.find((p) => slugifyClient(p) === slug) ?? null;
}

// ------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pays: slug } = await params;
  const label = await trouverPays(slug);
  if (!label) return { title: "Pays introuvable" };
  return {
    title: `Bourses pour les étudiants du ${label}`,
    description: `Bourses d&apos;études internationales accessibles aux candidats du ${label}. Toutes les opportunités pour étudier à l&apos;étranger ou dans des programmes panafricains.`,
    alternates: { canonical: `/bourses/pays/${slug}` },
  };
}

// ------------------------------------------------------------------
export default async function PagePays({ params }: Props) {
  const { pays: slug } = await params;
  const label = await trouverPays(slug);
  if (!label) notFound();

  const bourses = await getBoursesParPays(label);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumb
        entries={[
          { label: "Accueil", href: "/" },
          { label: "Bourses", href: "/bourses" },
          { label: "Pays" },
          { label },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Par pays
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Bourses pour les étudiants du {label}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Toutes les bourses d&apos;études ouvertes aux candidats originaires du{" "}
          <strong>{label}</strong>. Que tu vises un master, un doctorat ou un
          programme de recherche, filtre par niveau et type de financement pour
          trouver la bourse la plus adaptée à ton projet.
        </p>
      </header>

      <div className="mt-10">
        <ListeBourses bourses={bourses} cacherFiltrePays />
      </div>
    </main>
  );
}
