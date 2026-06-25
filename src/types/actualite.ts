export type Actualite = {
  slug: string;                  // ex: "togo-nouvelle-plateforme-bourses"
  title: string;                 // Titre de l'actualité
  subtitle: string;              // Meta description / Résumé court
  category: string;              // ex: "Annonce de bourse", "Changement de règles"
  imageUrl: string | null;       // URL de l'image d'illustration si fournie, sinon null
  icon: string | null;           // Emoji pertinent généré par l'IA
  readingTime: number;           // en minutes
  tags: string[];                // tags associés
  relatedBourseSlug: string | null; // slug de la bourse liée si applicable
  socialShareTitles: string[];   // titres courts pour partage social
  publishedAt: string;           // date ISO (AAAA-MM-JJ)
  content: string;               // contenu complet en markdown
};
