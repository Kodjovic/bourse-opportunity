import Link from "next/link";
import { Actualite } from "@/types/actualite";

export function ActualiteCard({ actualite }: { actualite: Actualite }) {
  return (
    <Link
      href={`/actualites/${actualite.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-stone-400 shadow-xs"
    >
      {/* Image de couverture ou Émoticône de secours */}
      {actualite.imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
          <img
            src={actualite.imageUrl}
            alt={actualite.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-stone-100 text-4xl">
          {actualite.icon || "📢"}
        </div>
      )}

      {/* Contenu textuel */}
      <div className="flex flex-1 flex-col p-4">
        {/* Catégorie et Temps de lecture */}
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold tracking-wider text-stone-500">
          <span className="uppercase text-amber-700">
            {actualite.category}
          </span>
          <span>{actualite.readingTime} MIN</span>
        </div>

        {/* Titre */}
        <h3 className="mb-2 text-sm font-normal leading-snug text-stone-900 transition-colors group-hover:text-amber-800 line-clamp-2">
          {actualite.title}
        </h3>

        {/* Sous-titre / Description */}
        <p className="mb-4 text-[11px] leading-snug text-stone-500 line-clamp-2">
          {actualite.subtitle}
        </p>

        {/* Pied de carte (Date & Bouton lire) */}
        <div className="mt-auto flex items-center justify-between text-[10px] font-medium">
          <span className="text-stone-400">
            {new Date(actualite.publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-stone-400 group-hover:text-stone-700 transition">
            Lire →
          </span>
        </div>
      </div>
    </Link>
  );
}
