import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { EpreuveDocument, DocType } from "@/types/epreuves";
import { SITE_NAME } from "@/lib/site";
import { capitalize } from "@/lib/utils";

const DATA_DIR = path.join(process.cwd(), "data/epreuves");

export async function getAllDocuments(): Promise<EpreuveDocument[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    
    const documents = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as EpreuveDocument;
      })
    );
    
    return documents.sort((a, b) => b.annee - a.annee);
  } catch (error) {
    console.error("Erreur lors de la lecture des documents :", error);
    return [];
  }
}

export async function getByType(type: DocType): Promise<EpreuveDocument[]> {
  const all = await getAllDocuments();
  return all.filter((doc) => doc.type === type);
}

/** Document correspondant à un slug complet (« /epreuves/togo/bepc/2026/svt »). */
export async function getDocumentBySlug(
  slug: string
): Promise<EpreuveDocument | undefined> {
  const all = await getAllDocuments();
  return all.find((doc) => doc.slug === slug);
}

export async function getByMatiere(matiere: string): Promise<EpreuveDocument[]> {
  const all = await getAllDocuments();
  return all.filter((doc) => doc.matiere.toLowerCase() === matiere.toLowerCase());
}

export async function getDocumentsByFilter(filters: {
  type?: DocType;
  examen?: string;
  classe?: string;
  matiere?: string;
}): Promise<EpreuveDocument[]> {
  let docs = await getAllDocuments();
  
  if (filters.type) docs = docs.filter(d => d.type === filters.type);
  if (filters.examen) docs = docs.filter(d => d.examen === filters.examen);
  if (filters.classe) docs = docs.filter(d => d.classe === filters.classe);
  if (filters.matiere) docs = docs.filter(d => d.matiere === filters.matiere);
  
  return docs;
}

// ------------------------------------------------------------------
// SEO des fiches : métadonnées partagées par les routes de détail
// ------------------------------------------------------------------

/** Longueur visée pour les <title> (au-delà, Google tronque l'affichage). */
const TITRE_MAX = 60;
/** Longueur maximale d'une meta description. */
const DESCRIPTION_MAX = 160;

/**
 * Table de correspondance unique des matières → libellés accentués utilisés
 * dans les métadonnées. Les clés sont normalisées (minuscules, sans accents,
 * séparateurs en tirets) pour absorber les variantes de saisie.
 */
const LIBELLES_MATIERES: Record<string, string> = {
  mathematiques: "Mathématiques",
  "physique-chimie": "Physique-Chimie",
  svt: "SVT",
  "sciences-de-la-vie-et-de-la-terre": "SVT",
  francais: "Français",
  anglais: "Anglais",
  philosophie: "Philosophie",
  histoire: "Histoire",
  geographie: "Géographie",
  "histoire-geographie": "Histoire-Géographie",
  "sciences-economiques": "Sciences économiques",
  economie: "Économie",
  informatique: "Informatique",
  eps: "EPS",
  "education-physique-et-sportive": "EPS",
};

/** Clé de recherche d'une matière : minuscules, sans accents, tirets uniques. */
function cleMatiere(matiere: string): string {
  return matiere
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** « mathematiques » → « Mathématiques », « svt » → « SVT » ; repli capitalisé. */
export function libelleMatiere(matiere: string): string {
  const libelle = LIBELLES_MATIERES[cleMatiere(matiere)];
  if (libelle) return libelle;
  return matiere
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((mot) => capitalize(mot))
    .join(" ");
}

/** « BAC2 » → « BAC 2 », « BAC 1 » et « BEPC » inchangés. */
function libelleExamen(examen: string): string {
  return examen
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]+)\s*(\d)$/, "$1 $2");
}

/** Libellé court du type de document, pour les fiches de classe. */
function libelleType(doc: EpreuveDocument): string {
  switch (doc.type) {
    case "composition":
      return "Composition";
    case "devoir":
      return "Devoir";
    case "exercice":
      return "Exercice";
    default:
      return "Épreuve";
  }
}

/** Premier candidat qui tient sous `max` caractères (du plus riche au plus court). */
function premierQuiTient(candidats: string[], max: number): string {
  return candidats.find((c) => c.length <= max) ?? candidats[candidats.length - 1];
}

/** Candidat le plus informatif qui tient sous `max` caractères. */
function plusRicheSous(candidats: string[], max: number): string {
  const valides = candidats.filter((c) => c.length <= max);
  if (valides.length === 0) return candidats[candidats.length - 1];
  return valides.reduce((meilleur, courant) =>
    courant.length > meilleur.length ? courant : meilleur
  );
}

/**
 * Titre SEO de la fiche :
 *   examen        → « Épreuve de {Matière} {Examen} {Série} {Année} Togo – Sujet PDF »
 *   devoir/compo. → « Composition de {Matière} – {Classe} {Année} Togo – Sujet PDF »
 * Les variantes moins riches servent de repli quand la version complète dépasse
 * `TITRE_MAX`. Le mot « corrigé » n'est jamais ajouté ici : il n'est autorisé
 * que si un corrigé existe, et c'est la description qui le mentionne.
 */
function construireTitre(doc: EpreuveDocument): string {
  const matiere = libelleMatiere(doc.matiere);
  const pays = capitalize(doc.pays) || "Togo";
  const annee = doc.annee;

  if (doc.type === "examen") {
    const examen = doc.examen ? ` ${libelleExamen(doc.examen)}` : "";
    const serie = doc.serie ? ` Série ${doc.serie.trim().toUpperCase()}` : "";
    const tete = `Épreuve de ${matiere}${examen}${serie} ${annee}`;
    return premierQuiTient(
      [
        `${tete} ${pays} – Sujet PDF`,
        `${tete} – Sujet PDF`,
        `${tete} ${pays}`,
        tete,
        `Épreuve de ${matiere} ${annee}`,
        `Épreuve de ${matiere}`,
      ],
      TITRE_MAX
    );
  }

  const type = libelleType(doc);
  const classe = doc.classe?.trim() || doc.session;
  return premierQuiTient(
    [
      `${type} de ${matiere} – ${classe} ${annee} ${pays} – Sujet PDF`,
      `${type} de ${matiere} – ${classe} ${annee} – Sujet PDF`,
      `${type} de ${matiere} – ${classe} ${annee} ${pays}`,
      `${type} de ${matiere} – ${classe} ${annee}`,
      `${type} de ${matiere} ${annee}`,
      `${type} de ${matiere}`,
    ],
    TITRE_MAX
  );
}

/**
 * Meta description (1 à 2 phrases, `DESCRIPTION_MAX` caractères max) :
 * examen, matière, série, session, année, pays et PDF gratuit. La mention
 * « corrigé inclus » n'est ajoutée que si `doc.fichiers.corrige` existe.
 */
function construireDescription(doc: EpreuveDocument): string {
  const matiere = libelleMatiere(doc.matiere);
  const pays = capitalize(doc.pays) || "Togo";
  const annee = doc.annee;
  const session = doc.session;
  const corrige = doc.fichiers?.corrige ? ", corrigé inclus" : "";
  const classe = doc.classe?.trim() || session;
  const sessionRedondante = classe.toLowerCase() === session.trim().toLowerCase();

  const bases: string[] = [];
  if (doc.type === "examen") {
    const serie = doc.serie ? ` série ${doc.serie.trim().toUpperCase()}` : "";
    const examen = doc.examen ? `du ${libelleExamen(doc.examen)}` : "de l'examen national";
    const nomExamen = doc.examen ? libelleExamen(doc.examen) : "examen national";
    bases.push(
      `Épreuve de ${matiere}${serie} ${examen} ${annee} au ${pays}, session ${session}`,
      `Épreuve de ${matiere}${serie} ${examen} ${annee} au ${pays}`,
      `Épreuve de ${matiere}${serie}, ${nomExamen} ${annee}, ${pays}`
    );
  } else {
    const type = libelleType(doc);
    bases.push(
      sessionRedondante
        ? `${type} de ${matiere} – ${classe} ${annee} au ${pays}`
        : `${type} de ${matiere} – ${classe}, session ${session} ${annee} au ${pays}`,
      `${type} de ${matiere} – ${classe} ${annee} au ${pays}`
    );
  }

  // Phrase finale, du plus détaillé au plus court.
  const queues = [
    `. Sujet officiel en PDF à télécharger gratuitement, pour réviser le programme et les annales officielles${corrige}.`,
    `. Sujet officiel en PDF à télécharger gratuitement, pour réviser tout le programme et les annales${corrige}.`,
    `. Sujet officiel en PDF à télécharger gratuitement, pour réviser le programme et les annales${corrige}.`,
    `. Sujet officiel en PDF à télécharger gratuitement pour réviser le programme officiel${corrige}.`,
    `. Sujet officiel en PDF à télécharger gratuitement pour réviser le programme${corrige}.`,
    `. Sujet en PDF à télécharger gratuitement pour réviser le programme${corrige}.`,
    `. Sujet en PDF à télécharger gratuitement${corrige}.`,
    `. Sujet PDF gratuit${corrige}.`,
  ];

  const candidats: string[] = [];
  for (const base of bases) {
    for (const queue of queues) {
      candidats.push(`${base}${queue}`);
    }
  }
  return plusRicheSous(candidats, DESCRIPTION_MAX);
}

/**
 * Métadonnées SEO d'une fiche d'épreuve, partagées par les routes
 * `/epreuves/…`, `/devoirs/…` et `/compositions/…`.
 * `metadataBase` (URL absolue du site) est déjà défini dans le layout racine :
 * `canonical` et `openGraph.url` peuvent donc rester relatifs.
 */
export function construireMetadonneesEpreuve(doc: EpreuveDocument): Metadata {
  const titre = construireTitre(doc);
  const description = construireDescription(doc);

  return {
    // `absolute` : le titre est déjà calibré pour tenir en ~60 caractères, on
    // évite le suffixe « · Afrik'Ose » du template défini dans le layout racine.
    title: { absolute: titre },
    description,
    alternates: { canonical: doc.slug },
    openGraph: {
      title: titre,
      description,
      url: doc.slug,
      type: "article",
      siteName: SITE_NAME,
      locale: "fr_FR",
    },
  };
}
