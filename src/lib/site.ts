/**
 * URL canonique du site — source unique pour metadataBase, sitemap et robots.
 *
 * En production, définir la variable d'environnement NEXT_PUBLIC_SITE_URL dans
 * Vercel (ex. https://bourses-africaines.com). Le fallback ci-dessous sert en
 * local et tant que le domaine définitif n'est pas fixé : remplacez-le par
 * votre URL Vercel dès que vous l'avez.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bourses-africaines.vercel.app"
).replace(/\/$/, "");
