import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { FeaturedGuideCard } from "@/components/guides/FeaturedGuideCard";
import { GuideCard } from "@/components/guides/GuideCard";

export const metadata: Metadata = {
  title: "Guides pratiques | Afrik'Ose",
  description: "Tout ce qu&apos;il faut savoir pour préparer et réussir ta candidature à une bourse d&apos;études.",
  alternates: { canonical: "/guides" },
};

export default function PageGuides() {
  const featuredGuide = guides.find((g) => g.isFeatured);
  const otherGuides = guides.filter((g) => !g.isFeatured);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero de la page */}
      <section className="mb-12">
        <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl">
          Guides pratiques
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Tout ce qu&apos;il faut savoir pour préparer et réussir ta candidature à une bourse.
        </p>
      </section>

      {/* Guide à la une */}
      {featuredGuide && (
        <section className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
            À la une
          </p>
          <FeaturedGuideCard guide={featuredGuide} />
        </section>
      )}

      {/* Grille des autres guides */}
      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
          Tous les guides
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {otherGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>
    </main>
  );
}
