"use client";

import { useState } from "react";

export function ContactEmail({ email }: { email: string }) {
  const [copie, setCopie] = useState(false);

  const copier = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  return (
    <li className="flex flex-wrap items-center gap-2 text-stone-700">
      <span className="text-orange-600">✉</span>
      <a 
        href={`mailto:${email}`} 
        className="font-medium hover:text-orange-700 hover:underline"
      >
        {email}
      </a>
      <button
        onClick={copier}
        className={`ml-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
          copie 
            ? "bg-emerald-500 text-white" 
            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
        }`}
      >
        {copie ? "Copié !" : "Copier"}
      </button>
    </li>
  );
}
