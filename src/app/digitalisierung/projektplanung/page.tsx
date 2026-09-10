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
  title: "Projektplanung: Excel, Tools und Vorlagen",
  description:
    "Wie sich Termine, Material und Kapazität für Schreinereiaufträge planen lassen – von der einfachen Excel-Tabelle bis zur spezialisierten Planungssoftware.",
  alternates: { canonical: "/digitalisierung/projektplanung" },
};

const ansaetze = [
  [
    "Excel-/Tabellenplan",
    "Wenige parallele Aufträge, überschaubares Team",
    "Kostenlos, sofort einsatzbereit, hoher manueller Pflegeaufwand bei vielen Terminen",
  ],
  [
    "Gantt-Diagramm (Projektmanagement-Tool)",
    "Mehrere Aufträge mit Abhängigkeiten (z. B. Material muss vor Fertigung da sein)",
    "Visualisiert Zeitachsen und Abhängigkeiten übersichtlich, erfordert etwas Einarbeitung",
  ],
  [
    "Integrierte Auftrags-/Kalkulationssoftware",
    "Durchgängige Verwaltung von Angebot bis Rechnung",
    "Ein System für alle Auftragsdaten, meist mit laufenden Kosten verbunden",
  ],
];

const planungsSchritte = [
  "Kapazität realistisch einplanen: Wie viele Fertigungsstunden stehen pro Woche tatsächlich zur Verfügung, abzüglich Wartung, Urlaub und Nebentätigkeiten?",
  "Materiallieferzeiten einrechnen: Sonderbeschläge oder bestimmte Holzarten können Wochen Vorlauf brauchen – diese Zeit muss vor dem Fertigungsstart eingeplant sein.",
  "Pufferzeiten für Nacharbeit und Krankheit vorsehen, statt die Kapazität bis zur letzten Stunde zu verplanen.",
  "Meilensteine mit dem Kunden abstimmen, besonders bei längeren Projekten mit Teilabnahmen oder Zwischenterminen vor Ort.",
];

const faqs = [
  {
    q: "Ab welcher Betriebsgröße lohnt sich eine spezialisierte Planungssoftware?",
    a: "Eine Faustregel gibt es nicht, aber sobald mehrere Personen gleichzeitig an unterschiedlichen Aufträgen arbeiten und Termine sich gegenseitig beeinflussen, wird eine Excel-Tabelle schnell unübersichtlich – dann lohnt sich der Blick auf ein Gantt-Tool oder eine integrierte Auftragssoftware.",
  },
  {
    q: "Wie geht man mit kurzfristigen Terminverschiebungen um?",
    a: "Ein realistischer Zeitplan mit eingebauten Pufferzeiten verkraftet einzelne Verschiebungen ohne Kettenreaktion. Wichtig ist zudem, Verschiebungen zeitnah an alle Beteiligten (Kunden, Lieferanten, Team) zu kommunizieren, statt sie erst kurz vor dem ursprünglichen Termin aufzudecken.",
  },
];

export default function ProjektplanungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Projektplanung: Excel, Tools und Vorlagen</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Ob einfache Tabelle oder spezialisierte Software – gute
          Projektplanung sorgt dafür, dass Material rechtzeitig da ist,
          Kapazitäten realistisch verplant sind und Kunden verlässliche
          Termine bekommen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Planungsansätze im Vergleich"
          intro="Von der einfachen Tabelle bis zur integrierten Software – welcher Ansatz passt, hängt von Auftragszahl und Teamgröße ab:"
        >
          <SpecTable columns={["Ansatz", "Passt zu", "Eigenschaften"]} rows={ansaetze} />
        </GuideSection>

        <GuideSection
          title="Worauf es bei der Terminplanung ankommt"
          intro="Unabhängig vom gewählten Werkzeug entscheiden diese Punkte über realistische statt geschönte Zeitpläne:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {planungsSchritte.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie sich Material- und Zeitbedarf eines Auftrags überhaupt
            beziffern lässt, zeigt die{" "}
            <Link href="/digitalisierung/auftragskalkulation" className="text-accent hover:underline">
              Auftragskalkulation
            </Link>
            , die tägliche Reihenfolge in der Werkstatt selbst behandelt die{" "}
            <Link href="/betrieb-und-recht/arbeitsvorbereitung" className="text-accent hover:underline">
              Arbeitsvorbereitung
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
