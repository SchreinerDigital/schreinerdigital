"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/container";
import { openConsentSettings } from "@/lib/consent";

const columns = [
  {
    title: "Inhalte",
    links: [
      { href: "/holzarten", label: "Holzarten" },
      { href: "/plattenwerkstoffe", label: "Plattenwerkstoffe" },
      { href: "/verbindungstechnik", label: "Verbindungstechnik" },
      { href: "/beschlaege", label: "Beschläge" },
      { href: "/oberflaechen", label: "Oberflächen" },
    ],
  },
  {
    title: "Rechner",
    links: [
      { href: "/tools/plattengewicht", label: "Plattengewicht" },
      { href: "/tools/tuerenmass", label: "Türenmaß" },
      { href: "/tools/restlaenge", label: "Restlänge" },
      { href: "/tools/durchbiegung", label: "Durchbiegung" },
      { href: "/tools/stundensatz", label: "Stundensatz" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div aria-hidden className="h-2 w-full ruler-ticks-lg opacity-70" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Wordmark className="text-[1.15rem]" />
          <p className="mt-4 text-sm text-ink-muted">
            Materialkunde und Rechner-Tools für die Schreinerei – klar,
            fundiert, werkstatttauglich.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {col.title === "Rechtliches" && (
                <li>
                  <button
                    type="button"
                    onClick={openConsentSettings}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    Cookie-Einstellungen
                  </button>
                </li>
              )}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-1 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} schreiner.digital</p>
          <p>Alle Rechner kostenlos &amp; ohne Anmeldung.</p>
        </Container>
      </div>
    </footer>
  );
}
