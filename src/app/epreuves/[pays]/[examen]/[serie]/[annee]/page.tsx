import type { Metadata } from "next";

import { DocumentDetailPage } from "@/components/epreuves/DocumentDetailPage";
import { construireMetadonneesEpreuve, getDocumentBySlug } from "@/lib/epreuves";

interface PageProps {
  params: Promise<{
    pays: string;
    examen: string;
    serie: string; // Pour un examen sans série, ce paramètre contiendra en réalité l'année
    annee: string; // Pour un examen sans série, ce paramètre contiendra en réalité la matière
  }>;
}

/** Métadonnées SEO de la fiche — aucun impact sur le rendu de la page. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}`;
  const doc = await getDocumentBySlug(slugPath);

  if (!doc) {
    // La page appelle notFound() : titre neutre et pas d'indexation.
    return { title: "Épreuve introuvable", robots: { index: false, follow: false } };
  }

  return construireMetadonneesEpreuve(doc);
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}`;
  
  return <DocumentDetailPage slugPath={slugPath} />;
}
