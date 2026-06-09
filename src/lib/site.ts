/**
 * Configuration globale du site - Afrik'Ose
 */
export const SITE_NAME = "Afrik'Ose";
export const SITE_SLOGAN = "Le directory des opportunités d'études pour l'Afrique";

/**
 * URL canonique du site — source unique pour metadataBase, sitemap et robots.
 */
const rawUrl = 
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://afrik-ose.com";

// Sécurité : s'assurer que l'URL commence par http(s) pour éviter les erreurs de build
const formattedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

export const SITE_URL = formattedUrl.replace(/\/$/, "");
