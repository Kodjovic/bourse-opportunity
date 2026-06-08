/**
 * Helpers d'affichage du montant — partagés Server/Client.
 * Les données scrapées sont irrégulières (montant souvent `null`, devise
 * absente), donc on retombe toujours sur un libellé lisible.
 */

import { capitalize } from "@/lib/utils";
import type { Bourse } from "@/types/bourse";

/** Montant détaillé pour la bourse à la une : « €25 000 », « Financement complet »… */
export function montantAffichage(b: Bourse): string {
  if (b.montant != null) {
    const devise = b.devise ? `${b.devise} ` : "";
    return `${devise}${b.montant.toLocaleString("fr-FR")}`.trim();
  }
  const type = (b.type_financement ?? "").toLowerCase();
  if (type.includes("complèt")) return "Financement complet";
  if (b.type_financement) return capitalize(b.type_financement);
  return "Montant variable";
}

/** Version courte pour les lignes de liste : « $25 000 », « Complète », « Variable ». */
export function montantCourt(b: Bourse): string {
  if (b.montant != null) {
    const devise = b.devise ?? "";
    return `${devise}${b.montant.toLocaleString("fr-FR")}`;
  }
  const type = (b.type_financement ?? "").toLowerCase();
  if (type.includes("complèt")) return "Complète";
  if (type.includes("partiel")) return "Partielle";
  if (b.type_financement) return capitalize(b.type_financement);
  return "Variable";
}
