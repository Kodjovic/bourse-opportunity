/**
 * Type d'une bourse, en miroir de la structure JSON produite par le pipeline
 * Python (extracteur IA + consolider.py).
 *
 * Tous les champs sont nullables sauf `slug`, `source_url`, et les tableaux
 * (qui sont au minimum `[]`).
 */

export type Statut = "ouvert" | "fermé" | "à venir" | string;

export interface Bourse {
  slug: string;
  source_url: string;

  titre: string | null;
  organisation: string | null;

  montant: number | null;
  devise: string | null;
  type_financement: string | null;

  deadline: string | null;          // ISO 8601 : YYYY-MM-DD
  deadline_texte: string | null;

  niveau_etudes: string[];
  domaines: string[];
  pays_eligibles: string[];
  documents_requis: string[];

  // Nouveaux champs granulaires
  avantages: string[];
  eligibilite: string[];
  procedure_etapes: string[];
  contacts: string[];
  liens_utiles: { label: string; url: string }[];
  mots_cles: string[];

  age_maximum: number | null;
  langue_requise: string | null;
  lien_candidature: string | null;

  statut: Statut | null;
  resume: string | null;
  adresse?: string | null;
  imageUrl?: string | null;

  extrait_le: string;               // ISO 8601 datetime
}
