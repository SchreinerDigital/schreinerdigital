"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
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

const RESULT_LIMIT = 8;

const noopSubscribe = () => () => {};

/** True only once hydrated on the client – lets us defer `createPortal` past the SSR pass. */
function useIsMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function SiteSearch() {
  const router = useRouter();
  const mounted = useIsMounted();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    triggerRef.current?.focus();
  }, []);

  // Load the index lazily and only once – content only changes on deploy.
  useEffect(() => {
    if (!open || docs) return;
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
  }, [open, docs]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Global Strg/Cmd+K shortcut (from anywhere) and Escape-to-close (regardless
  // of which element inside the modal currently has focus).
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

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

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
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
        close();
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Suche öffnen (Strg+K)"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:text-ink"
      >
        <SearchIcon className="size-4" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 px-4 pt-24 backdrop-blur-sm"
            onClick={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Website durchsuchen"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <SearchIcon className="size-4 shrink-0 text-ink-faint" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Website durchsuchen …"
                  aria-label="Suchbegriff"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Suche schließen"
                  onClick={close}
                  className="shrink-0 text-ink-faint transition-colors hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-1.5">
                {query.trim().length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-ink-faint">
                    Tippe einen Suchbegriff ein – z. B. eine Holzart, ein Rechner oder ein Thema.
                  </p>
                ) : !docs ? (
                  <p className="px-3 py-8 text-center text-sm text-ink-faint">Lade …</p>
                ) : results.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-ink-faint">
                    Keine Ergebnisse für „{query}“.
                  </p>
                ) : (
                  results.map((r, i) => (
                    <Link
                      key={`${r.url}#${r.title}`}
                      href={r.url}
                      onClick={close}
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
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
