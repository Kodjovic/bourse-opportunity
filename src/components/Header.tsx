"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { SearchForm } from "@/components/SearchForm";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isOpen) {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    // Only open on hover on screens sm and up
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches) {
      setIsOpen(false);
    }
  };

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-stone-900"
        >
          <span aria-hidden className="text-2xl leading-none">🌍</span>
          {SITE_NAME}
        </Link>

        <nav
          aria-label="Navigation principale"
          className="order-3 w-full sm:order-2 sm:w-auto"
        >
          <ul className="flex items-center gap-1 text-sm font-medium text-stone-700 sm:gap-4">
            <li>
              <Link
                href="/bourses"
                className="rounded-lg px-3 py-1.5 transition hover:bg-stone-100 hover:text-stone-900"
              >
                Bourses
              </Link>
            </li>
            
            <li>
              <Link
                href="/actualites"
                className="rounded-lg px-3 py-1.5 transition hover:bg-stone-100 hover:text-stone-900"
              >
                Actualités
              </Link>
            </li>

            <li
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={triggerRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 cursor-pointer"
              >
                Ressources
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-1.5 w-40 rounded-lg border border-stone-200 bg-white py-1 shadow-lg z-50">
                  <Link
                    href="/guides"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition"
                  >
                    Guides
                  </Link>
                  <Link
                    href="/epreuves"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition"
                  >
                    Épreuves
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/a-propos"
                className="rounded-lg px-3 py-1.5 transition hover:bg-stone-100 hover:text-stone-900"
              >
                À propos
              </Link>
            </li>
          </ul>
        </nav>

        <div className="order-2 sm:order-3">
          <SearchForm />
        </div>
      </div>
    </header>
  );
}
