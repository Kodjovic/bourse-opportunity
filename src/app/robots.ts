import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * robots.txt : autorise tout le crawl et déclare l'emplacement du sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
