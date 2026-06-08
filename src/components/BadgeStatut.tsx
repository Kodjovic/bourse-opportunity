import { capitalize } from "@/lib/utils";
import type { Bourse } from "@/types/bourse";

const COULEURS: Record<string, { dot: string; bg: string; text: string }> = {
  ouvert: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-800" },
  "fermé": { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-800" },
  "à venir": { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-800" },
};

const DEFAULT_COULEUR = {
  dot: "bg-stone-400",
  bg: "bg-stone-100",
  text: "text-stone-700",
};

export function BadgeStatut({
  statut,
  size = "md",
}: {
  statut: Bourse["statut"];
  size?: "sm" | "md";
}) {
  if (!statut) return null;
  const c = COULEURS[statut] ?? DEFAULT_COULEUR;
  const cls =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${cls}`}
    >
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {capitalize(statut)}
    </span>
  );
}
