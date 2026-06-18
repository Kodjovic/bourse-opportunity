import Link from "next/link";
import { Guide } from "@/types/guide";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Candidature: { bg: "#E1F5EE", text: "#085041" },
  Rédaction: { bg: "#FAEEDA", text: "#633806" },
  Destination: { bg: "#E6F1FB", text: "#0C447C" },
  Dossier: { bg: "#EAF3DE", text: "#27500A" },
  Conseils: { bg: "#FCEBEB", text: "#791F1F" },
};

const DEFAULT_COLOR = { bg: "#F1EFE8", text: "#444441" };

export function GuideCard({ guide }: { guide: Guide }) {
  const colors = CATEGORY_COLORS[guide.category] || DEFAULT_COLOR;

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-300"
    >
      {/* Icône colorée */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {guide.icon}
      </div>

      {/* Titre */}
      <h3 className="text-sm font-medium leading-tight text-gray-900 transition-colors group-hover:text-orange-700">
        {guide.title}
      </h3>

      {/* Sous-titre */}
      <p className="text-[11px] leading-snug text-gray-500 line-clamp-2">
        {guide.subtitle}
      </p>

      {/* Lien lire */}
      <div className="mt-auto text-[11px] font-medium text-gray-300 group-hover:text-gray-500">
        Lire →
      </div>
    </Link>
  );
}
