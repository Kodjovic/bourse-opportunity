import Link from "next/link";

import { BadgeStatut } from "@/components/BadgeStatut";
import { montantCourt } from "@/lib/affichage";
import { capitalize, formaterDate } from "@/lib/utils";
import type { Bourse } from "@/types/bourse";

import { IconCalendar, IconOrganisation } from "./icones";

/**
 * Ligne éditoriale dans « Toutes les bourses » : titre + organisation/deadline
 * à gauche, montant / niveau / statut à droite. Les bourses non ouvertes sont
 * atténuées. Toute la ligne mène vers /bourses/[slug].
 */
export function LigneBourse({ bourse }: { bourse: Bourse }) {
  const ferme = bourse.statut !== "ouvert";
  const niveau = bourse.niveau_etudes[0] ?? bourse.type_financement;

  return (
    <Link
      href={`/bourses/${bourse.slug}`}
      className={`group flex items-center justify-between gap-4 border-b border-stone-200 py-5 transition ${
        ferme ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-0">
        <h3 className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-brand-700">
          {bourse.titre ?? "(sans titre)"}
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-stone-500">
          <IconOrganisation className="size-4 shrink-0 text-stone-400" />
          <span className="truncate">{bourse.organisation ?? "—"}</span>
          <span aria-hidden>·</span>
          <IconCalendar className="size-4 shrink-0 text-stone-400" />
          <span>
            {bourse.deadline
              ? formaterDate(bourse.deadline)
              : bourse.deadline_texte ?? "—"}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="hidden text-sm font-medium text-stone-900 sm:inline">
          {montantCourt(bourse)}
        </span>
        {niveau && (
          <span className="hidden rounded-full border border-stone-200 px-2.5 py-0.5 text-xs text-stone-600 md:inline">
            {capitalize(niveau)}
          </span>
        )}
        <BadgeStatut statut={bourse.statut} size="sm" />
      </div>
    </Link>
  );
}
