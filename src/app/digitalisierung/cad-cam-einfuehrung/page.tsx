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
  title: "Einführung in CAD/CAM für Schreiner",
  description:
    "Was CAD und CAM unterscheidet, wie der digitale Workflow vom Entwurf bis zur CNC-Maschine abläuft und welche Dateiformate dabei eine Rolle spielen.",
  alternates: { canonical: "/digitalisierung/cad-cam-einfuehrung" },
};

const workflow = [
  {
    title: "Entwurf und Konstruktion (CAD)",
    body: "Am Computer entsteht das Möbelstück als parametrisches 3D-Modell statt als Handskizze. Änderungen an einem Maß aktualisieren automatisch alle abhängigen Bauteile – ein zentraler Vorteil gegenüber der 2D-Zeichnung.",
  },
  {
    title: "Stücklisten- und Zuschnittgenerierung",
    body: "Aus dem 3D-Modell erzeugt die Software automatisch Stücklisten mit allen Bauteilmaßen, Materialangaben und Kantenbearbeitungen – die Basis für Materialbestellung und Zuschnittoptimierung.",
  },
  {
    title: "CAM: Werkzeugwege festlegen",
    body: "Die CAM-Software (oft in dieselbe Anwendung integriert) übersetzt die Konstruktionsdaten in konkrete Bearbeitungsschritte: welcher Fräser, welche Drehzahl, welche Reihenfolge der Bohrungen und Fräsungen.",
  },
  {
    title: "Postprozessor und Maschinensteuerung",
    body: "Ein maschinenspezifischer Postprozessor übersetzt die CAM-Daten in das Steuerungsformat der jeweiligen CNC-Maschine (z. B. WOP bei HOMAG/WEEKE-Anlagen) – erst hier wird aus der Planung ein tatsächlich abarbeitbares Programm.",
  },
];

const begriffe = [
  ["CAD", "Computer-Aided Design", "Konstruktion und Entwurf am Bildschirm, meist parametrisch in 3D"],
  ["CAM", "Computer-Aided Manufacturing", "Erzeugung der Werkzeugwege und Steuerbefehle für die Fertigung"],
  ["DXF/DWG", "Drawing Exchange/AutoCAD-Format", "Austauschformate für 2D-Zeichnungen, von praktisch jeder CAD-Software lesbar"],
  ["Nesting", "–", "Automatisches Verschachteln mehrerer Bauteile auf einer Rohplatte zur Materialoptimierung"],
  ["Postprozessor", "–", "Übersetzt maschinenneutrale CAM-Daten in das Steuerungsformat einer konkreten CNC-Maschine"],
];

const faqs = [
  {
    q: "Brauche ich CAM, wenn ich keine CNC-Maschine habe?",
    a: "Nein – ohne CNC-Anbindung reicht reine CAD-Software für Konstruktion, Visualisierung und Stücklisten völlig aus. CAM lohnt sich erst, sobald Fräs- oder Bohrarbeiten tatsächlich maschinell nach Programm ablaufen sollen.",
  },
  {
    q: "Ist 2D-CAD für einen Schreinereibetrieb noch zeitgemäß?",
    a: "Für einfache Grundrisse und Werkstattzeichnungen reicht 2D oft aus und ist schnell erlernbar. Sobald jedoch automatische Stücklisten, Kollisionsprüfung oder eine CNC-Anbindung gefragt sind, spielt 3D-CAD seine Stärken aus.",
  },
  {
    q: "Wie lange dauert die Einarbeitung in eine neue CAD/CAM-Software?",
    a: "Grundlegende Bedienung lässt sich meist innerhalb weniger Wochen in Schulungen erlernen; ein wirklich flüssiger, produktiver Workflow mit eigenen Vorlagen und Bauteilbibliotheken entwickelt sich typischerweise über mehrere Monate parallel zum Tagesgeschäft.",
  },
];

export default function CadCamEinfuehrungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Einführung in CAD/CAM für Schreiner</h1>
        <p className="mt-4 text-lg text-ink-muted">
          CAD und CAM verbinden die Möbelplanung direkt mit der Fertigung –
          vom ersten Entwurf bis zum fertigen CNC-Programm. Wer den
          Unterschied und den typischen Ablauf versteht, kann leichter
          entscheiden, wo im eigenen Betrieb der Einstieg sinnvoll ist.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Der digitale Workflow: Vom Entwurf zur Maschine"
          intro="CAD und CAM sind zwei aufeinander aufbauende Schritte, keine austauschbaren Begriffe:"
        >
          <StepList steps={workflow} />
        </GuideSection>

        <GuideSection
          title="Wichtige Begriffe im Überblick"
          intro="Ein kurzes Glossar der Begriffe, die in Produktbeschreibungen und Schulungen immer wieder auftauchen:"
        >
          <SpecTable columns={["Begriff", "Ausgeschrieben", "Bedeutung"]} rows={begriffe} />
        </GuideSection>

        <GuideSection title="Wie geht es nach der Konstruktion weiter?">
          <p className="text-sm leading-relaxed text-ink-muted">
            Aus dem fertigen 3D-Modell lassen sich direkt Stücklisten und
            CNC-Programme ableiten – dazu mehr im Artikel{" "}
            <Link href="/digitalisierung/stuecklisten-cnc-ausgabe" className="text-accent hover:underline">
              Stücklisten &amp; CNC-Ausgabe
            </Link>
            . Welche konkrete Software zu deinem Betrieb passt, zeigt der
            Vergleich der{" "}
            <Link href="/digitalisierung/cad-cam-software" className="text-accent hover:underline">
              CAD/CAM-Programme
            </Link>
            , und wie die Maschine selbst aufgebaut ist, erklärt das{" "}
            <Link href="/maschinen-werkzeuge/cnc-bearbeitungszentrum" className="text-accent hover:underline">
              CNC-Bearbeitungszentrum
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
