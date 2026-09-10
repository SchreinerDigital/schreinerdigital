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
  title: "Qualitätsmanagement in der Schreinerei",
  description:
    "Wareneingangs-, Zwischen- und Endkontrolle als einfaches Qualitätsmanagement für Schreinereien – und wann sich eine ISO-9001-Zertifizierung überhaupt lohnt.",
  alternates: { canonical: "/betrieb-und-recht/qualitaetsmanagement" },
};

const kontrollen = [
  [
    "Wareneingang",
    "Angelieferte Platten, Beschläge, Oberflächenmaterial",
    "Maße, Menge, sichtbare Schäden, richtige Ausführung",
  ],
  [
    "Zwischenkontrolle",
    "Halbfertige Bauteile vor dem nächsten Fertigungsschritt",
    "Passgenauigkeit, Oberflächenqualität, Maßhaltigkeit",
  ],
  [
    "Endkontrolle",
    "Fertiges Werkstück vor Auslieferung oder Montage",
    "Vollständigkeit, Funktion (z. B. Beschläge), optischer Zustand",
  ],
];

const reklamationsSchritte = [
  {
    title: "Reklamation vollständig aufnehmen",
    body: "Was genau wird bemängelt, seit wann, unter welchen Bedingungen aufgefallen? Am besten mit Fotos und einem Vor-Ort-Termin dokumentiert, statt nur telefonisch zu klären.",
  },
  {
    title: "Ursache einordnen",
    body: "Liegt ein Material-, Verarbeitungs- oder Planungsfehler vor, oder handelt es sich um eine nutzungsbedingte Erscheinung (z. B. jahreszeitliche Fugenbildung durch Holzbewegung)? Diese Einordnung entscheidet über das weitere Vorgehen.",
  },
  {
    title: "Lösung anbieten und Frist setzen",
    body: "Bei einem berechtigten Mangel wird eine Nacherfüllung (Reparatur oder Neuanfertigung) mit realistischem Termin angeboten – Details zu Fristen und Rechten regelt die Gewährleistung.",
  },
  {
    title: "Ursache für künftige Aufträge auswerten",
    body: "Ein wiederkehrender Reklamationsgrund (z. B. immer dieselbe Beschlagserie) ist ein Signal, den betroffenen Arbeitsschritt oder Lieferanten grundsätzlich zu überprüfen, statt jeden Fall isoliert zu behandeln.",
  },
];

const faqs = [
  {
    q: "Brauche ich als Schreinerei eine ISO-9001-Zertifizierung?",
    a: "Gesetzlich vorgeschrieben ist ISO 9001 für Handwerksbetriebe nicht. Sie wird vor allem dann relevant, wenn industrielle Auftraggeber oder öffentliche Ausschreibungen sie als Voraussetzung verlangen. Für die meisten Schreinereien im Endkundengeschäft reicht ein informell, aber konsequent gelebtes Qualitätsmanagement ohne förmliche Zertifizierung aus.",
  },
  {
    q: "Was bringt dokumentiertes Qualitätsmanagement, wenn keine Zertifizierung verlangt wird?",
    a: "Auch ohne Zertifikat hilft eine feste Routine bei Kontrollen, Reklamationsursachen systematisch nachzuvollziehen statt sie zu vergessen, wiederkehrende Fehlerquellen frühzeitig zu erkennen und im Streitfall den eigenen Sorgfaltsnachweis zu erleichtern.",
  },
  {
    q: "Wie viel Kontrolle ist sinnvoll, ohne die Fertigung unnötig zu verlangsamen?",
    a: "Kontrollen sollten dort ansetzen, wo Fehler am günstigsten zu beheben sind – ein falsch zugeschnittenes Teil lässt sich vor der Kantenbearbeitung leichter korrigieren als nach der fertigen Montage. Eine kurze Sichtkontrolle an wenigen entscheidenden Punkten ist meist wirksamer als eine lückenlose, aber zeitaufwendige Prüfung jedes einzelnen Arbeitsschritts.",
  },
];

export default function QualitaetsmanagementPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Qualitätsmanagement in der Schreinerei</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Qualität entsteht nicht erst bei der Endkontrolle, sondern an
          mehreren Punkten im Fertigungsprozess – meist reichen dafür feste
          Routinen, keine aufwendige Zertifizierung.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Drei Kontrollpunkte im Fertigungsprozess"
          intro="Konsequente Kontrolle an wenigen, aber entscheidenden Stellen fängt die meisten Fehler ab, bevor sie teuer werden:"
        >
          <SpecTable columns={["Kontrollpunkt", "Prüfgegenstand", "Worauf geachtet wird"]} rows={kontrollen} />
        </GuideSection>

        <GuideSection
          title="Reklamationen strukturiert bearbeiten"
          intro="Auch bei sorgfältiger Kontrolle lässt sich eine Reklamation nie ganz ausschließen – wichtig ist der professionelle Umgang damit:"
        >
          <StepList steps={reklamationsSchritte} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Welche Fristen und Rechte bei einem berechtigten Mangel gelten,
            erklärt{" "}
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
