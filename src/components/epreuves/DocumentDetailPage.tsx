import { notFound } from "next/navigation";
import Link from "next/link";

import { Breadcrumb } from "@/components/epreuves/Breadcrumb";
import { ConversionBox } from "@/components/epreuves/ConversionBox";
import { getAllDocuments } from "@/lib/epreuves";

interface DocumentDetailPageProps {
  slugPath: string;
}

export async function DocumentDetailPage({ slugPath }: DocumentDetailPageProps) {
  const allDocs = await getAllDocuments();
  const doc = allDocs.find((d) => d.slug === slugPath);

  if (!doc) {
    notFound();
  }

  const formatMatiere = (matiere: string) => {
    return matiere
      .split("-")
      .map((word) => {
        if (word === "svt") return "SVT";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case "examen": return doc.examen || "Examen national";
      case "devoir": return "Devoir surveillé";
      case "composition": return "Composition";
      default: return type;
    }
  };

  const breadcrumbSteps = [
    { label: "Épreuves scolaires", href: "/epreuves" },
    { label: doc.type === "examen" ? `${doc.examen} ${doc.annee}` : `${doc.classe} - ${doc.annee}` },
    { label: formatMatiere(doc.matiere) },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumb steps={breadcrumbSteps} />

      <article className="mt-6">
        {/* En-tête de l'épreuve */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30 text-xs px-2.5 py-1 rounded-full font-semibold">
              {getDocTypeLabel(doc.type)} {doc.type === "examen" && doc.serie ? `Série ${doc.serie.toUpperCase()}` : ""}
            </span>
            <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full font-semibold">
              {formatMatiere(doc.matiere)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
              Session {doc.session} {doc.annee}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 sm:text-4xl leading-tight">
            {doc.type === "examen"
              ? `Épreuve de ${formatMatiere(doc.matiere)} - ${doc.examen} ${doc.annee}`
              : `${getDocTypeLabel(doc.type)} de ${formatMatiere(doc.matiere)} - ${doc.classe} (${doc.annee})`
            }
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span>Pays : <strong className="text-zinc-600 dark:text-zinc-300 capitalize">{doc.pays}</strong></span>
            {doc.duree_minutes && (
              <>
                <span>•</span>
                <span>Durée : <strong className="text-zinc-600 dark:text-zinc-300">{Math.floor(doc.duree_minutes / 60)}h{doc.duree_minutes % 60 > 0 ? doc.duree_minutes % 60 : ""}</strong></span>
              </>
            )}
            {doc.coefficient && (
              <>
                <span>•</span>
                <span>Coefficient : <strong className="text-zinc-600 dark:text-zinc-300">{doc.coefficient}</strong></span>
              </>
            )}
            <span>•</span>
            <span>Publié le : <strong>{new Date(doc.created_at).toLocaleDateString("fr-FR")}</strong></span>
          </div>
        </header>

        {/* Section Téléchargements */}
        <section className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-stone-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            📂 Documents PDF à télécharger
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bouton Sujet */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  Document de travail
                </span>
                <h3 className="font-bold text-sm text-stone-800 dark:text-zinc-200 mt-0.5">
                  Sujet de l&apos;épreuve
                </h3>
              </div>
              <div className="mt-4">
                {doc.fichiers.sujet ? (
                  <Link
                    href={doc.fichiers.sujet}
                    target="_blank"
                    className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    📥 Télécharger le Sujet
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-xs font-medium px-4 py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Sujet indisponible (En cours d&apos;ajout)
                  </button>
                )}
              </div>
            </div>

            {/* Bouton Corrigé */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wide">
                  Proposition de correction
                </span>
                <h3 className="font-bold text-sm text-stone-800 dark:text-zinc-200 mt-0.5">
                  Corrigé de l&apos;épreuve
                </h3>
              </div>
              <div className="mt-4">
                {doc.fichiers.corrige ? (
                  <Link
                    href={doc.fichiers.corrige}
                    target="_blank"
                    className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    📥 Télécharger le Corrigé
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-xs font-medium px-4 py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Corrigé non disponible
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Visualisation directe de l'épreuve sur Desktop */}
        {doc.fichiers.sujet && (
          <section className="mt-10 hidden md:block">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800/50">
              Visualisation du Sujet
            </h2>
            
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm overflow-hidden flex justify-center items-center">
              {doc.fichiers.sujet.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={`${doc.fichiers.sujet}#toolbar=0`}
                  width="100%"
                  height="800px"
                  className="rounded-xl border border-zinc-150 dark:border-zinc-800"
                  title="Visualisation du sujet PDF"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={doc.fichiers.sujet}
                  alt="Sujet de l'épreuve"
                  className="max-w-full h-auto rounded-xl border border-zinc-150 dark:border-zinc-800 shadow-sm"
                />
              )}
            </div>
          </section>
        )}

        <ConversionBox />
      </article>
    </main>
  );
}
