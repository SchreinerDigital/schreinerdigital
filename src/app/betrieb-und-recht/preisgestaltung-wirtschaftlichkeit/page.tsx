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
  title: "Preisgestaltung & Wirtschaftlichkeit",
  description:
    "Kostenorientierte, wettbewerbsorientierte und wertorientierte Preisstrategien für Schreinereien – und wie sich die Wirtschaftlichkeit einzelner Aufträge beurteilen lässt.",
  alternates: { canonical: "/betrieb-und-recht/preisgestaltung-wirtschaftlichkeit" },
};

const strategien = [
  [
    "Kostenorientiert",
    "Selbstkosten plus Gewinnzuschlag",
    "Stellt sicher, dass jeder Auftrag die eigenen Kosten deckt – unabhängig vom Marktumfeld",
  ],
  [
    "Wettbewerbsorientiert",
    "Orientierung an Preisen vergleichbarer Anbieter",
    "Hält Angebote marktüblich, birgt aber das Risiko, unter den eigenen Selbstkosten zu liegen",
  ],
  [
    "Wertorientiert",
    "Orientierung am Nutzen für den Kunden (z. B. Maßanfertigung, Sonderlösung)",
    "Ermöglicht höhere Preise bei echtem Zusatznutzen, erfordert überzeugende Kommunikation dieses Nutzens",
  ],
];

const faqs = [
  {
    q: "Welche Preisstrategie ist für eine Schreinerei die richtige?",
    a: "In der Praxis bewährt sich meist eine Kombination: Die kostenorientierte Kalkulation legt die Preisuntergrenze fest, unter die nie gegangen werden sollte. Wettbewerbs- und Wertorientierung bestimmen dann, wo oberhalb dieser Grenze der tatsächliche Angebotspreis liegt – etwa höher bei einer aufwendigen Sonderanfertigung, näher an der Untergrenze bei einem stark vergleichbaren Standardauftrag.",
  },
  {
    q: "Was ist der Deckungsbeitrag, und wozu wird er gebraucht?",
    a: "Der Deckungsbeitrag ist der Betrag, der nach Abzug der variablen Kosten (z. B. Material, auftragsbezogene Fertigungslöhne) vom Angebotspreis übrig bleibt und zur Deckung der Fixkosten (Miete, Maschinenabschreibung, Verwaltung) sowie als Gewinn zur Verfügung steht. Er zeigt, ob sich ein einzelner Auftrag lohnt, auch wenn er den vollen Gewinnzuschlag der Standardkalkulation nicht erreicht.",
  },
  {
    q: "Wie erkenne ich, ob ein Auftragstyp langfristig wirtschaftlich ist?",
    a: "Ein Vergleich von Nachkalkulation (tatsächlicher Aufwand) und ursprünglicher Kalkulation über mehrere vergleichbare Aufträge hinweg zeigt, ob ein bestimmter Auftragstyp regelmäßig mehr Zeit oder Material braucht als eingepreist. Wiederholt sich das Muster, sollte entweder die Kalkulation dieses Auftragstyps angepasst oder der Auftragstyp seltener angenommen werden.",
  },
];

export default function PreisgestaltungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Preisgestaltung &amp; Wirtschaftlichkeit</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Der über die Zuschlagskalkulation ermittelte Angebotspreis ist der
          Ausgangspunkt – wie er sich strategisch einsetzen lässt und wann
          sich ein Auftrag wirklich lohnt, ist eine zweite, eigene Frage.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Drei Preisstrategien im Vergleich"
          intro="Der kalkulierte Selbstkostenpreis ist nur die Untergrenze – wie viel darüber tatsächlich verlangt wird, hängt von der gewählten Strategie ab:"
        >
          <SpecTable columns={["Strategie", "Ausgangspunkt", "Eigenschaft"]} rows={strategien} />
        </GuideSection>

        <GuideSection title="Wirtschaftlichkeit einzelner Aufträge beurteilen">
          <p className="text-sm leading-relaxed text-ink-muted">
            Nicht jeder angenommene Auftrag ist automatisch wirtschaftlich
            sinnvoll. Ein Auftrag mit knappem Deckungsbeitrag kann sich
            dennoch lohnen, wenn er sonst ungenutzte Kapazität auslastet
            oder als Referenz für Folgeaufträge dient – regelmäßig
            wiederkehrende Aufträge mit dauerhaft knapper Marge binden
            dagegen Kapazität, die an anderer Stelle besser eingesetzt
            wäre.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie sich der Angebotspreis über die Zuschlagskalkulation konkret
            berechnet, zeigt die{" "}
            <Link href="/digitalisierung/auftragskalkulation" className="text-accent hover:underline">
              Auftragskalkulation
            </Link>
            , den eigenen Stundensatz ermittelt der{" "}
            <Link href="/tools/stundensatz" className="text-accent hover:underline">
              Stundensatz-Rechner
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
