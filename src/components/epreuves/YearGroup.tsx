import { EpreuveDocument } from "@/types/epreuves";
import { DocumentCard } from "./DocumentCard";

interface YearGroupProps {
  annee: number;
  docs: EpreuveDocument[];
}

export function YearGroup({ annee, docs }: YearGroupProps) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-4 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800/50 py-2 px-4 rounded-lg">
        <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
          Session {annee}
        </h2>
        <span className="text-xs bg-zinc-150 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full font-medium">
          {docs.length} {docs.length > 1 ? "épreuves" : "épreuve"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
