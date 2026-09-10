import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Optimierung von Fertigungsprozessen",
  description:
    "Rüstzeiten, Durchlaufzeit und Engpässe in der Schreinerwerkstatt erkennen und gezielt verringern – mit und ohne zusätzliche Software.",
  alternates: { canonical: "/digitalisierung/fertigungsprozesse-optimieren" },
};

const stellhebel = [
  [
    "Rüstzeiten",
    "Zeit für Werkzeugwechsel, Maschineneinrichtung und Materialbereitstellung zwischen zwei Aufträgen",
    "Ähnliche Aufträge bündeln, Werkzeuge und Materialien vorbereiten, bevor die Maschine steht",
  ],
  [
    "Durchlaufzeit",
    "Gesamtzeit von Auftragseingang bis Fertigstellung, inklusive Warte- und Liegezeiten",
    "Engpassmaschine identifizieren und deren Auslastung gezielt planen statt nur Einzelschritte zu optimieren",
  ],
  [
    "Wegezeiten",
    "Laufwege zwischen Maschinen, Lager und Materialbereitstellung",
    "Werkstattlayout an die tatsächliche Reihenfolge der Arbeitsschritte anpassen",
  ],
  [
    "Nacharbeit",
    "Zeit für Korrekturen durch Maßfehler, falsche Zuschnitte oder Kommunikationslücken",
    "Digitale Stücklisten und CNC-Ausgabe reduzieren Übertragungsfehler gegenüber handschriftlichen Zetteln",
  ],
];

const faqs = [
  {
    q: "Lohnt sich Prozessoptimierung auch für einen Kleinbetrieb ohne eigene Fertigungsplanung?",
    a: "Ja – schon einfache Maßnahmen wie das Bündeln ähnlicher Zuschnitte oder eine feste Reihenfolge häufiger Arbeitsschritte sparen spürbar Zeit, ganz ohne zusätzliche Software oder Planungsstelle.",
  },
  {
    q: "Was ist der Engpass (Flaschenhals) in einer Fertigung?",
    a: "Die Maschine oder der Arbeitsschritt mit der geringsten Kapazität bestimmt das Tempo der gesamten Fertigung – eine Optimierung an anderer Stelle bringt wenig, solange dieser Engpass nicht entlastet wird.",
  },
  {
    q: "Wie hängen Digitalisierung und Prozessoptimierung zusammen?",
    a: "Digitale Werkzeuge wie CNC-Anbindung, automatische Stücklisten oder Aufmaß-Apps beseitigen häufig genau die Fehlerquellen und Wartezeiten, die eine Prozessanalyse zutage fördert – sie sind daher oft ein naheliegendes Ergebnis, nicht der Ausgangspunkt der Optimierung.",
  },
];

export default function FertigungsprozesseOptimierenPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Optimierung von Fertigungsprozessen</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Nicht jede Zeitersparnis in der Werkstatt braucht neue Maschinen
          oder Software – oft genügt ein genauer Blick auf Rüstzeiten,
          Wegstrecken und wiederkehrende Nacharbeit, um spürbar effizienter
          zu fertigen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Die wichtigsten Stellhebel im Überblick"
          intro="Vier Ansatzpunkte, an denen sich in den meisten Werkstätten ohne große Investition Zeit gewinnen lässt:"
        >
          <SpecTable columns={["Stellhebel", "Was er bedeutet", "Typische Maßnahme"]} rows={stellhebel} />
        </GuideSection>

        <GuideSection
          title="Wo anfangen? Der Engpass zuerst"
          intro="Bevor einzelne Arbeitsschritte optimiert werden, lohnt sich die Frage, welche Maschine oder welcher Arbeitsplatz den Takt des gesamten Betriebs vorgibt."
        >
          <p className="text-sm leading-relaxed text-ink-muted">
            Wird beispielsweise die Formatkreissäge durchgehend ausgelastet,
            während die Kantenanleimmaschine oft leer steht, bringt eine
            schnellere Kantenanleimmaschine wenig – die Säge bleibt der
            limitierende Faktor. Erst wenn der tatsächliche Engpass entlastet
            ist (durch bessere Auftragsreihenfolge, zusätzliche Kapazität
            oder Auslagerung einzelner Schritte), wirkt sich eine Optimierung
            an anderer Stelle überhaupt auf die Gesamtdurchlaufzeit aus.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie eine gute Arbeitsvorbereitung typische Fehlerquellen von
            vornherein vermeidet, zeigt der Artikel{" "}
            <Link href="/betrieb-und-recht/arbeitsvorbereitung" className="text-accent hover:underline">
              Arbeitsvorbereitung Schritt für Schritt
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
