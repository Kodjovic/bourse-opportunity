"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { BourseCard } from "@/components/BourseCard";
import type { Bourse } from "@/types/bourse";

/**
 * Liste filtrable de bourses (Client Component).
 *
 * Rendu côté serveur au build (SSR), puis hydraté côté client : Google voit
 * le HTML complet, l'utilisateur a une UX réactive sans rechargement.
 *
 * On peut cacher certains filtres si la page est déjà focalisée sur un
 * critère (ex : sur /bourses/niveau/master, on cache le filtre Niveau).
 */
type Props = {
  bourses: Bourse[];
  cacherFiltreNiveau?: boolean;
  cacherFiltrePays?: boolean;
};

/**
 * Wrapper exporté : `useSearchParams()` (dans ListeBoursesInner) exige une
 * frontière <Suspense> pour le prérendu statique sous Next 16.
 */
export function ListeBourses(props: Props) {
  return (
    <Suspense fallback={null}>
      <ListeBoursesInner {...props} />
    </Suspense>
  );
}

function ListeBoursesInner({
  bourses,
  cacherFiltreNiveau = false,
  cacherFiltrePays = false,
}: Props) {
  // ?q=... permet de pré-remplir depuis le formulaire de recherche du header
  const searchParams = useSearchParams();
  const requeteInitiale = searchParams?.get("q") ?? "";

  const [recherche, setRecherche] = useState(requeteInitiale);
  const [paysSelectionnes, setPaysSelectionnes] = useState<string[]>([]);
  const [niveauxSelectionnes, setNiveauxSelectionnes] = useState<string[]>([]);

  // Listes uniques calculées une fois
  const paysDispo = useMemo(() => {
    const set = new Set<string>();
    for (const b of bourses) for (const p of b.pays_eligibles) set.add(p);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [bourses]);

  const niveauxDispo = useMemo(() => {
    const set = new Set<string>();
    for (const b of bourses) for (const n of b.niveau_etudes) set.add(n);
    return Array.from(set).sort();
  }, [bourses]);

  // Filtrage combiné
  const filtrees = useMemo(() => {
    return bourses.filter((b) => {
      if (recherche.trim()) {
        const r = recherche.toLowerCase();
        const corpus = [
          b.titre,
          b.organisation,
          b.resume,
          ...b.pays_eligibles,
          ...b.niveau_etudes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!corpus.includes(r)) return false;
      }
      if (
        paysSelectionnes.length > 0 &&
        !paysSelectionnes.some((p) => b.pays_eligibles.includes(p))
      ) {
        return false;
      }
      if (
        niveauxSelectionnes.length > 0 &&
        !niveauxSelectionnes.some((n) => b.niveau_etudes.includes(n))
      ) {
        return false;
      }
      return true;
    });
  }, [bourses, recherche, paysSelectionnes, niveauxSelectionnes]);

  const aDesFiltres =
    recherche || paysSelectionnes.length > 0 || niveauxSelectionnes.length > 0;

  function reinitialiser() {
    setRecherche("");
    setPaysSelectionnes([]);
    setNiveauxSelectionnes([]);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div>
          <label
            htmlFor="recherche-bourses"
            className="text-xs font-semibold uppercase tracking-widest text-stone-500"
          >
            Rechercher
          </label>
          <input
            id="recherche-bourses"
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Titre, organisation..."
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>

        {!cacherFiltreNiveau && niveauxDispo.length > 1 && (
          <GroupeFiltres
            titre="Niveau d'études"
            options={niveauxDispo}
            valeurs={niveauxSelectionnes}
            setValeurs={setNiveauxSelectionnes}
            max={6}
          />
        )}

        {!cacherFiltrePays && paysDispo.length > 1 && (
          <GroupeFiltres
            titre="Pays éligibles"
            options={paysDispo}
            valeurs={paysSelectionnes}
            setValeurs={setPaysSelectionnes}
            max={10}
          />
        )}

        {aDesFiltres && (
          <button
            type="button"
            onClick={reinitialiser}
            className="text-sm text-orange-700 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </aside>

      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-stone-500">
            {filtrees.length} bourse{filtrees.length > 1 ? "s" : ""} trouvée
            {filtrees.length > 1 ? "s" : ""}
            {aDesFiltres && (
              <span className="text-stone-400"> sur {bourses.length}</span>
            )}
          </p>
        </div>

        {filtrees.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-stone-600">
              Aucune bourse ne correspond à ces critères.
            </p>
            {aDesFiltres && (
              <button
                type="button"
                onClick={reinitialiser}
                className="mt-3 text-sm font-medium text-orange-700 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtrees.map((b) => (
              <BourseCard key={b.slug || b.source_url} bourse={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
function GroupeFiltres({
  titre,
  options,
  valeurs,
  setValeurs,
  max,
}: {
  titre: string;
  options: string[];
  valeurs: string[];
  setValeurs: (v: string[]) => void;
  max: number;
}) {
  const [tousAffiches, setTousAffiches] = useState(false);
  const visibles = tousAffiches ? options : options.slice(0, max);

  function toggle(v: string) {
    setValeurs(
      valeurs.includes(v) ? valeurs.filter((x) => x !== v) : [...valeurs, v]
    );
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        {titre}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {visibles.map((o) => (
          <li key={o}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={valeurs.includes(o)}
                onChange={() => toggle(o)}
                className="size-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="capitalize">{o}</span>
            </label>
          </li>
        ))}
      </ul>
      {options.length > max && (
        <button
          type="button"
          onClick={() => setTousAffiches(!tousAffiches)}
          className="mt-2 text-xs font-medium text-orange-700 hover:underline"
        >
          {tousAffiches ? "Réduire" : `Voir tout (${options.length})`}
        </button>
      )}
    </div>
  );
}
