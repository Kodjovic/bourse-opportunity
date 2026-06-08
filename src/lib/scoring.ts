/**
 * Scoring de pertinence des bourses — SÉPARÉ de l'UI.
 *
 * Le score est calculé au runtime à partir d'une `Bourse` (issue du JSON
 * consolidé) : il n'existe pas de colonne `score` en base. On l'utilise pour
 *  - choisir la bourse « À la une » (le meilleur score parmi les ouvertes) ;
 *  - trier la liste (les plus pertinentes d'abord, fermées/expirées en bas).
 *
 * Modifier la pondération ici ne touche aucun composant.
 */

import type { Bourse } from "@/types/bourse";

/** Jours avant la deadline : négatif si dépassée, `null` si inconnue. */
export function joursRestants(deadline: string | null): number | null {
  if (!deadline) return null;
  const fin = new Date(`${deadline}T23:59:59`);
  const diffMs = fin.getTime() - new Date().getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Score de pertinence (0–100). Plus c'est haut, plus la bourse remonte. */
export function calculerScore(b: Bourse): number {
  let score = 0;
  const j = joursRestants(b.deadline);

  // 1. Urgence (max 40) — une deadline proche est plus « actionnable »
  if (j !== null && j > 0) {
    if (j <= 15) score += 40;
    else if (j <= 30) score += 30;
    else if (j <= 60) score += 20;
    else if (j <= 90) score += 10;
  }

  // 2. Valeur financière (max 25)
  const complete = (b.type_financement ?? "").toLowerCase().includes("complèt");
  if (complete) score += 25;
  else if ((b.montant ?? 0) >= 20000) score += 20;
  else if ((b.montant ?? 0) >= 5000) score += 12;
  else score += 5;

  // 3. Accessibilité géographique (max 20)
  const pays = b.pays_eligibles;
  if (pays.some((p) => p.toLowerCase().includes("afriqu"))) score += 20;
  else if (pays.length >= 5) score += 12;
  else score += 4;

  // 4. Complétude des données (max 15) — une fiche complète inspire confiance
  const essentiels = [
    b.titre,
    b.montant,
    b.deadline,
    b.lien_candidature,
    b.resume,
    b.documents_requis.length > 0 ? "ok" : null,
  ];
  const remplis = essentiels.filter(Boolean).length;
  score += Math.round((remplis / essentiels.length) * 15);

  return score;
}

/**
 * Trie par pertinence : bourses ouvertes en premier (score décroissant),
 * puis fermées / à venir / expirées, atténuées en bas de liste.
 */
export function trierParPertinence(bourses: Bourse[]): Bourse[] {
  return [...bourses]
    .map((b) => ({ b, ouvert: b.statut === "ouvert" ? 1 : 0, score: calculerScore(b) }))
    .sort((x, y) => y.ouvert - x.ouvert || y.score - x.score)
    .map((e) => e.b);
}

/**
 * Bourse « À la une » : meilleur score parmi les bourses OUVERTES.
 * Ne renvoie jamais une bourse fermée ou expirée. `null` si rien d'ouvert.
 */
export function selectionnerALaUne(bourses: Bourse[]): Bourse | null {
  const ouvertes = bourses.filter((b) => b.statut === "ouvert");
  if (ouvertes.length === 0) return null;
  return ouvertes.reduce((meilleure, b) =>
    calculerScore(b) > calculerScore(meilleure) ? b : meilleure
  );
}

/** Nombre d'éléments communs à deux listes (insensible à la casse). */
function communs(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => setB.has(x.toLowerCase())).length;
}

/**
 * Bourses similaires à `courante`, pour la boucle de découverte interne.
 *
 * On score chaque autre bourse par recouvrement (domaines > niveaux > pays),
 * avec bonus pour la même organisation / le même type de financement.
 *
 * Défensif : les tableaux peuvent être absents (le nouveau schéma omet les
 * clés vides) — `communs()` gère le cas `undefined` sans planter.
 *
 * Filet anti-bloc-vide : si moins de `limite` vraies similaires, on complète
 * avec les bourses ouvertes les plus pertinentes, pour ne jamais afficher un
 * bloc vide (meilleure rétention).
 */
export function boursesSimilaires(
  courante: Bourse,
  toutes: Bourse[],
  limite = 3,
): Bourse[] {
  const candidates = toutes.filter(
    (b) => b.source_url !== courante.source_url && b.slug !== courante.slug,
  );

  const scorees = candidates
    .map((b) => {
      let score = 0;
      score += 3 * communs(b.domaines, courante.domaines);
      score += 2 * communs(b.niveau_etudes, courante.niveau_etudes);
      score += 1 * communs(b.pays_eligibles, courante.pays_eligibles);
      if (b.organisation && b.organisation === courante.organisation) score += 2;
      if (b.type_financement && b.type_financement === courante.type_financement) {
        score += 1;
      }
      if (b.statut === "ouvert") score += 1;
      return { b, score };
    })
    .filter((e) => e.score > 0)
    .sort((x, y) => y.score - x.score || calculerScore(y.b) - calculerScore(x.b));

  const resultat = scorees.slice(0, limite).map((e) => e.b);

  if (resultat.length < limite) {
    const dejaPris = new Set(resultat.map((b) => b.source_url));
    const complement = trierParPertinence(
      candidates.filter((b) => !dejaPris.has(b.source_url) && b.statut === "ouvert"),
    ).slice(0, limite - resultat.length);
    resultat.push(...complement);
  }

  return resultat;
}
