import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { cn } from "@/lib/cn";
import {
  VORLAGEN_KATEGORIEN,
  vorlagen,
  vorlagenPakete,
  type VorlageKategorie,
} from "@/components/downloads/vorlagen.config";

export const metadata: Metadata = {
  title: "Vorlagen & Downloads",
  description:
    "Fertig gestaltete Vorlagen für den Werkstattalltag – als Komplett-Paket oder einzeln nach Kategorie: Arbeitsvorbereitung, Zeit- und Ressourcenplanung, Produktionsvorbereitung, Qualitätskontrolle, Kommunikation und Firmenorganisation. Kauf startet in Kürze.",
  alternates: { canonical: "/vorlagen" },
};

const komplettPaket = vorlagenPakete.find((p) => !p.kategorie)!;
const kategoriePakete = vorlagenPakete.filter((p) => p.kategorie);

const kategorieIntro: Record<VorlageKategorie, string> = {
  Arbeitsvorbereitung:
    "Vom ersten Kundenkontakt bis zur Vorbereitung des Werkstatt- oder Montagetermins.",
  "Zeit & Ressourcenplanung":
    "Arbeitszeit, Termine und Materialverbrauch je Auftrag im Blick behalten.",
  Produktionsvorbereitung:
    "Bauteile für den Zuschnitt sauber vorbereiten und dokumentieren.",
  Qualitätskontrolle:
    "Arbeiten auf der Baustelle nachvollziehbar dokumentieren.",
  "Kommunikation & Verwaltung":
    "Kundengespräche und -korrespondenz professionell und einheitlich führen.",
  Firmenorganisation:
    "Interne Abstimmung im Team strukturiert festhalten.",
};

export default function VorlagenPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Downloads</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Vorlagen &amp; Downloads</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Auftragszettel, Angebotsvorlage, Zeiterfassung und weitere Vorlagen
        für die Werkstatt – als Komplett-Paket oder einzeln nach Kategorie,
        jeweils als PDF zum Ausdrucken und als editierbare Word- oder
        Excel-Datei zum Anpassen.
      </p>

      {/* Benachrichtigung statt Kauf-Button */}
      <div className="mt-10 max-w-lg rounded-[var(--radius)] border border-accent bg-accent-soft/20 p-6">
        <h2 className="text-lg font-medium text-ink">
          Der Kauf ist noch nicht freigeschaltet
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Unten siehst du schon, welche Pakete es geben wird. Lass dich per
          E-Mail benachrichtigen, sobald du sie tatsächlich kaufen kannst.
        </p>
        <NewsletterForm source="vorlagen" submitLabel="Benachrichtige mich" className="mt-5" />
      </div>

      {/* Pakete */}
      <div className="mt-16">
        <h2 className="text-2xl">Pakete</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Alles in einem Paket oder gezielt die Kategorie, die für deinen
          Betrieb am meisten bringt.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className={cn(
              "flex h-full flex-col rounded-[var(--radius)] border p-6 sm:col-span-2",
              "relative z-10 border-2 border-accent bg-accent-soft/40 shadow-xl shadow-accent/15",
            )}
          >
            <Badge tone="accent" className="mb-3 self-start">
              Beliebteste Wahl
            </Badge>
            <h3 className="text-xl">{komplettPaket.titel}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{komplettPaket.beschreibung}</p>
            <p className="mt-4 flex-1 text-sm text-ink-muted">
              Enthält alle {vorlagen.length} Vorlagen aus allen sechs
              Kategorien.
            </p>
          </div>

          {kategoriePakete.map((p) => (
            <div
              key={p.slug}
              className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6"
            >
              <h3 className="text-lg">{p.titel}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-muted">{p.beschreibung}</p>
              <span className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
                {vorlagen.filter((v) => v.kategorie === p.kategorie).length} Vorlagen
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kategorien im Detail */}
      <div className="mt-16 space-y-14">
        {VORLAGEN_KATEGORIEN.map((kat) => {
          const items = vorlagen.filter((v) => v.kategorie === kat);
          if (items.length === 0) return null;
          return (
            <section key={kat}>
              <h2 className="text-2xl">{kat}</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">{kategorieIntro[kat]}</p>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((v) => (
                  <li
                    key={v.slug}
                    className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="min-w-0 break-words text-lg">{v.title}</h3>
                      <Badge>{v.format}</Badge>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-ink-muted">{v.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
