"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { cn } from "@/lib/cn";
import type { SearchDoc } from "@/lib/search-index";

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
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const RESULT_LIMIT = 8;

/** Inline search field – filters as you type, results drop down beneath it (no modal/overlay). */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load the index lazily on first focus, only once – content only changes on deploy.
  useEffect(() => {
    if (!focused || docs) return;
    let cancelled = false;
    fetch("/api/search")
      .then((r) => r.json())
      .then((data: SearchDoc[]) => {
        if (cancelled) return;
        setDocs(data);
        setFuse(
          new Fuse(data, {
            keys: [
              { name: "title", weight: 0.5 },
              { name: "keywords", weight: 0.3 },
              { name: "description", weight: 0.15 },
              { name: "category", weight: 0.05 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
          }),
        );
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [focused, docs]);

  // Click outside the field/dropdown hides the dropdown (matches the header's nav-group menus).
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Global Strg/Cmd+K focuses the field from anywhere on the site.
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!fuse || query.trim().length === 0) return [];
    return fuse.search(query, { limit: RESULT_LIMIT }).map((r) => r.item);
  }, [query, fuse]);

  // Reset the highlighted result whenever the query text actually changes
  // (React's "adjust state during render" pattern — no effect needed).
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  function hideDropdown() {
    setFocused(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      hideDropdown();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(target.url);
        setQuery("");
        hideDropdown();
      }
    }
  }

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 transition-colors",
          focused && "border-accent",
        )}
      >
        <SearchIcon className="size-4 shrink-0 text-ink-faint" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          placeholder="Suchen …"
          aria-label="Website durchsuchen"
          className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Suche leeren"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="shrink-0 text-ink-faint transition-colors hover:text-ink"
          >
            <ClearIcon className="size-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-20 mt-2 w-[min(24rem,90vw)] max-h-[70vh] overflow-y-auto rounded-[var(--radius)] border border-border bg-surface p-1.5 shadow-lg"
        >
          {!docs ? (
            <p className="px-3 py-6 text-center text-sm text-ink-faint">Lade …</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-faint">
              Keine Ergebnisse für „{query}“.
            </p>
          ) : (
            results.map((r, i) => (
              <Link
                key={`${r.url}#${r.title}`}
                href={r.url}
                onClick={() => {
                  setQuery("");
                  hideDropdown();
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "block rounded-md px-3 py-2.5",
                  i === activeIndex ? "bg-accent-soft" : "hover:bg-surface-2",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "min-w-0 break-words text-sm font-medium",
                      i === activeIndex ? "text-accent" : "text-ink",
                    )}
                  >
                    {r.title}
                  </span>
                  <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-ink-faint">
                    {r.category}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{r.description}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
