import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { BourseCard } from "@/components/BourseCard";
import {
  getAllBourses,
  getNiveauxUniques,
  getPaysUniques,
} from "@/lib/bourses";
import { capitalize, slugifyClient } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bourses africaines — toutes les opportunités",
  description:
    "Le directory de bourses d&apos;études pour les étudiants et chercheurs " +
    "africains. Bourses ouvertes, entièrement financées, par niveau et par " +
    "pays.",
  alternates: { canonical: "/bourses" },
};

export default async function PageBoursesLanding() {
  const toutes = await getAllBourses();
  const ouvertes = toutes.filter((b) => b.statut === "ouvert");
  const niveaux = await getNiveauxUniques();
  const paysTopN = (await getPaysUniques()).slice(0, 12);

  // 4 dernières ajoutées (extrait_le décroissant)
  const recentes = [...toutes]
    .sort((a, b) => (b.extrait_le || "").localeCompare(a.extrait_le || ""))
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumb
        entries={[{ label: "Accueil", href: "/" }, { label: "Bourses" }]}
      />

      <header className="mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Trouve la bourse qui te correspond.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          {toutes.length} bourse{toutes.length > 1 ? "s" : ""} référencée
          {toutes.length > 1 ? "s" : ""}, dont {ouvertes.length} actuellement{" "}
          ouverte{ouvertes.length > 1 ? "s" : ""} aux candidatures. Parcours par
          catégorie, niveau d&apos;études, ou pays éligible.
        </p>
      </header>

      {/* Catégories phares */}
      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CategorieCard
          href="/bourses/ouvertes"
          titre="Bourses ouvertes"
          sousTitre={`${ouvertes.length} opportunité${ouvertes.length > 1 ? "s" : ""} à saisir`}
          accent="from-emerald-50 to-emerald-100/50"
        />
        <CategorieCard
          href="/bourses/entierement-financees"
          titre="Entièrement financées"
          sousTitre="Frais, voyage, allocation : 100 % couverts"
          accent="from-orange-50 to-amber-100/50"
        />
      </section>

      {/* Dernières ajoutées */}
      {recentes.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Dernières bourses ajoutées
            </h2>
            <Link
              href="/bourses/ouvertes"
              className="text-sm font-medium text-orange-700 hover:underline"
            >
              Voir toutes les bourses →
            </Link>
          </div>
          <div className="mt-1 h-px w-12 bg-stone-300" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentes.map((b) => (
              <BourseCard key={b.slug || b.source_url} bourse={b} />
            ))}
          </div>
        </section>
      )}

      {/* Niveau d&apos;études */}
      {niveaux.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Par niveau d&apos;études
          </h2>
          <div className="mt-1 h-px w-12 bg-stone-300" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {niveaux.map((n) => (
              <li key={n}>
                <Link
                  href={`/bourses/niveau/${slugifyClient(n)}`}
                  className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:border-stone-400 hover:text-stone-900"
                >
                  {capitalize(n)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Par pays */}
      {paysTopN.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            Par pays
          </h2>
          <div className="mt-1 h-px w-12 bg-stone-300" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {paysTopN.map((p) => (
              <li key={p}>
                <Link
                  href={`/bourses/pays/${slugifyClient(p)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 hover:border-stone-400 hover:text-stone-900"
                >
                  <span className="size-1 rounded-full bg-orange-600" />
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

// ------------------------------------------------------------------
function CategorieCard({
  href,
  titre,
  sousTitre,
  accent,
}: {
  href: string;
  titre: string;
  sousTitre: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between rounded-2xl border border-stone-200 bg-gradient-to-br ${accent} p-6 transition hover:border-stone-300 hover:shadow-md`}
    >
      <div>
        <h3 className="font-serif text-2xl font-semibold text-stone-900">
          {titre}
        </h3>
        <p className="mt-1 text-sm text-stone-600">{sousTitre}</p>
      </div>
      <div className="mt-6 text-sm font-medium text-orange-700 group-hover:underline">
        Explorer →
      </div>
    </Link>
  );
}
