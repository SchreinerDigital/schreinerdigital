import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  StepList,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Aufmaß und Angebotserstellung",
  description:
    "Vom Vor-Ort-Termin bis zum verbindlichen Angebot: welche Angaben ein sauberes Aufmaß braucht und was ein Angebot rechtlich enthalten sollte.",
  alternates: { canonical: "/digitalisierung/aufmass-angebotserstellung" },
};

const aufmassSchritte = [
  {
    title: "Raum- und Anschlussmaße erfassen",
    body: "Nicht nur die Breite, sondern auch Raumhöhe, Wandwinkel, Boden- und Deckenunebenheiten sowie vorhandene Anschlüsse (Steckdosen, Heizkörper, Fenstergriffe) dokumentieren – diese Details verhindern spätere Überraschungen beim Einbau.",
  },
  {
    title: "Referenzpunkte fotografieren",
    body: "Fotos mit erkennbarem Maßstab (z. B. Zollstock im Bild) ergänzen die reinen Zahlen und helfen später in der Werkstatt, Kontext ohne erneuten Vor-Ort-Termin nachzuvollziehen.",
  },
  {
    title: "Kundenwünsche und Nutzung festhalten",
    body: "Neben den Maßen auch funktionale Anforderungen notieren: gewünschte Fachaufteilung, Belastung, Öffnungsrichtung – Angaben, die die Konstruktion später genauso prägen wie die reinen Maße.",
  },
  {
    title: "Aufmaß in die Kalkulation überführen",
    body: "Erfasste Maße direkt in die Konstruktions- oder Kalkulationssoftware übertragen, statt sie später aus Notizzetteln erneut abzutippen – hier setzen digitale Aufmaß-Apps an.",
  },
];

const angebotInhalte = [
  "Eindeutige Leistungsbeschreibung: Was genau wird geliefert und montiert, in welcher Ausführung und Qualität?",
  "Maße und Materialangaben, die dem tatsächlichen Aufmaß entsprechen – nicht nur Richtwerte.",
  "Preis mit Angabe, ob netto oder brutto, und ob es sich um ein verbindliches oder freibleibendes Angebot handelt.",
  "Zahlungsbedingungen und – bei größeren Aufträgen üblich – vereinbarte Abschlagszahlungen.",
  "Liefer- beziehungsweise Ausführungstermin oder zumindest ein realistischer Zeitrahmen.",
  "Gültigkeitsdauer des Angebots (ohne Angabe gilt eine angemessene Frist, die im Streitfall auszulegen ist).",
];

const faqs = [
  {
    q: "Was unterscheidet ein verbindliches von einem freibleibenden Angebot?",
    a: "Nach § 145 BGB ist, wer den Abschluss eines Vertrags anträgt, an diesen Antrag gebunden, sobald der Kunde annimmt – es sei denn, die Bindung wurde ausdrücklich ausgeschlossen. Ein Angebot gilt im Zweifel also als verbindlich; nur wer es ausdrücklich als freibleibend kennzeichnet, kann später noch nachverhandeln.",
  },
  {
    q: "Muss ich ein schriftliches Aufmaßprotokoll aufbewahren?",
    a: "Rechtlich zwingend ist das nicht in jedem Fall, praktisch aber sehr zu empfehlen: Bei späteren Unstimmigkeiten über vereinbarte Maße ist ein dokumentiertes, im besten Fall vom Kunden gegengezeichnetes Aufmaß der einfachste Nachweis.",
  },
  {
    q: "Wie genau muss ein Aufmaß sein?",
    a: "Für den Zuschnitt in der Werkstatt reicht am Ende die für das jeweilige Bauteil übliche Fertigungstoleranz. Für die Ersterfassung vor Ort empfiehlt sich dennoch möglichst genaues Messen (Lasermessgerät statt Zollstock), da Rundungsfehler sich bei mehreren Anschlussmaßen sonst aufsummieren können.",
  },
];

export default function AufmassAngebotserstellungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Aufmaß und Angebotserstellung</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Ein sauberes Aufmaß ist die Grundlage für Kalkulation, Konstruktion
          und Fertigung zugleich – und ein vollständiges Angebot schützt vor
          Missverständnissen, bevor der Auftrag überhaupt beginnt.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Aufmaß vor Ort: Worauf es ankommt"
          intro="Ein gutes Aufmaß erfasst mehr als die reinen Endmaße:"
        >
          <StepList steps={aufmassSchritte} />
        </GuideSection>

        <GuideSection
          title="Was ein vollständiges Angebot enthalten sollte"
          intro="Über die reine Preisangabe hinaus gehören diese Punkte in ein Angebot, um spätere Diskussionen zu vermeiden:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {angebotInhalte.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie sich aus dem Aufmaß ein vollständiger Angebotspreis
            errechnet, zeigt der Artikel{" "}
            <Link href="/digitalisierung/auftragskalkulation" className="text-accent hover:underline">
              Auftragskalkulation
            </Link>
            , digitale Messgeräte mit direkter App-Anbindung vergleicht die
            Übersicht{" "}
            <Link href="/digitalisierung/aufmass-apps" className="text-accent hover:underline">
              Aufmaß-Apps
            </Link>
            . Was bei Mängeln nach der Ausführung gilt, erklärt{" "}
            <Link href="/betrieb-und-recht/gewaehrleistung-maengelhaftung" className="text-accent hover:underline">
              Gewährleistung &amp; Mängelhaftung
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
