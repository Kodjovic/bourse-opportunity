import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BoursesSimilaires } from "@/components/BoursesSimilaires";
import { ContactEmail } from "@/components/ContactEmail";
import { PartageSocial } from "@/components/PartageSocial";
import { getAllBourses, getAllSlugs, getBourseBySlug } from "@/lib/bourses";
import { boursesSimilaires } from "@/lib/scoring";
import type { Bourse } from "@/types/bourse";

type Props = {
  params: Promise<{ slug: string }>;
};

// ------------------------------------------------------------------
// SSG : une page par bourse
// ------------------------------------------------------------------
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ------------------------------------------------------------------
// SEO metadata
// ------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bourse = await getBourseBySlug(slug);
  if (!bourse) return { title: "Bourse introuvable" };

  const titre = bourse.titre || "Bourse";
  const description =
    bourse.resume ||
    `Bourse d'études proposée par ${bourse.organisation || "—"}.`;

  return {
    title: titre,
    description: description.slice(0, 155),
    keywords: bourse.mots_cles?.length ? bourse.mots_cles : undefined,
    openGraph: {
      title: titre,
      description: description.slice(0, 200),
      type: "article",
      url: `/bourses/${slug}`,
    },
    alternates: { canonical: `/bourses/${slug}` },
  };
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------
export default async function PageBourse({ params }: Props) {
  const { slug } = await params;
  const bourse = await getBourseBySlug(slug);
  if (!bourse) notFound();

  const similaires = boursesSimilaires(bourse, await getAllBourses());

  return (
    <div className="bg-stone-50">
      <StructuredData bourse={bourse} />

      <article className="mx-auto max-w-6xl px-6 py-10">
        <Breadcrumb titre={bourse.titre} />

        {/* En-tête */}
        <header className="mt-6">
          {bourse.organisation && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
              {bourse.organisation}
            </p>
          )}

          <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {bourse.titre}
          </h1>

          {bourse.organisation && (
            <p className="mt-3 text-stone-600">
              Proposé par{" "}
              <span className="font-medium text-stone-900">
                {bourse.organisation}
              </span>
            </p>
          )}

          {/* Badges combinés : statut + type_financement + niveaux */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <BadgeStatut statut={bourse.statut} />
            {bourse.type_financement && (
              <Pill className="bg-orange-100 text-orange-900">
                {bourse.type_financement}
              </Pill>
            )}
            {bourse.niveau_etudes.map((n) => (
              <Pill key={n} className="border border-stone-300 bg-white text-stone-700">
                {capitalize(n)}
              </Pill>
            ))}
          </div>
        </header>

        {/* Carte deadline + countdown */}
        <CarteDeadline bourse={bourse} />

        {/* Grille de stats */}
        <GrilleStats bourse={bourse} />

        {/* Corps : 2 colonnes (éditorial + sidebar CTA) */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {bourse.resume && (
              <Section titre="Notre analyse">
                <p className="text-[17px] leading-relaxed text-stone-700">
                  {bourse.resume}
                </p>
              </Section>
            )}

            {bourse.avantages?.length > 0 && (
              <Section titre="Avantages & Financement" icone="💰">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {bourse.avantages.map((a) => (
                    <div key={a} className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                      <span className="text-orange-600">✓</span>
                      <span className="text-stone-700 font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {bourse.eligibilite?.length > 0 && (
              <Section titre="Critères d'éligibilité" icone="🎓">
                <ul className="space-y-3">
                  {bourse.eligibilite.map((e) => (
                    <li key={e} className="flex gap-3 text-stone-700">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-stone-400" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {bourse.procedure_etapes?.length > 0 && (
              <Section titre="Comment postuler ?" icone="📝">
                <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-stone-200">
                  {bourse.procedure_etapes.map((etape, i) => (
                    <div key={etape} className="relative flex gap-6 pl-10">
                      <span className="absolute left-0 flex size-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-stone-700 pt-1">{etape}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {(bourse.liens_utiles?.length > 0 || bourse.contacts?.length > 0 || bourse.lien_candidature) && (
              <Section titre="Ressources & Contacts" icone="🔗">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Lien de candidature prioritaire s'il existe */}
                    {bourse.lien_candidature && (
                      <a
                        href={bourse.lien_candidature}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border-2 border-orange-100 bg-orange-50 p-4 text-orange-900 transition hover:border-orange-300"
                      >
                        <span className="text-xl">🌐</span>
                        <div className="flex flex-col">
                          <span className="font-bold">Portail de candidature</span>
                          <span className="text-xs opacity-70">Site officiel</span>
                        </div>
                      </a>
                    )}

                    {/* Autres liens extraits - On filtre pour ne pas répéter le portail principal */}
                    {bourse.liens_utiles?.filter(l => l.url !== bourse.lien_candidature).map((lien) => {
                      const estPdf = lien.url.toLowerCase().endsWith(".pdf");
                      const estDoc = lien.url.toLowerCase().match(/\.(doc|docx|odt)$/);
                      return (
                        <a
                          key={lien.url}
                          href={lien.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 text-stone-700 transition hover:border-orange-400 hover:text-orange-700"
                        >
                          <span className="text-xl">{estPdf || estDoc ? "📄" : "🌐"}</span>
                          <span className="font-medium">{lien.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  {bourse.contacts?.length > 0 && (
                    <div className="rounded-xl bg-stone-100 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                        Besoin d&apos;aide ?
                      </p>
                      <ul className="mt-3 space-y-3">
                        {bourse.contacts.map((c) => (
                          <ContactEmail key={c} email={c} />
                        ))}
                        {bourse.adresse && (
                          <li className="flex items-start gap-2 text-stone-700">
                            <span className="text-orange-600 text-lg">📍</span>
                            <span className="font-medium text-sm">{bourse.adresse}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {bourse.documents_requis.length > 0 && (
              <Section titre="Documents requis" icone="📂">
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {bourse.documents_requis.map((d) => (
                    <li key={d} className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">
                      <span aria-hidden>📄</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {bourse.pays_eligibles.length > 0 && (
              <Section titre="Pays africains éligibles" icone="🌍">
                <ul className="flex flex-wrap gap-2">
                  {bourse.pays_eligibles.map((p) => (
                    <li key={p}>
                      <Link
                        href={`/bourses/pays/${slugifyClient(p)}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 hover:border-stone-400 hover:text-stone-900"
                      >
                        <span className="size-1 rounded-full bg-orange-600" />
                        {p}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <CarteCTA bourse={bourse} />
            <PartageSocial titre={bourse.titre || "Bourse"} slug={slug} />
          </aside>
        </div>

        {/* Boucle de découverte : autres bourses pertinentes */}
        <BoursesSimilaires bourses={similaires} />
      </article>
    </div>
  );
}

// ==================================================================
// Sous-composants
// ==================================================================

function Breadcrumb({ titre }: { titre: string | null }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="text-sm text-stone-500"
    >
      <Link href="/" className="hover:text-stone-900">Accueil</Link>
      <span className="mx-2 text-stone-300">›</span>
      <Link href="/bourses" className="hover:text-stone-900">Bourses</Link>
      <span className="mx-2 text-stone-300">›</span>
      <span className="text-stone-700">{titre || "Bourse"}</span>
    </nav>
  );
}

function BadgeStatut({ statut }: { statut: Bourse["statut"] }) {
  if (!statut) return null;
  const config: Record<string, { dot: string; bg: string; text: string }> = {
    ouvert: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-800" },
    "fermé": { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-800" },
    "à venir": { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-800" },
  };
  const c = config[statut] ?? {
    dot: "bg-stone-400",
    bg: "bg-stone-100",
    text: "text-stone-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${c.bg} ${c.text}`}
    >
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {capitalize(statut)}
    </span>
  );
}

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function CarteDeadline({ bourse }: { bourse: Bourse }) {
  const info = computerCountdown(bourse.deadline);
  const dateTexte = bourse.deadline_texte || (bourse.deadline ? formaterDate(bourse.deadline) : "—");

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50/40 p-6 sm:p-8">
      {/* Badge countdown coin droit - On le cache sur très petit mobile si besoin ou on réduit sa taille */}
      <div className="absolute right-5 top-5 text-right z-10">
        <div
          className={`font-serif text-3xl sm:text-4xl font-semibold leading-none ${
            info.passe ? "text-red-700" : "text-orange-700"
          }`}
        >
          {info.affichage}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">
          {info.label}
        </div>
      </div>

      <div className="flex items-start gap-4 pr-24 sm:pr-32">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <span className="text-lg sm:text-xl" aria-hidden>📅</span>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-stone-500">
            Date limite
          </div>
          <div className="mt-1 font-serif text-lg sm:text-2xl font-semibold text-stone-900 leading-tight">
            {bourse.deadline ? (
              <time dateTime={bourse.deadline}>{dateTexte}</time>
            ) : (
              <span className="block max-w-[200px] sm:max-w-md">{dateTexte}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrilleStats({ bourse }: { bourse: Bourse }) {
  const stats: Array<{ label: string; valeur: string }> = [];

  if (bourse.type_financement) {
    stats.push({ label: "Financement", valeur: bourse.type_financement });
  }
  if (bourse.niveau_etudes.length > 0) {
    stats.push({
      label: "Niveau d'études",
      valeur: bourse.niveau_etudes.map(capitalize).join(" & "),
    });
  }
  if (bourse.langue_requise) {
    stats.push({ label: "Langue", valeur: capitalize(bourse.langue_requise) });
  }
  if (bourse.age_maximum != null) {
    stats.push({ label: "Âge maximum", valeur: `${bourse.age_maximum} ans` });
  }
  if (bourse.statut) {
    stats.push({ label: "Statut", valeur: capitalize(bourse.statut) });
  }

  if (stats.length === 0) return null;

  return (
    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white p-5">
          <dt className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            {s.label}
          </dt>
          <dd className="mt-1 font-serif text-lg font-semibold text-stone-900">
            {s.valeur}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Section({
  titre,
  icone,
  children,
}: {
  titre: string;
  icone?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-center gap-3">
        {icone && <span className="text-2xl" aria-hidden>{icone}</span>}
        <h2 className="font-serif text-2xl font-semibold text-stone-900">
          {titre}
        </h2>
      </div>
      <div className="mt-2 h-px w-12 bg-orange-600" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CarteCTA({ bourse }: { bourse: Bourse }) {
  const lien = bourse.lien_candidature || bourse.source_url;
  const deadlineTexte =
    bourse.deadline_texte || (bourse.deadline ? formaterDate(bourse.deadline) : null);

  // On cherche si un "Site officiel" manuel existe dans les ressources
  const siteOfficielManuel = bourse.liens_utiles?.find(l => l.label === "Site officiel")?.url;
  const lienAAfficher = siteOfficielManuel || lien;

  return (
    <div className="overflow-hidden rounded-2xl bg-stone-900 p-6 text-stone-50 shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        Action
      </div>
      <h3 className="mt-1 font-serif text-2xl font-semibold">
        Postuler maintenant
      </h3>
      {deadlineTexte && (
        <p className="mt-2 text-sm text-stone-300">
          Deadline&nbsp;: {deadlineTexte}
        </p>
      )}
      <a
        href={lienAAfficher}
        target="_blank"
        rel="noopener external"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-400"
      >
        Voir le site officiel
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

// ==================================================================
// JSON-LD
// ==================================================================
function StructuredData({ bourse }: { bourse: Bourse }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: bourse.titre,
    description: bourse.resume,
    url: bourse.source_url,
    applicationDeadline: bourse.deadline || undefined,
    provider: bourse.organisation
      ? { "@type": "Organization", name: bourse.organisation }
      : undefined,
    educationalCredentialAwarded: bourse.niveau_etudes.length
      ? bourse.niveau_etudes
      : undefined,
    occupationalCategory: bourse.domaines.length ? bourse.domaines : undefined,
    eligibleRegion: bourse.pays_eligibles.length
      ? bourse.pays_eligibles.map((p) => ({ "@type": "Place", name: p }))
      : undefined,
    inLanguage: bourse.langue_requise || undefined,
    offers: {
      "@type": "Offer",
      description: bourse.avantages?.join(", "),
    },
    abstract: bourse.procedure_etapes?.join(" "),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ==================================================================
// Utilitaires
// ==================================================================

function formaterDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function computerCountdown(iso: string | null): {
  affichage: string;
  label: string;
  passe: boolean;
} {
  if (!iso) return { affichage: "—", label: "non précisée", passe: false };
  const deadline = new Date(`${iso}T23:59:59`);
  const maintenant = new Date();
  const diffMs = deadline.getTime() - maintenant.getTime();
  const jours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (jours < 0) return { affichage: "0", label: "clôturée", passe: true };
  if (jours === 0) return { affichage: "0", label: "aujourd'hui", passe: false };
  return {
    affichage: `${jours}`,
    label: jours === 1 ? "jour restant" : "jours restants",
    passe: false,
  };
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function slugifyClient(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
