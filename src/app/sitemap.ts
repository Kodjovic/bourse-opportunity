import type { MetadataRoute } from "next";

import {
  getAllBourses,
  getNiveauxUniques,
  getPaysUniques,
} from "@/lib/bourses";
import { SITE_URL } from "@/lib/site";
import { slugifyClient } from "@/lib/utils";

/**
 * Sitemap généré au build à partir du JSON consolidé.
 * Couvre : pages statiques, une URL par bourse, et les pages facettes
 * (niveau / pays) — exactement les routes que Next prérend en SSG.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bourses = await getAllBourses();

  const statiques: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/bourses`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/bourses/ouvertes`, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${SITE_URL}/bourses/entierement-financees`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
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

  return [...statiques, ...fiches, ...niveaux, ...pays];
}
