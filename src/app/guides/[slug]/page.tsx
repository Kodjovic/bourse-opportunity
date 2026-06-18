import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { guides } from "@/lib/guides";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: "Guide non trouvé",
    };
  }

  return {
    title: `${guide.title} | Afrik'Ose`,
    description: guide.subtitle,
    openGraph: {
      title: `${guide.title} | Afrik'Ose`,
      description: guide.subtitle,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Nettoyage du contenu pour enlever les répétitions (Titre, Métadonnées, Séparateur) au début
  const lines = guide.content.split('\n');
  let startIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i].trim();
    // On saute les lignes de titre, de métadonnées (avec des puces ·), les séparateurs et les lignes vides
    if (line.startsWith('# ') || (line.includes('·') && (line.includes('lecture') || line.includes('mise à jour'))) || line === '---' || line === '') {
      startIndex = i + 1;
    } else {
      // Dès qu'on tombe sur du vrai contenu (l'accroche), on s'arrête
      break;
    }
  }
  const cleanedContent = lines.slice(startIndex).join('\n').trim().replace(/—/g, ':');

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/guides"
        className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← Retour aux guides
      </Link>

      <article>
        <header className="mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-orange-700">{guide.category}</span>
            <span>•</span>
            <span>{guide.readingTime} min de lecture</span>
            <span>•</span>
            <span>Dernière mise à jour : {new Date(guide.publishedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl font-medium leading-tight text-gray-900 sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-gray-500">{guide.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="max-w-none border-t border-gray-100 pt-10">
          <div className="markdown-content text-gray-700 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: () => null,
                h2: ({ node, ...props }) => <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mb-3 mt-6 text-xl font-bold text-gray-900" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-700" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-700" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                a: ({ node, ...props }) => <a className="font-medium text-orange-700 hover:underline" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                hr: () => <hr className="my-10 border-gray-100" />,
              }}
            >
              {cleanedContent}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </main>
  );
}
