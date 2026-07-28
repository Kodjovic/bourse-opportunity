"use client";

import { useState } from "react";

export function FormulaireContact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Ajout de la clé d'accès Web3Forms fournie
    formData.append("access_key", "d0b63d04-1c28-464b-9c0f-b175b656e93f");
    // Ajout du titre de l'e-mail pour le sujet
    formData.append("subject", "Nouveau message de contact - Afrik'Ose");
    // Nom du site pour l'expéditeur dans l'e-mail
    formData.append("from_name", "Afrik'Ose Contact");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Une erreur est survenue lors de l'envoi.");
      }
    } catch (error) {
      console.error("Erreur de soumission du formulaire:", error);
      setStatus("error");
      setErrorMessage("Impossible de se connecter au serveur d'envoi. Veuillez vérifier votre connexion.");
    }
  }

  return (
    <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-stone-900">
        Envoyer un message
      </h2>
      <p className="mt-2 text-sm text-stone-500">
        Une question, un signalement ou une suggestion de partenariat ? Remplissez ce formulaire et nous vous répondrons par e-mail dans les plus brefs délais.
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-xl bg-emerald-50 p-6 text-emerald-800 border border-emerald-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <h3 className="font-semibold text-emerald-900">Message envoyé avec succès !</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Merci pour votre message. Nous l&apos;avons bien reçu et nous l&apos;étudierons très attentivement. Une réponse vous sera apportée directement sur l&apos;adresse e-mail renseignée.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleOnSubmit} className="mt-6 space-y-4">
          {/* Protection antispam Honeypot (invisible pour les humains, rempli par les robots spammeurs) */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Ex: Jean Dupont"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm placeholder-stone-400 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Ex: jean.dupont@gmail.com"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm placeholder-stone-400 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Objet du message
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="Ex: Suggestion de bourse d'études, partenariat..."
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm placeholder-stone-400 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Votre message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Écrivez votre message ici..."
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm placeholder-stone-400 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
            ></textarea>
          </div>

          {status === "error" && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
              <span className="font-semibold">Une erreur est survenue :</span> {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-950 transition disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
