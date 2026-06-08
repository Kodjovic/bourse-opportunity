"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Petit formulaire de recherche visible dans le header.
 * Soumet vers /bourses/ouvertes?q=... ; le filtre côté liste lit ce
 * paramètre via useSearchParams pour pré-remplir la zone de recherche.
 */
export function SearchForm() {
  const router = useRouter();
  const [valeur, setValeur] = useState("");

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    const v = valeur.trim();
    const url = v
      ? `/bourses/ouvertes?q=${encodeURIComponent(v)}`
      : "/bourses/ouvertes";
    router.push(url);
  }

  return (
    <form
      onSubmit={soumettre}
      role="search"
      className="flex w-full max-w-xs items-center gap-1.5"
    >
      <label htmlFor="header-search" className="sr-only">
        Rechercher une bourse
      </label>
      <input
        id="header-search"
        type="search"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        placeholder="Rechercher une bourse…"
        className="w-full rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm placeholder-stone-400 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
      />
    </form>
  );
}
