import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/epreuves/Breadcrumb";
import { ConversionBox } from "@/components/epreuves/ConversionBox";
import { YearGroup } from "@/components/epreuves/YearGroup";
import { getAllDocuments } from "@/lib/epreuves";

export const metadata: Metadata = {
  title: "Épreuves scolaires togolaises — BAC 1, BAC 2, BEPC, BTS",
  description:
    "Accédez gratuitement aux sujets et corrigés des examens nationaux togolais (BAC 1, BAC 2, BEPC, BTS) " +
    "ainsi qu'aux devoirs et compositions de classe pour exceller dans vos études.",
  alternates: { canonical: "/epreuves" },
};

export default async function PageEpreuvesLanding() {
  const tousDocs = await getAllDocuments();
  
  // Filtrer par types de documents
  const examens = tousDocs.filter((d) => d.type === "examen");
  const devoirs = tousDocs.filter((d) => d.type === "devoir");
  const compositions = tousDocs.filter((d) => d.type === "composition");

  // Séparation du BAC en BAC 1 et BAC 2 (avec rétrocompatibilité si examen === "BAC")
  const bac1s = examens.filter(
    (e) => e.examen?.toUpperCase() === "BAC1" || e.examen?.toUpperCase() === "BAC 1"
  );
  const bac2s = examens.filter(
    (e) =>
      e.examen?.toUpperCase() === "BAC2" ||
      e.examen?.toUpperCase() === "BAC 2" ||
      e.examen?.toUpperCase() === "BAC"
  );
  const bepcs = examens.filter((e) => e.examen?.toUpperCase() === "BEPC");
  const btss = examens.filter((e) => e.examen?.toUpperCase() === "BTS");

  // Liste des matières uniques présentes
  const matieresUniques = Array.from(new Set(tousDocs.map((d) => d.matiere)));

  // 4 dernières ajoutées
  const recentes = [...tousDocs]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4);

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 scroll-smooth">
      <Breadcrumb
        steps={[{ label: "Épreuves scolaires" }]}
      />

      <header className="mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 dark:text-zinc-100 sm:text-5xl">
          Annales & Examens Scolaires.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-zinc-400">
          Préparez vos examens officiels du Togo avec notre bibliothèque interactive. 
          Retrouvez les sujets originaux et leurs corrigés détaillés classés par niveau (BAC 1, BAC 2, BEPC, BTS) pour réviser efficacement.
        </p>
      </header>

      {/* Raccourcis examens nationaux avec liens ancrés (sans CEPD, avec BAC 1 & BAC 2) */}
      <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ExamTypeCard 
          exam="BEPC" 
          titre="BEPC" 
          count={bepcs.length} 
          color="hover:border-purple-500" 
          badgeColor="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
          href="#bepc"
        />
        <ExamTypeCard 
          exam="BAC 1" 
          titre="BAC 1 (Première)" 
          count={bac1s.length} 
          color="hover:border-sky-500" 
          badgeColor="bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
          href="#bac1"
        />
        <ExamTypeCard 
          exam="BAC 2" 
          titre="BAC 2 (Terminale)" 
          count={bac2s.length} 
          color="hover:border-emerald-500" 
          badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          href="#bac2"
        />
        <ExamTypeCard 
          exam="BTS" 
          titre="BTS" 
          count={btss.length} 
          color="hover:border-amber-500" 
          badgeColor="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          href="#bts"
        />
      </section>

      {/* Sections d'exploration */}
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Liste principale à gauche (2/3) */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Section BAC 2 */}
          {bac2s.length > 0 && (
            <section id="bac2" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 border-b border-stone-200 dark:border-zinc-800 pb-3">
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100">
                  Annales BAC 2 (Terminale)
                </h2>
                <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium bg-stone-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                  {bac2s.length} {bac2s.length > 1 ? "épreuves" : "épreuve"}
                </span>
              </div>
              <div className="space-y-6">
                {Array.from(new Set(bac2s.map(e => e.annee)))
                  .sort((a, b) => b - a)
                  .map(annee => (
                    <YearGroup 
                      key={`bac2-group-${annee}`} 
                      annee={annee} 
                      docs={bac2s.filter(e => e.annee === annee)} 
                    />
                  ))
                }
              </div>
            </section>
          )}

          {/* Section BAC 1 */}
          {bac1s.length > 0 && (
            <section id="bac1" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 border-b border-stone-200 dark:border-zinc-800 pb-3">
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100">
                  Annales BAC 1 (Probatoire)
                </h2>
                <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium bg-stone-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                  {bac1s.length} {bac1s.length > 1 ? "épreuves" : "épreuve"}
                </span>
              </div>
              <div className="space-y-6">
                {Array.from(new Set(bac1s.map(e => e.annee)))
                  .sort((a, b) => b - a)
                  .map(annee => (
                    <YearGroup 
                      key={`bac1-group-${annee}`} 
                      annee={annee} 
                      docs={bac1s.filter(e => e.annee === annee)} 
                    />
                  ))
                }
              </div>
            </section>
          )}

          {/* Section BEPC */}
          {bepcs.length > 0 && (
            <section id="bepc" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 border-b border-stone-200 dark:border-zinc-800 pb-3">
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100">
                  Annales BEPC (Togo)
                </h2>
                <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium bg-stone-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                  {bepcs.length} {bepcs.length > 1 ? "épreuves" : "épreuve"}
                </span>
              </div>
              <div className="space-y-6">
                {Array.from(new Set(bepcs.map(e => e.annee)))
                  .sort((a, b) => b - a)
                  .map(annee => (
                    <YearGroup 
                      key={`bepc-group-${annee}`} 
                      annee={annee} 
                      docs={bepcs.filter(e => e.annee === annee)} 
                    />
                  ))
                }
              </div>
            </section>
          )}

          {/* Section BTS */}
          {btss.length > 0 && (
            <section id="bts" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 border-b border-stone-200 dark:border-zinc-800 pb-3">
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100">
                  Annales BTS
                </h2>
                <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium bg-stone-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                  {btss.length} {btss.length > 1 ? "épreuves" : "épreuve"}
                </span>
              </div>
              <div className="space-y-6">
                {Array.from(new Set(btss.map(e => e.annee)))
                  .sort((a, b) => b - a)
                  .map(annee => (
                    <YearGroup 
                      key={`bts-group-${annee}`} 
                      annee={annee} 
                      docs={btss.filter(e => e.annee === annee)} 
                    />
                  ))
                }
              </div>
            </section>
          )}

          {/* Section Devoirs & Compositions */}
          <section id="devoirs-compositions" className="scroll-mt-20">
            <div className="flex items-center justify-between mb-6 border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-zinc-100">
                Devoirs & Compositions de classe
              </h2>
              <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium bg-stone-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                {devoirs.length + compositions.length} documents
              </span>
            </div>

            {(devoirs.length === 0 && compositions.length === 0) ? (
              <p className="text-sm text-stone-500 dark:text-zinc-400 italic">Aucun devoir ou composition disponible.</p>
            ) : (
              <div className="space-y-6">
                {/* On regroupe par année */}
                {Array.from(new Set([...devoirs, ...compositions].map(e => e.annee)))
                  .sort((a, b) => b - a)
                  .map(annee => (
                    <YearGroup 
                      key={`class-group-${annee}`} 
                      annee={annee} 
                      docs={[...devoirs, ...compositions].filter(e => e.annee === annee)} 
                    />
                  ))
                }
              </div>
            )}
          </section>
        </div>

        {/* Sidebar à droite (1/3) */}
        <div className="space-y-8">
          {/* Liste des matières */}
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-zinc-100 mb-4 pb-2 border-b border-stone-100 dark:border-zinc-800">
              Par matière
            </h3>
            <div className="flex flex-wrap gap-2">
              {matieresUniques.map((matiere) => (
                <div
                  key={matiere}
                  className="bg-stone-50 hover:bg-stone-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-stone-100 dark:border-zinc-850 cursor-pointer font-medium transition-all"
                >
                  {formatMatiere(matiere)}
                </div>
              ))}
            </div>
          </div>

          {/* Récemment ajoutés */}
          {recentes.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-zinc-100 mb-4 pb-2 border-b border-stone-100 dark:border-zinc-800">
                Derniers ajouts
              </h3>
              <ul className="space-y-3.5">
                {recentes.map((doc) => (
                  <li key={`rec-${doc.id}`} className="group">
                    <Link href={doc.slug} className="block">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-1">
                        <span>{doc.type === "examen" ? doc.examen : doc.type}</span>
                        <span>{doc.annee}</span>
                      </div>
                      <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {formatMatiere(doc.matiere)} — {doc.classe || doc.session}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encart infos Togo */}
          <div className="bg-emerald-50/50 dark:bg-zinc-900/30 border border-emerald-100 dark:border-emerald-950/50 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">
              Réussir au Togo
            </h3>
            <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-zinc-400">
              Cette section est co-éditée avec des enseignants togolais de Lomé, Kara et d&apos;autres localités pour vous assurer des contenus de haute qualité conformes aux directives du ministère de l&apos;Éducation.
            </p>
          </div>
        </div>
      </div>

      <ConversionBox />
    </main>
  );
}

// Composant interne pour les cartes d'examen
function ExamTypeCard({ exam, titre, count, color, badgeColor, href }: { 
  exam: string; 
  titre: string; 
  count: number; 
  color: string;
  badgeColor: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${color} group`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
            {exam}
          </span>
          <span className="text-xs text-stone-400 dark:text-zinc-500 font-semibold group-hover:text-emerald-500 transition-colors">
            ➔
          </span>
        </div>
        <h3 className="font-bold text-stone-800 dark:text-zinc-200 text-sm group-hover:text-emerald-500 transition-colors">
          Annales {titre}
        </h3>
        <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1">
          {count} {count > 1 ? "épreuves" : "épreuve"}
        </p>
      </div>
    </Link>
  );
}
