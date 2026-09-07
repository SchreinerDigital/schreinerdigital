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
  title: "Aufbewahrungspflichten für Rechnungen & Belege (GoBD)",
  description:
    "Wie lange Rechnungen, Geschäftsbriefe und Buchungsbelege aufbewahrt werden müssen, was sich seit 2025 geändert hat und was die GoBD für digitale Archivierung vorschreiben.",
  alternates: { canonical: "/betrieb-und-recht/aufbewahrungspflichten-gobd" },
};

const fristen = [
  [
    "Rechnungen, Buchungsbelege, Bücher, Inventare, Jahresabschlüsse",
    "8 Jahre (bis 31.12.2024: 10 Jahre)",
    "§ 257 Abs. 4 HGB, § 147 Abs. 3 AO",
  ],
  [
    "Empfangene und versandte Geschäftsbriefe (z. B. Angebote, Auftragsbestätigungen, Preislisten, Reklamationen, Frachtpapiere)",
    "6 Jahre",
    "§ 257 Abs. 1 Nr. 2 und 3, Abs. 4 HGB",
  ],
];

const scanSteps = [
  {
    title: "Papierbeleg digitalisieren",
    body: "Der Beleg wird vollständig, lesbar und originalgetreu eingescannt – Auflösung und Verfahren müssen den GoBD-Anforderungen genügen.",
  },
  {
    title: "Bildliche Übereinstimmung sicherstellen",
    body: "Das Digitalisat muss inhaltlich exakt dem Original entsprechen, insbesondere bei Belegen mit Bildbestandteilen oder besonderen Merkmalen.",
  },
  {
    title: "Unveränderbar archivieren",
    body: "Das Digitalisat wird in einem System gespeichert, das nachträgliche Änderungen ohne Protokollierung verhindert – ein einfacher Ordner auf dem Bürorechner reicht dafür nicht aus.",
  },
  {
    title: "Papier darf vernichtet werden",
    body: "Ist die Digitalisierung GoBD-konform erfolgt, darfst du den Papierbeleg im Regelfall entsorgen – Ausnahmen gelten für einzelne Dokumente mit besonderer Beweisfunktion, etwa Notarurkunden.",
  },
];

const faqs = [
  {
    q: "Muss ich alte Rechnungen jetzt vorzeitig löschen, weil die Frist auf 8 Jahre verkürzt wurde?",
    a: "Nein, eine Löschpflicht gibt es dadurch nicht – die verkürzte Frist ist eine Erlaubnis, keine Vorschrift. Sie gilt zudem nur für Belege, deren alte 10-Jahres-Frist am 31.12.2024 noch nicht abgelaufen war. Prüfe vor dem Löschen zusätzlich, ob die Unterlagen noch für ein laufendes Verfahren, eine Betriebsprüfung oder aus Gewährleistungsgründen benötigt werden.",
  },
  {
    q: "Zählt ein Angebot oder eine Auftragsbestätigung auch zu den Rechnungen mit 8 Jahren Frist?",
    a: "Nein. Angebote, Auftragsbestätigungen, Preislisten und ähnliche Geschäftsbriefe fallen unter die kürzere 6-Jahres-Frist für Handelsbriefe – nur eigentliche Buchungsbelege wie Rechnungen, Kassenbelege, Bücher und Jahresabschlüsse unterliegen der 8-Jahres-Frist.",
  },
  {
    q: "Reicht es, Rechnungen als PDF-Anhang in einem E-Mail-Postfach zu behalten?",
    a: "Das erfüllt die GoBD-Anforderungen in der Regel nicht. Nötig ist ein System, das die Unveränderbarkeit der Daten sicherstellt, revisionssicher indexiert und für eine Betriebsprüfung maschinell auswertbar ist – ein normales Mailpostfach oder ein frei zugänglicher Ordner leistet das nicht.",
  },
  {
    q: "Was bedeutet das für Rechnungen, die ich als E-Rechnung erhalte?",
    a: "Bei einer E-Rechnung (XRechnung oder ZUGFeRD) muss der ursprüngliche strukturierte Datensatz aufbewahrt werden, nicht nur ein ausgedruckter oder als Bild gespeicherter Ausdruck. Mehr dazu unter E-Rechnungspflicht.",
  },
  {
    q: "Darf das Finanzamt auch auf Daten in einer Cloud-Software zugreifen?",
    a: "Ja. Das Zugriffsrecht der Finanzverwaltung nach § 147 Abs. 6 AO gilt unabhängig davon, ob die Buchführung lokal oder in einer Cloud – auch auf Servern im Ausland – geführt wird. Als Unternehmer musst du sicherstellen, dass der Zugriff im Bedarfsfall möglich ist.",
  },
];

export default function AufbewahrungspflichtenPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Aufbewahrungspflichten & GoBD</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Rechnungen, Angebote und Buchungsunterlagen müssen nicht ewig,
          aber auch nicht beliebig lang aufbewahrt werden – und wer digital
          statt auf Papier archiviert, muss zusätzlich die GoBD beachten.
          Ein Überblick über aktuelle Fristen und die Grundregeln für
          digitale Belege.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Fristen im Überblick"
          intro="Wie lange eine Unterlage aufbewahrt werden muss, hängt davon ab, um welche Art von Dokument es sich handelt:"
        >
          <SpecTable
            columns={["Unterlagenart", "Frist", "Rechtsgrundlage"]}
            rows={fristen}
            note="Angaben ohne Gewähr, Stand der Recherche. Für einzelne Belegarten und Sonderfälle (z. B. Personalunterlagen, Grundstücksverträge) können abweichende Fristen gelten."
          />
        </GuideSection>

        <GuideSection title="Was sich seit 2025 geändert hat">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Mit dem Vierten Bürokratieentlastungsgesetz wurde die
            Aufbewahrungsfrist für Buchungsbelege wie Rechnungen zum 1.
            Januar 2025 von zehn auf acht Jahre verkürzt. Die neue Frist
            gilt für alle Belege, deren alte 10-Jahres-Frist zu diesem
            Stichtag noch nicht abgelaufen war – bereits abgelaufene
            10-Jahres-Fristen leben dadurch nicht wieder auf. Für
            Personen und Gesellschaften unter Aufsicht der BaFin gilt eine
            um ein Jahr verzögerte Umstellung.
          </p>
        </GuideSection>

        <GuideSection
          title="GoBD: Die Grundsätze für digitale Aufbewahrung"
          intro="Wer Belege digital statt auf Papier archiviert, muss zusätzlich die Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form (GoBD) einhalten:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Vollständig, richtig, zeitgerecht:</strong>{" "}
              Belege müssen zeitnah und ohne Lücken erfasst werden.
            </li>
            <li>
              <strong className="text-ink">Geordnet:</strong> Die
              Aufbewahrung muss so strukturiert sein, dass sich einzelne
              Belege in angemessener Zeit wiederfinden lassen.
            </li>
            <li>
              <strong className="text-ink">Unveränderbar:</strong> Einmal
              erfasste Belege dürfen nicht mehr unbemerkt geändert oder
              gelöscht werden – nachträgliche Korrekturen müssen
              nachvollziehbar protokolliert sein.
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Ersetzendes Scannen: Papierbeleg digitalisieren und vernichten"
          intro="Papierbelege müssen nicht zusätzlich zur digitalen Kopie aufgehoben werden, wenn die Digitalisierung GoBD-konform abläuft:"
        >
          <StepList steps={scanSteps} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Steuerberatung im Einzelfall. Für
        eine verbindliche Einschätzung zu deinem Betrieb wende dich an
        deine Steuerberatung.
      </p>
    </Container>
  );
}
