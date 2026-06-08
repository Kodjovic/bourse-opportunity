import { BourseCard } from "@/components/BourseCard";
import type { Bourse } from "@/types/bourse";

/**
 * Bloc « Bourses similaires » affiché en bas de la page détail.
 *
 * Sert la boucle de découverte interne : le visiteur enchaîne d'une bourse
 * à la suivante au lieu de quitter le site. La sélection est calculée par
 * `boursesSimilaires()` (lib/scoring). Ne s'affiche pas s'il n'y a rien.
 */
export function BoursesSimilaires({ bourses }: { bourses: Bourse[] }) {
  if (bourses.length === 0) return null;

  return (
    <section className="mt-16 border-t border-stone-200 pt-10">
      <h2 className="font-serif text-2xl font-semibold text-stone-900">
        Bourses similaires
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        D&apos;autres opportunités qui pourraient vous intéresser.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bourses.map((b) => (
          <BourseCard key={b.slug || b.source_url} bourse={b} />
        ))}
      </div>
    </section>
  );
}
