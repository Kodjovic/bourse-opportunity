import { DocumentDetailPage } from "@/components/epreuves/DocumentDetailPage";

interface PageProps {
  params: Promise<{
    pays: string;
    examen: string;
    serie: string;
    annee: string;
    matiere: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = `/epreuves/${resolvedParams.pays}/${resolvedParams.examen}/${resolvedParams.serie}/${resolvedParams.annee}/${resolvedParams.matiere}`;
  
  return <DocumentDetailPage slugPath={slugPath} />;
}
