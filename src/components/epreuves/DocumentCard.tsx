import Link from "next/link";
import { EpreuveDocument } from "@/types/epreuves";

interface DocumentCardProps {
  doc: EpreuveDocument;
}

export function DocumentCard({ doc }: DocumentCardProps) {
  // Déterminer la classe de couleur de l'examen
  const getExamenBadgeClass = (exam: string) => {
    switch (exam.toUpperCase()) {
      case "BAC":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30";
      case "BEPC":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30";
      case "CEPD":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-100 dark:border-sky-800/30";
      case "BTS":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-100 dark:border-amber-800/30";
      default:
        return "bg-zinc-50 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-700/30";
    }
  };

  // Déterminer la couleur du badge de matière
  const getMatiereBadgeClass = (matiere: string) => {
    switch (matiere.toLowerCase()) {
      case "mathematiques":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
      case "physique-chimie":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
      case "svt":
        return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300";
      case "francais":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
      case "histoire-geo":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
      default:
        return "bg-zinc-50 text-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400";
    }
  };

  // Titre convivial de la matière
  const formatMatiere = (matiere: string) => {
    return matiere
      .split("-")
      .map(word => {
        if (word === "svt") return "SVT";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  // Label court du type
  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case "examen": return "Examen national";
      case "devoir": return "Devoir surveillé";
      case "composition": return "Composition";
      default: return type;
    }
  };

  return (
    <Link href={doc.slug} className="block group">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {doc.type === "examen" && doc.examen ? (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getExamenBadgeClass(doc.examen)}`}>
                {doc.examen} {doc.serie ? `Série ${doc.serie.toUpperCase()}` : ""}
              </span>
            ) : (
              <span className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
                {doc.classe || "Tous niveaux"}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getMatiereBadgeClass(doc.matiere)}`}>
              {formatMatiere(doc.matiere)}
            </span>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {doc.annee}
          </span>
        </div>

        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors line-clamp-1 mb-2">
          {doc.type === "examen" 
            ? `Épreuve de ${formatMatiere(doc.matiere)} - ${doc.examen} ${doc.annee}`
            : `${getDocTypeLabel(doc.type)} de ${formatMatiere(doc.matiere)}`
          }
        </h3>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex gap-1.5 items-center">
            {doc.fichiers.sujet && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                📄 Sujet
              </span>
            )}
            {doc.fichiers.corrige && (
              <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-medium">
                ✅ Corrigé
              </span>
            )}
          </div>
          <span className="text-zinc-400 dark:text-zinc-500">
            {doc.session}
          </span>
        </div>
      </div>
    </Link>
  );
}
