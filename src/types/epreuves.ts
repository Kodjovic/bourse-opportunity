export type DocType = "examen" | "devoir" | "composition" | "exercice";

export interface Fichiers {
  sujet: string | null;
  corrige: string | null;
}

export interface EpreuveDocument {
  id: string;
  type: DocType;
  pays: string;
  matiere: string;
  annee: number;
  session: string;
  slug: string;
  fichiers: Fichiers;
  created_at: string;
  // Champs examen uniquement
  examen?: string;
  serie?: string | null;
  // Champs devoir/composition uniquement
  classe?: string;
  duree_minutes?: number | null;
  coefficient?: number | null;
  // Champs exercice
  chapitre?: string;
}
