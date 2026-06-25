import type { Metadata } from "next";
import { getActualites } from "@/lib/actualites";
import { ActualiteCard } from "@/components/actualites/ActualiteCard";

export const metadata: Metadata = {
  title: "Actualités | Afrik'Ose",
  description: "Suivez les dernières actualités sur les bourses d'études, les réformes scolaires, les examens et les opportunités académiques en Afrique.",
  alternates: { canonical: "/actualites" },
};

// Force Next.js à re-rendre la page à chaque requête (pas de cache statique figé)
export const revalidate = 0;

export default function PageActualites() {
  const actualites = getActualites();
  const hasActualites = actualites && actualites.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero de la page */}
      <section className="mb-12 border-b border-stone-200 pb-8">
        <h1 className="text-2xl font-serif font-semibold text-stone-900 sm:text-3xl">
          Actualités d&apos;Études & Bourses
        </h1>
        <p className="mt-2 text-sm text-stone-500 sm:text-base max-w-2xl">
          Restez informé en temps réel des dernières annonces de bourses, changements de règles pour les visas, lancements de concours officiels et réformes en Afrique.
        </p>
      </section>

      {/* Grille des actualités */}
      {hasActualites ? (
        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {actualites.map((actu) => (
              <ActualiteCard key={actu.slug} actualite={actu} />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">📢</span>
          <h2 className="mt-4 text-lg font-medium text-stone-900">Aucune actualité pour l&apos;instant</h2>
          <p className="mt-1 text-sm text-stone-500 max-w-xs">
            Les dernières nouvelles et opportunités seront affichées ici dès qu&apos;elles seront publiées.
          </p>
        </div>
      )}
    </main>
  );
}
