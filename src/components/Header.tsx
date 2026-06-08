import Link from "next/link";

import { SearchForm } from "@/components/SearchForm";

const NAV_LIENS = [
  { href: "/bourses", label: "Bourses" },
  { href: "/guides", label: "Guides" },
  { href: "/a-propos", label: "À propos" },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-stone-900"
        >
          <span aria-hidden className="text-2xl leading-none">🌍</span>
          Bourses africaines
        </Link>

        <nav
          aria-label="Navigation principale"
          className="order-3 w-full sm:order-2 sm:w-auto"
        >
          <ul className="flex items-center gap-1 text-sm font-medium text-stone-700 sm:gap-4">
            {NAV_LIENS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-lg px-3 py-1.5 transition hover:bg-stone-100 hover:text-stone-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-2 sm:order-3">
          <SearchForm />
        </div>
      </div>
    </header>
  );
}
