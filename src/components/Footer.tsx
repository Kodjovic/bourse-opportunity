import Link from "next/link";

import { getNiveauxUniques, getPaysUniques } from "@/lib/bourses";
import { capitalize, slugifyClient } from "@/lib/utils";

/**
 * Footer global avec maillage interne vers les pages catégories
 * (renforce le SEO en distribuant l'autorité depuis chaque page).
 */
export async function Footer() {
  const niveaux = await getNiveauxUniques();
  const paysTop = (await getPaysUniques()).slice(0, 10);

  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="font-serif text-xl font-semibold text-stone-900">
              <span aria-hidden className="mr-1.5">🌍</span>
              Bourses africaines
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Le directory des bourses d'études pour les étudiants et
              chercheurs africains. Mis à jour régulièrement.
            </p>
          </div>

          <ColonneLiens
            titre="Catégories"
            liens={[
              { href: "/bourses/ouvertes", label: "Bourses ouvertes" },
              {
                href: "/bourses/entierement-financees",
                label: "Entièrement financées",
              },
              { href: "/bourses", label: "Toutes les bourses" },
            ]}
          />

          {niveaux.length > 0 && (
            <ColonneLiens
              titre="Niveaux"
              liens={niveaux.map((n) => ({
                href: `/bourses/niveau/${slugifyClient(n)}`,
                label: capitalize(n),
              }))}
            />
          )}

          {paysTop.length > 0 && (
            <ColonneLiens
              titre="Pays"
              liens={paysTop.map((p) => ({
                href: `/bourses/pays/${slugifyClient(p)}`,
                label: p,
              }))}
            />
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/a-propos" className="hover:text-stone-900">
              À propos
            </Link>
            <Link href="/guides" className="hover:text-stone-900">
              Guides
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColonneLiens({
  titre,
  liens,
}: {
  titre: string;
  liens: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        {titre}
      </h3>
      <ul className="mt-4 space-y-2 text-sm text-stone-700">
        {liens.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-stone-900 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
      ))}
      </ul>
    </div>
  );
}
