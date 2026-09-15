"use client";

import { useMemo, useState } from "react";
import type { TuerenAbcKategorie } from "@/types/content";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function TuerenAbcGlossar({ kategorien }: { kategorien: TuerenAbcKategorie[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kategorien;
    return kategorien
      .map((k) => ({
        ...k,
        begriffe: k.begriffe.filter(
          (b) => b.term.toLowerCase().includes(q) || b.definition.toLowerCase().includes(q),
        ),
      }))
      .filter((k) => k.begriffe.length > 0);
  }, [kategorien, query]);

  const totalMatches = filtered.reduce((sum, k) => sum + k.begriffe.length, 0);

  return (
    <div>
      <label htmlFor="tueren-abc-suche" className="relative block">
        <span className="sr-only">Begriff im Türen-ABC suchen</span>
        <SearchIcon className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4 text-ink-faint" />
        <input
          id="tueren-abc-suche"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Begriff suchen, z. B. „Zarge“ oder „RC2“ …"
          className="w-full rounded-full border border-border bg-paper py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors focus:border-accent"
        />
      </label>

      <nav aria-label="Kategorien" className="sticky top-16 z-10 -mx-4 mt-6 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:border-border sm:px-2 sm:py-1.5">
        <ul className="flex gap-1 text-sm">
          {filtered.map((k) => (
            <li key={k.slug}>
              <a
                href={`#${k.slug}`}
                className="block whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {k.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {query && (
        <p className="mt-4 text-sm text-ink-faint">
          {totalMatches} Treffer für „{query}“
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Keine Begriffe gefunden. Versuch es mit einem anderen Suchwort.
        </p>
      ) : (
        <div className="mt-8 space-y-12">
          {filtered.map((k) => (
            <section key={k.slug} id={k.slug} className="scroll-mt-32">
              <h2 className="text-xl font-semibold text-ink">{k.name}</h2>
              <dl className="mt-4 divide-y divide-border border-t border-border">
                {k.begriffe.map((b) => (
                  <div key={b.slug} id={b.slug} className="group scroll-mt-32 py-4">
                    <dt className="font-semibold text-ink">
                      {b.term}{" "}
                      <a
                        href={`#${b.slug}`}
                        aria-label={`Anker-Link zu ${b.term}`}
                        className="text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
                      >
                        #
                      </a>
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">{b.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
