import Link from "next/link";
import type { ReactNode } from "react";

import { montantAffichage } from "@/lib/affichage";
import { joursRestants } from "@/lib/scoring";
import { capitalize, formaterDate } from "@/lib/utils";
import type { Bourse } from "@/types/bourse";

import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconMontant,
  IconStar,
  IconUsers,
} from "./icones";

/**
 * Bloc éditorial « À la une » — pas une carte générique : bordure gauche
 * verte, titre Fraunces, chips d'infos, pill deadline (amber si urgent).
 */
export function BlocALaUne({ bourse }: { bourse: Bourse }) {
  const j = joursRestants(bourse.deadline);
  const urgent = j !== null && j > 0 && j <= 30;

  const deadlineLabel = bourse.deadline
    ? `Ferme le ${formaterDate(bourse.deadline)}`
    : bourse.deadline_texte ?? "Date à confirmer";

  // Chips dérivées des champs réellement disponibles (max 3).
  const chips: { icon: ReactNode; label: string }[] = [
    { icon: <IconMontant className="size-4 text-stone-400" />, label: montantAffichage(bourse) },
  ];
  if (bourse.niveau_etudes.length > 0) {
    chips.push({
      icon: <IconUsers className="size-4 text-stone-400" />,
      label: bourse.niveau_etudes.map(capitalize).join(" · "),
    });
  } else if (bourse.age_maximum != null) {
    chips.push({
      icon: <IconUsers className="size-4 text-stone-400" />,
      label: `Candidats ≤ ${bourse.age_maximum} ans`,
    });
  }
  if (j !== null && j > 0) {
    chips.push({ icon: <IconClock className="size-4 text-stone-400" />, label: `${j} jours restants` });
  } else if (bourse.langue_requise) {
    chips.push({ icon: <IconClock className="size-4 text-stone-400" />, label: bourse.langue_requise });
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-1.5 text-brand-700">
        <IconStar className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Mise en avant</span>
      </div>

      <h3 className="mt-3 font-serif text-2xl leading-snug text-stone-900">
        {bourse.titre ?? "(sans titre)"}
      </h3>
      {bourse.organisation && (
        <p className="mt-1 text-sm text-stone-500">{bourse.organisation}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-700">
        {chips.slice(0, 3).map((c, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {c.icon}
            {c.label}
          </span>
        ))}
      </div>

      {bourse.resume && (
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 line-clamp-3">
          {bourse.resume}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
            urgent ? "bg-accent-100 text-accent-900" : "bg-stone-100 text-stone-600"
          }`}
        >
          <IconCalendar className="size-4" />
          {deadlineLabel}
        </span>

        <Link
          href={`/bourses/${bourse.slug}`}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:border-brand-700 hover:text-brand-700"
        >
          Voir les détails
          <IconArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
