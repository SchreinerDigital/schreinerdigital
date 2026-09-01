"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/holzarten", label: "Holzarten" },
  { href: "/plattenwerkstoffe", label: "Plattenwerkstoffe" },
  { href: "/tools", label: "Rechner" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 rounded-sm"
          onClick={() => setOpen(false)}
        >
          <Wordmark className="text-[1.15rem]" />
          <span className="sr-only">schreiner.digital – Startseite</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-accent"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
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
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-paper md:hidden">
          <Container className="flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-accent-soft text-accent"
                    : "text-ink-muted hover:bg-surface-2",
                )}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
