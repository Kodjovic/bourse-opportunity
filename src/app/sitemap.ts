import type { MetadataRoute } from "next";

import {
  getAllBourses,
  getNiveauxUniques,
  getPaysUniques,
} from "@/lib/bourses";
import { getActualites } from "@/lib/actualites";
import { getAllDocuments } from "@/lib/epreuves";
import { SITE_URL } from "@/lib/site";
import { slugifyClient } from "@/lib/utils";

/**
 * Sitemap généré au build à partir du JSON consolidé.
 * Couvre : pages statiques, une URL par bourse, les actualités, les pages facettes
 * (niveau / pays) et les fiches d'épreuves (sujets, devoirs, compositions) —
 * exactement les routes que Next prérend en SSG.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bourses = await getAllBourses();
  const actualites = getActualites();

  const statiques: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/bourses`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/bourses/ouvertes`, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${SITE_URL}/bourses/entierement-financees`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/actualites`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/epreuves`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const fiches: MetadataRoute.Sitemap = bourses
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${SITE_URL}/bourses/${b.slug}`,
      lastModified: b.extrait_le ? new Date(b.extrait_le) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const fichesActualites: MetadataRoute.Sitemap = actualites
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${SITE_URL}/actualites/${a.slug}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : undefined,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const niveaux: MetadataRoute.Sitemap = (await getNiveauxUniques()).map((n) => ({
    url: `${SITE_URL}/bourses/niveau/${slugifyClient(n)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const pays: MetadataRoute.Sitemap = (await getPaysUniques()).map((p) => ({
    url: `${SITE_URL}/bourses/pays/${slugifyClient(p)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Fiches d'épreuves : le slug stocké est déjà le chemin complet
  // (« /epreuves/togo/bepc/2026/svt »), on ajoute donc seulement l'origine.
  const fichesEpreuves: MetadataRoute.Sitemap = (await getAllDocuments())
    .filter((doc) => doc.slug)
    .map((doc) => {
      const date = doc.created_at ? new Date(doc.created_at) : null;
      const valide = date !== null && !Number.isNaN(date.getTime());
      return {
        url: `${SITE_URL}${doc.slug}`,
        lastModified: valide ? (date as Date) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  const toutesLesEntrees = [
    ...statiques,
    ...fiches,
    ...fichesActualites,
    ...niveaux,
    ...pays,
    ...fichesEpreuves,
  ];

  // Une même fiche peut apparaître via plusieurs blocs : on ne garde que la
  // première occurrence de chaque URL (les blocs les plus prioritaires d'abord).
  const urlsVues = new Set<string>();
  return toutesLesEntrees.filter((entree) => {
    if (urlsVues.has(entree.url)) return false;
    urlsVues.add(entree.url);
    return true;
  });
}
