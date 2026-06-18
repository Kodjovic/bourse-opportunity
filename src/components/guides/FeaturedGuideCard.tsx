import Link from "next/link";
import { Guide } from "@/types/guide";

export function FeaturedGuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-gray-300 sm:p-6"
    >
      {/* Badge "Guide complet" */}
      <div className="absolute right-4 top-4 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Guide complet
      </div>

      {/* Catégorie + temps de lecture */}
      <div className="text-xs font-medium text-gray-500">
        {guide.category} · {guide.readingTime} min de lecture
      </div>

      {/* Titre */}
      <h2 className="text-xl font-medium leading-tight text-gray-900 transition-colors group-hover:text-orange-700 sm:text-2xl">
        {guide.title}
      </h2>

      {/* Sous-titre */}
      <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
        {guide.subtitle}
      </p>

      {/* Bas : Tags et Lien */}
      <div className="mt-auto flex items-end justify-between pt-4">
        <div className="flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm font-medium text-gray-500 group-hover:text-gray-900">
          Lire le guide →
        </div>
      </div>
    </Link>
  );
}
