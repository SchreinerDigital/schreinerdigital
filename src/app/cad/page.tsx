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
          const items = cadProdukte.filter((p) => p.kategorie === kat && !p.draft);
          if (items.length === 0) return null;
          return (
            <section key={kat}>
              <h2 className="text-2xl">{CATEGORY_LABELS[kat]}</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">{kategorieIntro[kat]}</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <li
                    key={p.slug}
                    className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg">{p.titel}</h3>
                      {p.istPaketAngebot && <Badge>Paket</Badge>}
                    </div>
                    <p className="mt-2 flex-1 text-sm text-ink-muted">{p.beschreibung}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Vorteile */}
      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {cadVorteile.map((v) => (
          <div key={v.titel} className="rounded-[var(--radius)] border border-border bg-surface p-5">
            <h3 className="font-medium text-ink">{v.titel}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{v.text}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl">Häufige Fragen</h2>
        <FaqAccordion items={cadFaq} />
      </div>
    </Container>
  );
}
