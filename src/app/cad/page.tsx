import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { FaqAccordion } from "@/components/tools/guide";
import {
  CATEGORY_LABELS,
  cadFaq,
  cadPakete,
  cadProdukte,
  cadVorteile,
  type CadProdukt,
} from "@/components/downloads/cad.config";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 12C9 8 5 8 5 12s4 4 7 0c3-4 7-4 7 0s-4 4-7 0" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="15" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const vorteileIcons: Record<string, typeof DownloadIcon> = {
  "Sofortiger Download": DownloadIcon,
  "Unbegrenzte Nutzung": InfinityIcon,
  "Individuell anpassbar": SlidersIcon,
};

export const metadata: Metadata = {
  title: "CAD-Vorlagen für Schreiner",
  description:
    "Fertige 2D-Zeichenvorlagen im DWG-Format für die DIN-gerechte Zeichnung: Einbauschrank, Möbelbau und Innenausbau. Kauf startet in Kürze.",
  alternates: { canonical: "/cad" },
};

const kategorien: CadProdukt["kategorie"][] = ["Einbauschrank", "Moebelbau", "Innenausbau"];

const kategorieIntro: Record<CadProdukt["kategorie"], string> = {
  Einbauschrank:
    "Alle Einbauschrank-CAD-Blöcke sind auch im Möbelbau-Paket und im Premium-Paket enthalten – nutze das Einsparpotenzial der Kombi-Pakete.",
  Moebelbau:
    "Alle CAD-Blöcke dieser Kategorie sind im Möbelbau-Paket und im Premium-Paket enthalten.",
  Innenausbau:
    "Alle CAD-Blöcke dieser Kategorie sind im Innenausbau-Paket und im Premium-Paket enthalten.",
};

export default function CadPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Downloads</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">CAD-Vorlagen</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Fertige 2D-Zeichenvorlagen im DWG-Format für deine DIN-gerechte
        Zeichnung – einzelne Vorlagen-Pakete pro Thema oder als
        Komplett-Paket.
      </p>

      {/* eBook-Teaser */}
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface px-5 py-4">
        <Badge>bald</Badge>
        <p className="text-sm text-ink-muted">
          Du kennst dich noch nicht mit CAD-Zeichnen aus? Ein ausführliches,
          leicht verständliches eBook zu den ersten Schritten im
          CAD-Zeichnen ist in Arbeit.
        </p>
      </div>

      {/* Benachrichtigung statt Kauf-Button */}
      <div className="mt-10 max-w-lg rounded-[var(--radius)] border border-accent bg-accent-soft/20 p-6">
        <h2 className="text-lg font-medium text-ink">
          Der Kauf ist noch nicht freigeschaltet
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Unten siehst du schon, welche Vorlagen es geben wird. Lass dich per
          E-Mail benachrichtigen, sobald du sie tatsächlich kaufen kannst.
        </p>
        <NewsletterForm source="cad" submitLabel="Benachrichtige mich" className="mt-5" />
      </div>

      {/* Pakete */}
      <div className="mt-16">
        <h2 className="text-2xl">Komplett-Pakete</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Nutze das Einsparpotenzial der Kombi-Pakete!
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {cadPakete.map((p) => (
            <div
              key={p.slug}
              className={`flex h-full flex-col rounded-[var(--radius)] border p-6 ${
                p.hervorgehoben
                  ? "border-accent bg-accent-soft/20"
                  : "border-border bg-surface"
              }`}
            >
              {p.hervorgehoben && (
                <Badge tone="accent" className="mb-3 self-start">
                  Bestes Angebot
                </Badge>
              )}
              <h3 className="text-lg">{p.titel}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{p.beschreibung}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-muted">
                {p.enthaelt.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-border pt-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                  {p.updateMonate} Monate Updates
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kategorien */}
      <div className="mt-16 space-y-14">
        {kategorien.map((kat) => {
          const alle = cadProdukte.filter((p) => p.kategorie === kat && !p.draft);
          if (alle.length === 0) return null;
          const paket = alle.find((p) => p.istPaketAngebot);
          const einzelteile = alle.filter((p) => !p.istPaketAngebot);
          return (
            <section key={kat}>
              <h2 className="text-2xl">{CATEGORY_LABELS[kat]}</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">{kategorieIntro[kat]}</p>

              {paket && (
                <div className="mt-6 rounded-[var(--radius)] border border-accent bg-accent-soft/20 p-5">
                  <Badge tone="accent">Paket</Badge>
                  <h3 className="mt-2 text-lg">{paket.titel}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{paket.beschreibung}</p>
                </div>
              )}

              {einzelteile.length > 0 && (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {einzelteile.map((p) => (
                    <li
                      key={p.slug}
                      className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5"
                    >
                      <h3 className="text-lg">{p.titel}</h3>
                      <p className="mt-2 flex-1 text-sm text-ink-muted">{p.beschreibung}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Vorteile – bewusst als eigene, umrandete Box statt weiterer Produktkarten,
          damit klar ist: das sind Kaufargumente, keine weiteren Downloads. */}
      <div className="mt-16">
        <h2 className="text-2xl">Vorteile im Überblick</h2>
        <div className="mt-6 grid divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-surface-2/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {cadVorteile.map((v) => {
            const Icon = vorteileIcons[v.titel];
            return (
              <div key={v.titel} className="flex flex-col items-center gap-3 p-6 text-center">
                {Icon && (
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="size-5" />
                  </span>
                )}
                <h3 className="font-medium text-ink">{v.titel}</h3>
                <p className="text-sm text-ink-muted">{v.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl">Häufige Fragen</h2>
        <FaqAccordion items={cadFaq} />
      </div>
    </Container>
  );
}
