import type { Metadata } from "next";

import { AccueilDirectory } from "@/components/accueil/AccueilDirectory";
import { getAllBourses } from "@/lib/bourses";
import { selectionnerALaUne, trierParPertinence } from "@/lib/scoring";

export const metadata: Metadata = {
  title: "Bourses & fellowships pour les étudiants et chercheurs africains",
  description:
    "Directory éditorial de bourses, fellowships et grants sélectionnés pour " +
    "les étudiants et chercheurs africains. Filtrez par niveau, pays et " +
    "domaine. Mis à jour quotidiennement.",
  alternates: { canonical: "/" },
};

/**
 * Page d'accueil — directory éditorial.
 *
 * Server Component : on lit le JSON, on calcule le scoring (tri + bourse à la
 * une) côté serveur, puis on délègue l'interaction (recherche, filtres) au
 * Client Component AccueilDirectory.
 */
export default async function Home() {
  const bourses = await getAllBourses();
  const triees = trierParPertinence(bourses);
  const aLaUne = selectionnerALaUne(bourses);

  return <AccueilDirectory bourses={triees} aLaUne={aLaUne} />;
}
