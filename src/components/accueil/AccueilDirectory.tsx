"use client";

import { useMemo, useState } from "react";

import type { Bourse } from "@/types/bourse";

import { BlocALaUne } from "./BlocALaUne";
import { LigneBourse } from "./LigneBourse";
import { IconArrowDown, IconSearch } from "./icones";

/**
 * Page d'accueil « directory » (Client Component) : héro + recherche, stats,
 * filtres par catégorie (pills), bourse à la une, et liste éditoriale.
 *
 * Les données arrivent déjà triées par pertinence (cf. scoring côté serveur) ;
 * ce composant ne gère que l'interaction (recherche live + filtre actif).
 */

type FiltreId = "all" | "fellowship" | "master" | "phd" | "licence" | "grant";

// Ajouter un filtre = ajouter une entrée ici, rien d'autre.
const FILTRES: { id: FiltreId; label: string; match?: (b: Bourse) => boolean }[] = [
  { id: "all", label: "Toutes" },
  { id: "fellowship", label: "Fellowship", match: (b) => typeInclut(b, "fellowship") },
  { id: "master", label: "Master", match: (b) => b.niveau_etudes.includes("master") },
  {
    id: "phd",
    label: "PhD",
    match: (b) => b.niveau_etudes.some((n) => n === "phd" || n === "doctorat"),
  },
  { id: "licence", label: "Licence", match: (b) => b.niveau_etudes.includes("licence") },
  { id: "grant", label: "Grant", match: (b) => typeInclut(b, "grant") },
];

function typeInclut(b: Bourse, mot: string): boolean {
  return (b.type_financement ?? "").toLowerCase().includes(mot);
}

export function AccueilDirectory({
  bourses,
  aLaUne,
}: {
  bourses: Bourse[];
  aLaUne: Bourse | null;
}) {
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<FiltreId>("all");

  // Stats temps réel
  const nbActives = useMemo(
    () => bourses.filter((b) => b.statut === "ouvert").length,
    [bourses]
  );
  const nbOrganisations = useMemo(
    () => new Set(bourses.map((b) => b.organisation).filter(Boolean)).size,
    [bourses]
  );

  // On ne montre la bourse à la une que sans recherche ni filtre actif
  const afficherALaUne = aLaUne && filtre === "all" && recherche.trim() === "";

  const filtrees = useMemo(() => {
    const def = FILTRES.find((f) => f.id === filtre);
    const r = recherche.trim().toLowerCase();
    return bourses.filter((b) => {
      if (afficherALaUne && b.slug === aLaUne?.slug) return false; // évite le doublon
      if (def?.match && !def.match(b)) return false;
      if (r) {
        const corpus = [
          b.titre,
          b.organisation,
          b.resume,
          ...b.pays_eligibles,
          ...b.niveau_etudes,
          ...b.domaines,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!corpus.includes(r)) return false;
      }
      return true;
    });
  }, [bourses, filtre, recherche, afficherALaUne, aLaUne]);

  function scrollVersListe() {
    document.getElementById("liste")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      {/* ---------- Héro ---------- */}
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
        <span className="h-px w-8 bg-stone-300" />
        Directory · Bourses &amp; Fellowships
      </p>

      <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] text-stone-900 sm:text-5xl">
        Des opportunités pour
        <br />
        <span className="italic text-brand-700">le Monde de demain</span>
      </h1>

      <p className="mt-4 max-w-xl text-stone-600">
        Bourses, fellowships et grants sélectionnés pour les étudiants et
        chercheurs africains. Mis à jour quotidiennement.
      </p>

      {/* Recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          scrollVersListe();
        }}
        role="search"
        className="mt-7 flex max-w-2xl items-center gap-3"
      >
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une bourse, un domaine, un pays…"
            aria-label="Rechercher des bourses"
            className="w-full rounded-lg border border-stone-300 bg-white py-3 pl-11 pr-4 text-stone-900 placeholder-stone-400 shadow-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 transition hover:border-brand-700 hover:text-brand-700"
        >
          Rechercher
        </button>
      </form>

      <hr className="mt-10 border-stone-200" />

      {/* ---------- Stats ---------- */}
      <div className="mt-8 flex items-end gap-10">
        <Stat valeur={nbActives} label="Bourses actives" />
        <Stat valeur={nbOrganisations} label="Organisations" />
        <Stat valeur="40+" label="Pays éligibles" />
        <button
          type="button"
          onClick={scrollVersListe}
          aria-label="Voir les bourses"
          className="ml-auto hidden size-10 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition hover:border-brand-700 hover:text-brand-700 sm:flex"
        >
          <IconArrowDown className="size-5" />
        </button>
      </div>

      {/* ---------- Filtres ---------- */}
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTRES.map((f) => {
          const actif = f.id === filtre;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltre(f.id)}
              aria-pressed={actif}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                actif
                  ? "border border-brand-900 bg-brand-900 text-white"
                  : "border border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ---------- À la une ---------- */}
      {afficherALaUne && aLaUne && (
        <section className="mt-10">
          <Libelle texte="À la une" />
          <div className="mt-4">
            <BlocALaUne bourse={aLaUne} />
          </div>
        </section>
      )}

      {/* ---------- Toutes les bourses ---------- */}
      <section id="liste" className="mt-12 scroll-mt-8">
        <Libelle texte={`Toutes les bourses (${filtrees.length})`} />

        {filtrees.length === 0 ? (
          <p className="mt-6 rounded-xl border border-stone-200 bg-white p-10 text-center text-stone-600">
            Aucune bourse ne correspond à ces critères.
          </p>
        ) : (
          <div className="mt-2 border-t border-stone-200">
            {filtrees.map((b) => (
              <LigneBourse key={b.slug || b.source_url} bourse={b} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
function Stat({ valeur, label }: { valeur: number | string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
        {valeur}
      </div>
      <div className="mt-1 text-sm text-stone-500">{label}</div>
    </div>
  );
}

function Libelle({ texte }: { texte: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
        {texte}
      </h2>
      <span className="h-px flex-1 bg-stone-200" />
    </div>
  );
}
