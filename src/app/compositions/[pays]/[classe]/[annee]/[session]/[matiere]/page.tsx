import { DocumentDetailPage } from "@/components/epreuves/DocumentDetailPage";

interface PageProps {
  params: Promise<{
    pays: string;
    classe: string;
    annee: string;
    session: string;
    matiere: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slugPath = `/compositions/${resolvedParams.pays}/${resolvedParams.classe}/${resolvedParams.annee}/${resolvedParams.session}/${resolvedParams.matiere}`;
  
  return <DocumentDetailPage slugPath={slugPath} />;
}
