"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NouveauGuidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [rawText, setRawText] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    category: "Candidature",
    readingTime: 5,
    tags: "",
    icon: "📚",
    isFeatured: false,
    content: "",
  });

  const handleExtract = async () => {
    if (!rawText) return alert("Colle un texte d'abord !");
    setExtracting(true);
    try {
      const res = await fetch("/api/guides/extract", {
        method: "POST",
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setFormData({
        ...data,
        tags: data.tags.join(", "),
      });
    } catch (error) {
      alert("Erreur lors de l'extraction IA");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const guide = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      publishedAt: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/guides", {
        method: "POST",
        body: JSON.stringify(guide),
      });
      if (res.ok) {
        router.push("/guides");
        router.refresh();
      } else {
        alert("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/guides" className="text-sm text-gray-500 hover:underline">
        ← Retour aux guides
      </Link>
      
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Créer un nouveau guide</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Colonne 1 : Extraction IA */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">1. Extraction Magique (IA)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Colle ici un article, une page de bourse ou tes notes brutes. L'IA va structurer le guide pour toi.
          </p>
          <textarea
            className="mt-4 h-64 w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Colle ton texte ici..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="mt-4 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {extracting ? "Extraction en cours..." : "🪄 Extraire avec l'IA"}
          </button>
        </div>

        {/* Colonne 2 : Formulaire de modification */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">2. Vérifier et Publier</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">Titre</label>
              <input
                required
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Slug (URL)</label>
              <input
                required
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Catégorie</label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Candidature</option>
                <option>Rédaction</option>
                <option>Destination</option>
                <option>Dossier</option>
                <option>Conseils</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Temps (min)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Icône (Emoji)</label>
              <input
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Sous-titre (Résumé SEO)</label>
            <textarea
              required
              className="h-20 w-full rounded-lg border border-gray-200 p-2 text-sm"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Tags (séparés par des virgules)</label>
            <input
              className="w-full rounded-lg border border-gray-200 p-2 text-sm"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Contenu (Markdown)</label>
            <textarea
              required
              className="h-64 w-full rounded-lg border border-gray-200 p-2 text-sm font-mono"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium">Mettre à la une</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 py-4 font-bold text-white transition hover:bg-black disabled:opacity-50"
          >
            {loading ? "Publication..." : "🚀 Publier le guide"}
          </button>
        </form>
      </div>
    </main>
  );
}
