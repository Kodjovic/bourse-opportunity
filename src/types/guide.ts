export type Guide = {
  slug: string;           // ex: "bourse-daad-etudiants-africains"
  title: string;          // titre complet
  subtitle: string;       // description courte (1-2 phrases)
  category: string;       // ex: "Candidature", "Rédaction", "Destination"
  readingTime: number;    // en minutes
  tags: string[];         // ex: ["Allemagne", "Master", "PhD"]
  icon: string;           // nom d'une icône Heroicons ou emoji
  isFeatured: boolean;    // true = affiché en grande carte "À la une"
  publishedAt: string;    // date ISO
  content: string;        // contenu markdown
};
