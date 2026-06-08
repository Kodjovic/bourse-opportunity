import Link from "next/link";

export type FilEntree = { label: string; href?: string };

/**
 * Fil d'Ariane accessible. La dernière entrée est non-cliquable.
 */
export function Breadcrumb({ entries }: { entries: FilEntree[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-stone-500">
      {entries.map((e, i) => {
        const dernier = i === entries.length - 1;
        return (
          <span key={`${e.label}-${i}`}>
            {i > 0 && <span className="mx-2 text-stone-300">›</span>}
            {e.href && !dernier ? (
              <Link href={e.href} className="hover:text-stone-900">
                {e.label}
              </Link>
            ) : (
              <span className={dernier ? "text-stone-700" : ""}>{e.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
