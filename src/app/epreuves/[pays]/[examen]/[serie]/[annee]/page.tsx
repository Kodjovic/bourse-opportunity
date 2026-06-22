import { DocumentDetailPage } from "@/components/epreuves/DocumentDetailPage";

interface PageProps {
  params: Promise<{
    pays: string;
    examen: string;
    serie: string; // Pour un examen sans série, ce paramètre contiendra en réalité l'année
    annee: string; // Pour un examen sans série, ce paramètre contiendra en réalité la matière
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}`;
  
  return <DocumentDetailPage slugPath={slugPath} />;
}
