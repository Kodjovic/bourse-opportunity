/**
 * Loader des bourses depuis le JSON consolidé.
 *
 * Le fichier `site/data/bourses.json` est produit par
 * `scholarship_scraper/consolider.py`. Il est lu via `fs.readFile` au moment
 * du build (Server Components / generateStaticParams) — il n'arrive jamais
 * jusqu'au navigateur tant qu'on ne le passe pas explicitement en props.
 *
 * On utilise un cache module-scope : Next.js peut appeler les helpers
 * plusieurs fois pendant un build, inutile de relire le fichier à chaque fois.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import type { Bourse } from "@/types/bourse";

const CHEMIN_DATA = path.join(process.cwd(), "data", "bourses.json");

/**
 * Lit le JSON consolidé à chaque appel.
 *
 * - En dev : pas de cache → quand `consolider.py` met à jour le fichier,
 *   un simple refresh navigateur affiche les nouvelles bourses (pas besoin
 *   de relancer `npm run dev`).
 * - En prod (next build) : Next.js appelle ces fonctions une fois par page
 *   au moment de la génération statique ; le coût de relecture est
 *   négligeable face au build complet.
 */
export async function getAllBourses(): Promise<Bourse[]> {
  try {
    const contenu = await fs.readFile(CHEMIN_DATA, "utf-8");
    return JSON.parse(contenu) as Bourse[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn(
        `[bourses] Aucun fichier trouvé à ${CHEMIN_DATA}. ` +
          "Lance `python consolider.py` depuis scholarship_scraper/."
      );
      return [];
    }
    throw err;
  }
}

export async function getBourseBySlug(slug: string): Promise<Bourse | null> {
  const toutes = await getAllBourses();
  return toutes.find((b) => b.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  const toutes = await getAllBourses();
  return toutes.map((b) => b.slug).filter((s): s is string => Boolean(s));
}

// ---------- Facettes pour les pages SEO ----------

export async function getNiveauxUniques(): Promise<string[]> {
  const toutes = await getAllBourses();
  const set = new Set<string>();
  for (const b of toutes) b.niveau_etudes.forEach((n) => set.add(n));
  return Array.from(set).sort();
}

export async function getPaysUniques(): Promise<string[]> {
  const toutes = await getAllBourses();
  const set = new Set<string>();
  for (const b of toutes) b.pays_eligibles.forEach((p) => set.add(p));
  return Array.from(set).sort();
}

export async function getBoursesParNiveau(niveau: string): Promise<Bourse[]> {
  const toutes = await getAllBourses();
  return toutes.filter((b) => b.niveau_etudes.includes(niveau));
}

export async function getBoursesParPays(pays: string): Promise<Bourse[]> {
  const toutes = await getAllBourses();
  return toutes.filter((b) => b.pays_eligibles.includes(pays));
}

// ---------- Utilitaires ----------

/** Slug URL-safe, miroir de la fonction `slugify` côté Python. */
export function slugify(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}
