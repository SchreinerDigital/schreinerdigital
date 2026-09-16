"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { TuerenAbcKategorie } from "@/types/content";
import { cn } from "@/lib/cn";

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

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function subscribeToHashChange(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function getHashSnapshot() {
  return window.location.hash.slice(1) || null;
}
function getServerHashSnapshot() {
  return null;
}

/**
 * Builds a lookup for auto-linking cross-references: any exact, word-bounded
 * occurrence of another term's name inside a definition becomes a click
 * target that selects that term (Wikipedia-style). Matching is case-sensitive
 * (German nouns are capitalized) and longest-candidate-first, so e.g.
 * "Türblattaufbau" is preferred over a would-be partial hit on "Türblatt".
 */
function useCrossReferenceIndex(kategorien: TuerenAbcKategorie[]) {
  return useMemo(() => {
    const candidates: { text: string; slug: string }[] = [];
    const seen = new Set<string>();
    for (const k of kategorien) {
      for (const b of k.begriffe) {
        // Drop a trailing parenthetical, e.g. "Rauchschutztür (RS)" -> "Rauchschutztür":
        // definitions elsewhere in the corpus reference the plain-language name, not the abbreviation.
        const candidate = b.term.replace(/\s*\([^)]*\)\s*$/, "").trim();
        const key = candidate.toLowerCase();
        if (candidate.length < 4 || seen.has(key)) continue;
        seen.add(key);
        candidates.push({ text: candidate, slug: b.slug });
      }
    }
    candidates.sort((a, b) => b.text.length - a.text.length);
    if (candidates.length === 0) return { pattern: null, slugByText: new Map<string, string>() };
    const escaped = candidates.map((c) => c.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join("|")})(?![\\p{L}\\p{N}])`, "gu");
    const slugByText = new Map(candidates.map((c) => [c.text.toLowerCase(), c.slug]));
    return { pattern, slugByText };
  }, [kategorien]);
}

function renderDefinition(
  definition: string,
  currentSlug: string,
  index: { pattern: RegExp | null; slugByText: Map<string, string> },
  onSelect: (slug: string) => void,
): ReactNode {
  if (!index.pattern) return definition;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  index.pattern.lastIndex = 0;
  while ((match = index.pattern.exec(definition))) {
    const matchedText = match[1];
    if (match.index > lastIndex) parts.push(definition.slice(lastIndex, match.index));
    const slug = index.slugByText.get(matchedText.toLowerCase());
    if (slug && slug !== currentSlug) {
      parts.push(
        <button
          key={key++}
          type="button"
          onClick={() => onSelect(slug)}
          className="inline border-0 bg-transparent p-0 font-[inherit] text-[inherit] underline decoration-ink-faint decoration-dotted underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {matchedText}
        </button>,
      );
    } else {
      parts.push(matchedText);
    }
    lastIndex = match.index + matchedText.length;
  }
  if (lastIndex < definition.length) parts.push(definition.slice(lastIndex));
  return parts;
}

export function TuerenAbcGlossar({ kategorien }: { kategorien: TuerenAbcKategorie[] }) {
  const [query, setQuery] = useState("");
  const crossRefIndex = useCrossReferenceIndex(kategorien);

  const bySlug = useMemo(() => {
    const map = new Map<
      string,
      { term: string; definition: string; slug: string; kategorieName: string; kategorieSlug: string }
    >();
    for (const k of kategorien) {
      for (const b of k.begriffe) {
        map.set(b.slug, { ...b, kategorieName: k.name, kategorieSlug: k.slug });
      }
    }
    return map;
  }, [kategorien]);

  // Deep-linking: /tueren-abc#slug pre-selects that term (used by the site-wide search index).
  // useSyncExternalStore is the React-sanctioned way to read a browser-only value like the URL
  // hash without a hydration mismatch: it renders `null` (matching the server) on first paint,
  // then swaps in the real hash right after hydration completes, with no console error.
  const urlHash = useSyncExternalStore(subscribeToHashChange, getHashSnapshot, getServerHashSnapshot);
  // undefined = user hasn't clicked anything yet, so defer to the URL hash above.
  // null = user explicitly went back to the overview. A slug = an explicit selection.
  const [clickedSlug, setClickedSlug] = useState<string | null | undefined>(undefined);
  const selectedSlug =
    clickedSlug !== undefined ? clickedSlug : urlHash && bySlug.has(urlHash) ? urlHash : null;

  // Selecting a term collapses the (potentially very long, scrolled-into) index down to one
  // short card, which can otherwise leave the viewport stranded past the end of the page (e.g.
  // in the footer). Bring the new detail card into view, and keep the sidebar's active entry
  // in view too (relevant when the selection changed via an in-definition cross-reference click).
  useEffect(() => {
    if (!selectedSlug) return;
    document.getElementById(selectedSlug)?.scrollIntoView({ block: "start" });
    document.getElementById(`toc-${selectedSlug}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedSlug]);

  function selectTerm(slug: string | null) {
    setClickedSlug(slug);
    window.history.replaceState(null, "", slug ? `#${slug}` : window.location.pathname);
  }

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
  const selected = selectedSlug ? bySlug.get(selectedSlug) : undefined;

  const tocList = (
    <div className="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-8 lg:pr-2">
      {filtered.length === 0 ? (
        <p className="rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-6 text-sm text-ink-muted">
          Keine Begriffe gefunden. Versuch es mit einem anderen Suchwort.
        </p>
      ) : (
        filtered.map((k) => (
          <div key={k.slug}>
            <p
              className={cn(
                "text-sm font-semibold transition-colors",
                selected?.kategorieSlug === k.slug ? "text-accent" : "text-ink",
              )}
            >
              {k.name}
            </p>
            <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
              {k.begriffe.map((b) => (
                <li key={b.slug} id={`toc-${b.slug}`}>
                  <button
                    type="button"
                    onClick={() => selectTerm(b.slug)}
                    className={cn(
                      "block w-full text-left text-sm transition-colors",
                      selectedSlug === b.slug ? "font-semibold text-accent" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {b.term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );

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
      <p className="mt-2.5 text-xs text-ink-faint">
        <span className="underline decoration-ink-faint decoration-dotted underline-offset-4">
          Gepunktet unterstrichene
        </span>{" "}
        Begriffe in den Definitionen springen direkt zum jeweiligen Glossareintrag.
      </p>
      {query && (
        <p className="mt-4 text-sm text-ink-faint">
          {totalMatches} Treffer für „{query}“
        </p>
      )}

      <div className="mt-8 lg:grid lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-10">
        <nav
          aria-label="Inhaltsverzeichnis"
          className={cn(selectedSlug ? "hidden lg:block" : "block")}
        >
          {tocList}
        </nav>

        <div className={cn("min-w-0", selectedSlug ? "block" : "hidden lg:block")}>
          <button
            type="button"
            onClick={() => selectTerm(null)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink lg:hidden"
          >
            <ArrowLeftIcon className="size-4" />
            Zurück zur Übersicht
          </button>

          {!selected ? (
            <div className="hidden rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-center text-sm text-ink-muted lg:block">
              Wähle links einen Begriff aus, um die Definition zu sehen.
            </div>
          ) : (
            <div
              id={selected.slug}
              className="scroll-mt-24 rounded-[var(--radius)] border border-border bg-surface p-6 sm:p-8"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                {selected.kategorieName}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{selected.term}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {renderDefinition(selected.definition, selected.slug, crossRefIndex, selectTerm)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
