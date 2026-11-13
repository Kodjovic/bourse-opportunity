import type { Metadata } from "next";

import { DocumentDetailPage } from "@/components/epreuves/DocumentDetailPage";
import { construireMetadonneesEpreuve, getDocumentBySlug } from "@/lib/epreuves";

interface PageProps {
  params: Promise<{
    pays: string;
    examen: string;
    serie: string;
    annee: string;
    matiere: string;
  }>;
}

/** Métadonnées SEO de la fiche — aucun impact sur le rendu de la page. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}/${resolvedParams.matiere}`;
  const doc = await getDocumentBySlug(slugPath);

  if (!doc) {
    // La page appelle notFound() : titre neutre et pas d'indexation.
    return { title: "Épreuve introuvable", robots: { index: false, follow: false } };
  }

  return construireMetadonneesEpreuve(doc);
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}/${resolvedParams.matiere}`;
  
  return <DocumentDetailPage slugPath={slugPath} />;
}
