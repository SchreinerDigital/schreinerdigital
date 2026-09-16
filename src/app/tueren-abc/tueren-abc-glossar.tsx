"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

/**
 * Builds a lookup for auto-linking cross-references: any exact, word-bounded
 * occurrence of another term's name inside a definition becomes a jump link
 * to that term's own entry (Wikipedia-style). Matching is case-sensitive
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
        <a
          key={key++}
          href={`#${slug}`}
          className="underline decoration-ink-faint decoration-dotted underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {matchedText}
        </a>,
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
  const [activeKategorie, setActiveKategorie] = useState<string | null>(kategorien[0]?.slug ?? null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const crossRefIndex = useCrossReferenceIndex(kategorien);

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

  // Scrollspy: highlights whichever category section is currently at the top
  // of the viewport in the desktop sidebar. Re-attaches whenever the search
  // filter changes which sections actually exist in the DOM.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        const slug = topMost.target.getAttribute("data-kategorie-slug");
        if (slug) setActiveKategorie(slug);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [filtered]);

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
        Begriffe in den Definitionen sind mit dem jeweiligen Glossareintrag verlinkt.
      </p>

      {/* Mobile / tablet: horizontal category scroller replaces the sidebar below lg. */}
      <nav
        aria-label="Kategorien"
        className="sticky top-16 z-10 -mx-4 mt-6 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur lg:hidden"
      >
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
        <div className="mt-8 lg:grid lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-10">
          {/* Desktop: a persistent table of contents instead of a flat scroll — click any
              category or term to jump straight to it; the active category stays highlighted
              as you scroll (scrollspy). */}
          <nav aria-label="Inhaltsverzeichnis" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-5 overflow-y-auto pb-8 pr-2">
              {filtered.map((k) => (
                <div key={k.slug}>
                  <a
                    href={`#${k.slug}`}
                    className={cn(
                      "block text-sm font-semibold transition-colors",
                      activeKategorie === k.slug ? "text-accent" : "text-ink hover:text-accent",
                    )}
                  >
                    {k.name}
                  </a>
                  <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
                    {k.begriffe.map((b) => (
                      <li key={b.slug}>
                        <a
                          href={`#${b.slug}`}
                          className="block text-sm text-ink-muted transition-colors hover:text-ink"
                        >
                          {b.term}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="min-w-0 space-y-12">
            {filtered.map((k) => (
              <section
                key={k.slug}
                id={k.slug}
                data-kategorie-slug={k.slug}
                ref={(el) => {
                  if (el) sectionRefs.current.set(k.slug, el);
                  else sectionRefs.current.delete(k.slug);
                }}
                className="scroll-mt-32"
              >
                <h2 className="text-xl font-semibold text-ink">{k.name}</h2>
                <dl className="mt-4 divide-y divide-border border-t border-border">
                  {k.begriffe.map((b) => (
                    <div key={b.slug} id={b.slug} className="scroll-mt-32 py-4">
                      <dt className="font-semibold text-ink">{b.term}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {renderDefinition(b.definition, b.slug, crossRefIndex)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
