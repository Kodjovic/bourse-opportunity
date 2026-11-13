import fs from "node:fs";
import path from "node:path";

type DocumentPdfProps = {
  /** Chemin public (/docs/xxx.pdf) ou URL absolue. */
  url?: string | null;
  /** Libellé affiché ; par défaut « Document officiel (PDF) ». */
  label?: string | null;
};

/**
 * Poids du fichier, quand il est servi localement depuis `public/`.
 * Retourne null si l'URL est distante ou le fichier introuvable :
 * l'information n'est alors simplement pas affichée.
 */
function poidsFichier(url: string): string | null {
  if (/^(https?:)?\/\//i.test(url) || url.includes("..")) return null;

  try {
    const cheminRelatif = decodeURIComponent(url.split("?")[0].split("#")[0]);
    const chemin = path.join(process.cwd(), "public", cheminRelatif);
    const { size } = fs.statSync(chemin);
    if (!size) return null;
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} Ko`;
    return `${(size / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
  } catch {
    return null;
  }
}

/**
 * Bloc « document PDF » des fiches bourse / actualité / guide.
 *
 * Volontairement sans iframe : sur un téléphone Android en données mobiles,
 * la visionneuse PDF intégrée affiche un cadre vide. Deux liens suffisent
 * (téléchargement direct + ouverture dans un onglet), et évitent d'alourdir
 * la page avec le document complet.
 */
export function DocumentPdf({ url, label }: DocumentPdfProps) {
  if (!url) return null;

  const titre = label?.trim() || "Document officiel (PDF)";
  const poids = poidsFichier(url);

  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-2xl leading-none">
            📄
          </span>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              Document à télécharger
            </h2>
            <p className="mt-1 font-medium text-stone-900">{titre}</p>
            <p className="mt-0.5 text-xs text-stone-500">
              PDF{poids ? ` · ${poids}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={url}
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            <span aria-hidden>📥</span>
            Télécharger
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-500"
          >
            <span aria-hidden>↗</span>
            Ouvrir dans un onglet
          </a>
        </div>
      </div>
    </section>
  );
}
