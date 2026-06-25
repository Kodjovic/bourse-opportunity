import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { actualites } from "@/lib/actualites";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const actu = actualites.find((a) => a.slug === slug);

  if (!actu) {
    return {
      title: "Actualité non trouvée",
    };
  }

  return {
    title: `${actu.title} | Afrik'Ose`,
    description: actu.subtitle,
    openGraph: {
      title: `${actu.title} | Afrik'Ose`,
      description: actu.subtitle,
      images: actu.imageUrl ? [{ url: actu.imageUrl }] : [],
    },
  };
}

export default async function ActualitePage({ params }: Props) {
  const { slug } = await params;
  const actu = actualites.find((a) => a.slug === slug);

  if (!actu) {
    notFound();
  }

  // Nettoyage du contenu pour enlever le titre ou les métadonnées répétés au début du Markdown
  const lines = actu.content.split('\n');
  let startIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('# ') || 
      (line.includes('·') && (line.includes('lecture') || line.includes('Actualités') || line.includes('mis à jour'))) || 
      line === '---' || 
      line === ''
    ) {
      startIndex = i + 1;
    } else {
      break;
    }
  }
  const cleanedContent = lines.slice(startIndex).join('\n').trim().replace(/—/g, ':');

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/actualites"
        className="mb-8 inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        ← Retour aux actualités
      </Link>

      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wider text-stone-500">
            <span className="font-bold text-amber-700 uppercase">{actu.category}</span>
            <span>•</span>
            <span>{actu.readingTime} MIN DE LECTURE</span>
            <span>•</span>
            <span>PUBLIÉ LE {new Date(actu.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</span>
          </div>
          
          <h1 className="text-2xl font-serif font-bold leading-tight text-stone-900 sm:text-3xl">
            {actu.title}
          </h1>
          <p className="mt-4 text-base text-stone-500 leading-relaxed font-sans">{actu.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {actu.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Image d'illustration si disponible */}
        {actu.imageUrl && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-stone-100">
            <img
              src={actu.imageUrl}
              alt={actu.title}
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>
        )}

        <div className="max-w-none border-t border-stone-200 pt-8">
          <div className="markdown-content text-stone-700 leading-relaxed font-sans text-sm sm:text-base">
            <ReactMarkdown
              components={{
                h1: () => null,
                h2: ({ node, ...props }) => <h2 className="mb-4 mt-8 text-xl font-semibold text-stone-900 border-b border-stone-200 pb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mb-3 mt-6 text-lg font-semibold text-stone-900" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-stone-700 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-stone-700" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-stone-700" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                a: ({ node, ...props }) => <a className="font-medium text-amber-700 hover:underline" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-stone-950" {...props} />,
                hr: () => <hr className="my-8 border-stone-200" />,
              }}
            >
              {cleanedContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* Fiche bourse liée si applicable */}
        {actu.relatedBourseSlug && (
          <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <h3 className="text-base font-medium text-amber-900">Opportunité associée</h3>
            <p className="mt-1 text-sm text-amber-700">
              Cette actualité est liée à un programme de bourse disponible sur notre plateforme. Retrouvez tous les détails d&apos;éligibilité et de candidature.
            </p>
            <div className="mt-4">
              <Link
                href={`/bourses/${actu.relatedBourseSlug}`}
                className="inline-flex items-center justify-center rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-950 transition"
              >
                Consulter la fiche complète de la bourse →
              </Link>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
