import Link from "next/link";

export function ConversionBox() {
  return (
    <div className="border-l-4 border-emerald-500 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-r-xl shadow-sm my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm mb-1">
            🎓 Prêt pour l'étape suivante ?
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Après la réussite de vos examens scolaires, explorez des centaines d'opportunités de bourses d'études entièrement financées disponibles pour les étudiants africains.
          </p>
        </div>
        <Link
          href="/bourses"
          className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Découvrir les Bourses →
        </Link>
      </div>
    </div>
  );
}
