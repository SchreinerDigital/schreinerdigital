import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  StepList,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Digitalisierung im Schreinerhandwerk",
  description:
    "Wie du Aufmaß, Kalkulation und Planung in deiner Schreinerei Schritt für Schritt digitalisierst – mit welchem Bereich du anfängst und worauf du bei der Software-Auswahl achten solltest.",
  alternates: { canonical: "/digitalisierung" },
};

const reihenfolge = [
  {
    title: "1. Aufmaß & Kommunikation vor Ort",
    body: "Der kleinste Umstieg mit dem schnellsten Nutzen: Eine Aufmaß-App zum vorhandenen Lasermessgerät ersetzt Notizzettel und Handskizzen, ohne dass sich sonst etwas im Betrieb ändert. Guter Einstieg, um Berührungsängste im Team abzubauen.",
  },
  {
    title: "2. Kalkulation & Auftragsabwicklung",
    body: "Angebot, Auftrag, Aufmaß und Rechnung an einem Ort statt in einzelnen Excel-Tabellen und Word-Vorlagen. Hier steckt für die meisten Betriebe der größte Zeitgewinn – gleichzeitig betrifft der Wechsel mehrere Personen im Büro, deshalb lohnt sich eine sorgfältige Auswahl mit Testphase.",
  },
  {
    title: "3. Planung & Konstruktion (CAD/CAM)",
    body: "Der größte Schritt: Ein CAD-Wechsel betrifft die Konstruktion selbst und im besten Fall auch die CNC-Anbindung. Plane hierfür die meiste Zeit ein und prüfe vorab, ob eine Schnittstelle zu deiner Kalkulationssoftware besteht.",
  },
];

const checkliste = [
  "Cloud oder lokal: Cloud-Software läuft ortsunabhängig ohne eigenen Server, lokale Programme geben dir mehr Kontrolle über die eigenen Daten.",
  "Schnittstellen prüfen: Passt die neue Software zu dem, was du schon nutzt – etwa CAD zu Kalkulation oder Aufmaß-App zu Auftragssoftware?",
  "Mit echten Projektdaten testen: Eine kostenlose Testphase ist am aussagekräftigsten mit einem aktuellen Projekt aus deinem eigenen Betrieb, nicht mit dem Demo-Beispiel des Anbieters.",
  "Team einbinden: Die Software nutzt am Ende nicht du allein – wer täglich damit arbeitet, sollte bei der Auswahl mitreden.",
];

const faqs = [
  {
    q: "Muss ich alle drei Bereiche gleichzeitig umstellen?",
    a: "Nein, im Gegenteil: Ein Bereich nach dem anderen lässt sich in Ruhe einführen und im Alltag einspielen, bevor der nächste Wechsel ansteht. Die vorgeschlagene Reihenfolge – Aufmaß, dann Kalkulation, dann CAD/CAM – orientiert sich am jeweiligen Umstellungsaufwand.",
  },
  {
    q: "Lohnt sich Digitalisierung auch für einen Ein-Mann-Betrieb?",
    a: "Ja. Gerade wenn eine Person Aufmaß, Kalkulation und Fertigung allein stemmt, sparen digitale Werkzeuge Zeit, die sonst für doppelte Dateneingabe draufgeht – oft schon mit den kostenlosen oder günstigen Einstiegsvarianten der vorgestellten Programme.",
  },
];

const themenGruppen = [
  {
    titel: "Aufmaß & Angebotserstellung",
    items: [
      {
        href: "/digitalisierung/aufmass-apps",
        titel: "Digitale Aufmaß-Apps",
        text: "Laser-Messgeräte mit App-Anbindung im Vergleich.",
      },
      {
        href: "/digitalisierung/aufmass-angebotserstellung",
        titel: "Aufmaß & Angebotserstellung",
        text: "Vom Aufmaß vor Ort zum rechtssicheren Angebot.",
      },
    ],
  },
  {
    titel: "Kalkulation & Planung",
    items: [
      {
        href: "/digitalisierung/kalkulationssoftware",
        titel: "Kalkulations- & Auftragssoftware",
        text: "Von der Angebotserstellung bis zur Rechnung.",
      },
      {
        href: "/digitalisierung/auftragskalkulation",
        titel: "Auftragskalkulation",
        text: "Zuschlagskalkulation Schritt für Schritt mit Rechenbeispiel.",
      },
      {
        href: "/digitalisierung/projektplanung",
        titel: "Projektplanung",
        text: "Excel, Gantt-Tools oder integrierte Software – was wann passt.",
      },
      {
        href: "/digitalisierung/fertigungsprozesse-optimieren",
        titel: "Fertigungsprozesse optimieren",
        text: "Engpässe erkennen und den Werkstattdurchlauf verbessern.",
      },
    ],
  },
  {
    titel: "CAD/CAM & Fertigung",
    items: [
      {
        href: "/digitalisierung/cad-cam-software",
        titel: "CAD/CAM-Software",
        text: "3D-Planung und CNC-Anbindung im Vergleich.",
      },
      {
        href: "/digitalisierung/cad-cam-einfuehrung",
        titel: "CAD/CAM-Einführung",
        text: "Der Workflow von der Konstruktion bis zum CNC-Programm.",
      },
      {
        href: "/digitalisierung/stuecklisten-cnc-ausgabe",
        titel: "Stücklisten & CNC-Ausgabe",
        text: "Wie Material-, Zuschnitt- und Beschlaglisten automatisch entstehen.",
      },
      {
        href: "/digitalisierung/schnittstellen-cad-erp-cnc",
        titel: "Schnittstellen: CAD, ERP, CNC",
        text: "Warum drei Softwarewelten nicht von selbst zusammenarbeiten.",
      },
    ],
  },
  {
    titel: "Digitale Infrastruktur",
    items: [
      {
        href: "/digitalisierung/e-rechnung",
        titel: "E-Rechnungspflicht",
        text: "Was seit 2025 im Geschäftsverkehr zwischen Unternehmen gilt.",
      },
      {
        href: "/digitalisierung/cloud-tools-dateiverwaltung",
        titel: "Cloud-Tools & Dateiverwaltung",
        text: "Cloud-Speicher versus lokaler Server für Konstruktionsdaten.",
      },
      {
        href: "/digitalisierung/datenmanagement-backups",
        titel: "Datenmanagement & Backups",
        text: "Die 3-2-1-Regel für verlässliche Datensicherung.",
      },
      {
        href: "/digitalisierung/papierloses-buero",
        titel: "Papierloses Büro",
        text: "Belege digital statt in Papierform verwalten – GoBD-konform.",
      },
    ],
  },
];

export default function DigitalisierungPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Werkzeuge & Software</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Digitalisierung im Schreinerhandwerk</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Software für Planung, Kalkulation und Aufmaß kann den Arbeitsalltag
        in der Schreinerei spürbar entlasten – wenn die Reihenfolge und die
        Auswahl passen. Ein praktischer Einstieg, bevor es in die einzelnen
        Themen geht.
      </p>

      <GuideShell>
        <GuideSection
          title="In welcher Reihenfolge digitalisieren?"
          intro="Es muss nicht alles auf einmal passieren. Diese Reihenfolge hat sich für kleine und mittlere Betriebe bewährt:"
        >
          <StepList steps={reihenfolge} />
        </GuideSection>

        <GuideSection
          title="Bevor du dich für eine Software entscheidest"
          intro="Ein paar Punkte, die sich vor dem Kauf oder Abschluss eines Abos lohnen:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {checkliste.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>
              Cloud-Software und Datenschutz: Bei jeder cloudbasierten
              Lösung brauchst du einen Auftragsverarbeitungsvertrag mit dem
              Anbieter, siehe{" "}
              <Link href="/betrieb-und-recht/datenschutz-dsgvo" className="text-accent hover:underline">
                Datenschutz (DSGVO)
              </Link>
              .
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Die Themen im Detail"
          intro="Vier Bereiche, von der ersten Kundenmessung bis zur digitalen Ablage im Büro:"
        >
          <div className="mt-4 space-y-8">
            {themenGruppen.map((gruppe) => (
              <div key={gruppe.titel}>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {gruppe.titel}
                </h3>
                <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                  {gruppe.items.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5 transition-colors hover:border-accent"
                      >
                        <h4 className="text-base font-semibold text-ink">{a.titel}</h4>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                          {a.text}
                        </p>
                        <span className="mt-4 text-sm font-medium text-accent">
                          Weiterlesen →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
