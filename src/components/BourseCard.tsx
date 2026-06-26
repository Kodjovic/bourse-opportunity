import Link from "next/link";

import { BadgeStatut } from "@/components/BadgeStatut";
import { capitalize, computerCountdown, formaterDate } from "@/lib/utils";
import type { Bourse } from "@/types/bourse";

/**
 * Carte compacte d'une bourse, utilisée dans les listes (catégories,
 * page d'accueil, recherche). Cliquable, mène à /bourses/[slug].
 */
export function BourseCard({ bourse }: { bourse: Bourse }) {
  const cd = computerCountdown(bourse.deadline);

  return (
    <Link
      href={`/bourses/${bourse.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-md"
    >
      {/* Image de couverture si disponible */}
      {bourse.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
          <img
            src={bourse.imageUrl}
            alt={bourse.titre || "Bourse"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Contenu de la carte */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Ligne haute : statut + countdown */}
        <div className="flex items-start justify-between gap-3">
          <BadgeStatut statut={bourse.statut} size="sm" />
          <span
            className={`shrink-0 text-xs font-semibold uppercase tracking-wider ${
              cd.passe ? "text-red-700" : "text-orange-700"
            }`}
          >
            {cd.affichage} {cd.label}
          </span>
        </div>

        {/* Titre + organisation */}
        <div>
          <h3 className="font-serif text-xl font-semibold leading-tight text-stone-900 transition-colors group-hover:text-orange-700 line-clamp-2">
            {bourse.titre}
          </h3>
          {bourse.organisation && (
            <p className="mt-1 text-sm text-stone-600 line-clamp-1">{bourse.organisation}</p>
          )}
        </div>

        {/* Pills : type + niveaux */}
        <div className="flex flex-wrap gap-1.5">
          {bourse.type_financement && (
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-900">
              {capitalize(bourse.type_financement)}
            </span>
          )}
          {bourse.niveau_etudes.slice(0, 3).map((n) => (
            <span
              key={n}
              className="rounded-full border border-stone-200 px-2.5 py-0.5 text-xs text-stone-700"
            >
              {capitalize(n)}
            </span>
          ))}
        </div>

        {/* Bas : date + lien */}
        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
          <span className="text-stone-500">
            {bourse.deadline
              ? formaterDate(bourse.deadline)
              : bourse.deadline_texte || "—"}
          </span>
          <span className="font-medium text-orange-700 group-hover:underline">
            Voir →
          </span>
        </div>
      </div>
    </Link>
  );
}
