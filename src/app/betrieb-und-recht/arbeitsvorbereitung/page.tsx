import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
  StepList,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Arbeitsvorbereitung in der Werkstatt",
  description:
    "Wie sich Aufträge, Material und Maschinenbelegung so planen lassen, dass die Werkstatt reibungslos läuft – von der Auftragsklärung bis zur Reihenfolgeplanung.",
  alternates: { canonical: "/betrieb-und-recht/arbeitsvorbereitung" },
};

const schritte = [
  {
    title: "Auftrag klären und Konstruktion freigeben",
    body: "Bevor ein Auftrag in die Werkstatt geht, müssen Maße, Materialwahl und Sonderwünsche vollständig geklärt sein – Rückfragen mitten in der Fertigung kosten mehr Zeit als eine gründliche Klärung vorab.",
  },
  {
    title: "Material- und Beschlagverfügbarkeit prüfen",
    body: "Erst wenn feststeht, dass Plattenware, Massivholz und Beschläge rechtzeitig verfügbar sind, wird ein Fertigungstermin zugesagt – Lieferzeiten einzelner Beschläge oder Sonderoberflächen können sonst den gesamten Zeitplan verschieben.",
  },
  {
    title: "Maschinen- und Kapazitätsbelegung einplanen",
    body: "Auf einer Plantafel oder in Software wird sichtbar, welche Maschine wann durch welchen Auftrag belegt ist – so lassen sich Engpässe frühzeitig erkennen, statt sie erst am Fertigungstag zu bemerken.",
  },
  {
    title: "Ähnliche Aufträge bündeln",
    body: "Werden Zuschnitte oder Kantenprogramme ähnlicher Aufträge zusammengefasst, sinkt die Zahl der Rüstvorgänge (Sägeblattwechsel, Kantenmaterial umspulen) – das spart in Summe mehr Zeit als jeder Auftrag einzeln für sich.",
  },
  {
    title: "Reihenfolge und Mitarbeiter zuteilen",
    body: "Zum Schluss steht fest, in welcher Reihenfolge die Aufträge durch die Werkstatt laufen und wer sie bearbeitet – abgestimmt auf Liefertermine, Materialverfügbarkeit und die Auslastung des Teams.",
  },
];

const planungshorizonte = [
  ["Auftragsplanung", "Bei Auftragseingang", "Grobtermin, Materialbedarf, Machbarkeit"],
  ["Wochenplanung", "Wöchentlich", "Reihenfolge, Maschinenbelegung, Mitarbeitereinteilung"],
  ["Tagesplanung", "Täglich", "Feinabstimmung, kurzfristige Änderungen, Vertretungen"],
];

const faqs = [
  {
    q: "Lohnt sich Arbeitsvorbereitung auch für kleine Betriebe mit wenigen Mitarbeitern?",
    a: "Ja – gerade weil in kleinen Teams jede Fehlplanung unmittelbar auf wenige Personen durchschlägt. Schon eine einfache Wochenplanung auf einer Plantafel oder in einer Tabelle verhindert, dass zwei Aufträge gleichzeitig dieselbe Maschine oder denselben Mitarbeiter brauchen.",
  },
  {
    q: "Wie geht man mit kurzfristigen Eilaufträgen um, ohne die gesamte Planung durcheinanderzubringen?",
    a: "Bewährt hat sich, bei der Kapazitätsplanung bewusst nicht bis zur letzten Stunde zu verplanen, sondern einen Puffer für Eilfälle einzurechnen. Ein Eilauftrag verdrängt dann einen bereits eingeplanten, aber weniger dringenden Auftrag – diese Verschiebung sollte aktiv kommuniziert werden, statt sie stillschweigend hinzunehmen.",
  },
  {
    q: "Braucht es dafür spezielle Software, oder reicht eine Excel-Tabelle?",
    a: "Für wenige parallele Aufträge reicht eine gut geführte Tabelle oder eine physische Plantafel völlig aus. Erst wenn mehrere Personen gleichzeitig auf denselben Plan zugreifen müssen oder die Zahl paralleler Aufträge deutlich steigt, zahlt sich spezialisierte Planungssoftware aus.",
  },
];

export default function ArbeitsvorbereitungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Arbeitsvorbereitung in der Werkstatt</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Zwischen Auftragseingang und erstem Sägeschnitt entscheidet sich,
          ob ein Auftrag reibungslos durch die Werkstatt läuft oder an
          fehlendem Material, blockierten Maschinen oder unklaren Details
          hängen bleibt.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Fünf Schritte von der Auftragsklärung bis zur Fertigung"
          intro="Arbeitsvorbereitung (AV) bündelt alle Entscheidungen, die vor dem ersten Fertigungsschritt getroffen sein müssen:"
        >
          <StepList steps={schritte} />
        </GuideSection>

        <GuideSection
          title="Planungshorizonte im Zusammenspiel"
          intro="Arbeitsvorbereitung findet nicht nur einmal, sondern auf mehreren Zeitebenen statt:"
        >
          <SpecTable columns={["Ebene", "Rhythmus", "Inhalt"]} rows={planungshorizonte} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie Termine über mehrere Aufträge hinweg geplant werden, zeigt
            die{" "}
            <Link href="/digitalisierung/projektplanung" className="text-accent hover:underline">
              Projektplanung
            </Link>
            , wie Material rechtzeitig verfügbar ist, die{" "}
            <Link href="/betrieb-und-recht/lagerverwaltung-materialfluss" className="text-accent hover:underline">
              Lagerverwaltung &amp; Materialfluss
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
