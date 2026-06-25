"use client";

import { useState, useEffect } from "react";

interface PartageSocialProps {
  titre: string;
  slug: string;
  type?: "bourse" | "actualite";
}

export function PartageSocial({ titre, slug, type = "bourse" }: PartageSocialProps) {
  const [copie, setCopie] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const basePath = type === "actualite" ? "/actualites" : "/bourses";
  const fullUrl = isClient ? `${window.location.origin}${basePath}/${slug}` : "";
  const urlEncodee = encodeURIComponent(fullUrl);
  
  const partagesText = type === "actualite"
    ? `📰 Actualité intéressante sur Afrik'Ose : ${titre}`
    : `🎓 Super opportunité de bourse : ${titre}`;
  const texteEncode = encodeURIComponent(partagesText);

  const copierLien = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  const reseaux = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${texteEncode}%20${urlEncodee}`,
      color: "bg-[#25D366]",
      icon: (
        <svg className="size-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.123.54 4.197 1.566 6.073L0 24l6.082-1.594a11.946 11.946 0 005.96 1.584h.005c6.635 0 12.045-5.413 12.048-12.051a11.85 11.85 0 00-3.418-8.521z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${urlEncodee}`,
      color: "bg-[#1877F2]",
      icon: (
        <svg className="size-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncodee}`,
      color: "bg-[#0A66C2]",
      icon: (
        <svg className="size-5 fill-current" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-lg font-semibold text-stone-900">
        {type === "actualite" ? "Partager cet article" : "Partager cette bourse"}
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        {type === "actualite" ? "Partagez cette actualité importante avec vos proches." : "Aidez un proche en lui envoyant cette opportunité."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {reseaux.map((r) => (
          <a
            key={r.name}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex size-10 items-center justify-center rounded-xl text-white transition hover:scale-105 active:scale-95 ${r.color}`}
            title={`Partager sur ${r.name}`}
          >
            {r.icon}
          </a>
        ))}
        
        <button
          onClick={copierLien}
          className="flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100 active:bg-stone-200"
        >
          {copie ? (
            <>
              <span className="text-emerald-600">✅</span> Copié
            </>
          ) : (
            <>
              <span className="text-stone-400">🔗</span> Copier le lien
            </>
          )}
        </button>
      </div>
    </div>
  );
}
