/**
 * Utilitaires partagés entre Server et Client Components.
 * Pas d'import de `node:fs` ici, sinon les Client Components ne peuvent pas
 * l'utiliser.
 */

export function capitalize(s: string | null | undefined): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formaterDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Slug URL-safe, miroir de la fonction Python `slugify`. */
export function slugifyClient(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export type Countdown = {
  affichage: string;
  label: string;
  passe: boolean;
};

/**
 * Calcule un countdown lisible à partir d'une deadline ISO.
 * Si la deadline est dépassée → "0 clôturée".
 */
export function computerCountdown(iso: string | null): Countdown {
  if (!iso) return { affichage: "—", label: "non précisée", passe: false };
  const deadline = new Date(`${iso}T23:59:59`);
  const maintenant = new Date();
  const diffMs = deadline.getTime() - maintenant.getTime();
  const jours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (jours < 0) return { affichage: "0", label: "clôturée", passe: true };
  if (jours === 0) return { affichage: "0", label: "aujourd'hui", passe: false };
  return {
    affichage: `${jours}`,
    label: jours === 1 ? "jour restant" : "jours restants",
    passe: false,
  };
}
