"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { tools } from "@/components/tools/tools.config";
import { cn } from "@/lib/cn";

interface NavGroup {
  id: string;
  label: string;
  overviewHref?: string;
  items: { href: string; label: string }[];
}

const navGroups: NavGroup[] = [
  {
    id: "rechner",
    label: "Rechner",
    overviewHref: "/tools",
    items: tools.map((t) => ({ href: `/tools/${t.slug}`, label: t.title })),
  },
  {
    id: "wissen",
    label: "Schreinerwissen",
    items: [
      { href: "/holzarten", label: "Holzarten" },
      { href: "/plattenwerkstoffe", label: "Plattenwerkstoffe" },
    ],
  },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close any open menu whenever the route actually changes (React's
  // "adjusting state on prop change" pattern — no effect needed).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpenGroup(null);
  }

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isGroupActive = (g: NavGroup) =>
    (g.overviewHref && isActive(g.overviewHref)) ||
    g.items.some((item) => isActive(item.href));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 rounded-sm">
          <Wordmark className="text-[1.15rem]" />
          <span className="sr-only">schreiner.digital – Startseite</span>
        </Link>

        <nav ref={navRef} className="hidden items-center gap-1 md:flex">
          {navGroups.map((g) => (
            <div key={g.id} className="relative">
              <button
                type="button"
                aria-expanded={openGroup === g.id}
                aria-haspopup="menu"
                onClick={() => setOpenGroup((v) => (v === g.id ? null : g.id))}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isGroupActive(g) ? "text-accent" : "text-ink-muted hover:text-ink",
                )}
              >
                {g.label}
                <ChevronIcon
                  className={cn(
                    "size-3.5 transition-transform",
                    openGroup === g.id && "rotate-180",
                  )}
                />
              </button>

              {openGroup === g.id && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-10 mt-2 w-56 rounded-[var(--radius)] border border-border bg-surface p-1.5 shadow-lg"
                >
                  {g.overviewHref && (
                    <>
                      <Link
                        href={g.overviewHref}
                        role="menuitem"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2"
                      >
                        Alle {g.label} ansehen
                      </Link>
                      <div className="my-1 border-t border-border" />
                    </>
                  )}
                  {g.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm",
                        isActive(item.href)
                          ? "bg-accent-soft text-accent"
                          : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/tools" size="sm" className="hidden sm:inline-flex">
            Rechner öffnen
          </ButtonLink>
          <button
            type="button"
            aria-label="Menü"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-border bg-paper md:hidden">
          <Container className="flex flex-col py-2">
            {navGroups.map((g) => (
              <details key={g.id} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3 text-sm font-medium",
                    isGroupActive(g) ? "text-accent" : "text-ink-muted",
                  )}
                >
                  {g.label}
                  <ChevronIcon className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col pb-1 pl-3">
                  {g.overviewHref && (
                    <Link
                      href={g.overviewHref}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-2"
                    >
                      Alle {g.label} ansehen
                    </Link>
                  )}
                  {g.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm",
                        isActive(item.href)
                          ? "bg-accent-soft text-accent"
                          : "text-ink-muted hover:bg-surface-2",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
