import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ListeBourses } from "@/components/ListeBourses";
import { getAllBourses } from "@/lib/bourses";

export const metadata: Metadata = {
  title: "Bourses entièrement financées",
  description:
    "Bourses 100% financées pour étudiants africains : frais de scolarité, " +
    "billet d'avion, allocation de vie et assurance santé pris en charge.",
  alternates: { canonical: "/bourses/entierement-financees" },
};

function estComplete(type: string | null): boolean {
  if (!type) return false;
  const t = type.toLowerCase();
  return (
    t.includes("complète") ||
    t.includes("complete") ||
    t.includes("intégrale") ||
    t.includes("integrale") ||
    t.includes("fully funded")
  );
}

export default async function PageEntierementFinancees() {
  const toutes = await getAllBourses();
  const completes = toutes.filter((b) => estComplete(b.type_financement));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Breadcrumb
        entries={[
          { label: "Accueil", href: "/" },
          { label: "Bourses", href: "/bourses" },
          { label: "Entièrement financées" },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Catégorie
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Bourses entièrement financées
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Ces bourses couvrent l&apos;intégralité des coûts : frais de scolarité,
          voyage, logement, allocation de vie et assurance santé. Aucune
          contribution financière à charge de l&apos;étudiant — l&apos;option la plus
          accessible pour les profils talentueux mais sans moyens.
        </p>
      </header>

      <div className="mt-10">
        <ListeBourses bourses={completes} />
      </div>
    </main>
  );
}
