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
  title: "Stücklisten & CNC-Ausgabe",
  description:
    "Wie aus einem CAD-Modell automatisch Stücklisten, Zuschnittoptimierung und CNC-Steuerdaten entstehen – und worauf bei der maschinellen Weiterverarbeitung zu achten ist.",
  alternates: { canonical: "/digitalisierung/stuecklisten-cnc-ausgabe" },
};

const formate = [
  ["WOP", "HOMAG/WEEKE-Steuerungen", "Herstellerspezifisches Format für Bohr-, Fräs- und Sägeprogramme"],
  ["MPR", "IMA/Schelling und weitere", "Vergleichbares Maschinenprogrammformat anderer Hersteller"],
  ["DXF/DWG", "Herstellerübergreifend", "Neutrales 2D-Austauschformat, von den meisten CAM-Postprozessoren lesbar"],
  ["CSV/XML", "ERP- und Kalkulationssoftware", "Stücklistenexport für Materialbestellung und Kalkulation außerhalb der CAD-Welt"],
];

const nestingVorteile = [
  {
    q: "Was bringt Nesting gegenüber manuellem Zuschnitt konkret?",
    a: "Eine Nesting-Software verschachtelt alle Bauteile eines oder mehrerer Aufträge automatisch so auf der Rohplatte, dass möglichst wenig Verschnitt entsteht – von Hand ist dieses Optimierungsproblem bei mehr als wenigen Teilen kaum noch überschaubar zu lösen.",
  },
  {
    q: "Wie wird sichergestellt, dass am Ende das richtige Teil in die richtige Baugruppe kommt?",
    a: "Viele Nesting- und CNC-Programme drucken parallel zum Zuschnitt Etiketten oder Barcode-Labels mit Bauteil-, Auftrags- und Positionsnummer, die direkt auf das ausgeschnittene Teil oder eine Begleitkarte geklebt werden.",
  },
  {
    q: "Muss jede Bohrung und Fräsung manuell in der Maschinensoftware eingerichtet werden?",
    a: "Bei einer durchgängigen CAD/CAM-Kette nicht – Bohrbilder, Nuten und Fräsungen werden bereits in der Konstruktion definiert und automatisch in die CNC-Ausgabe übernommen, ohne dass an der Maschine noch einmal von Hand programmiert werden muss.",
  },
];

export default function StuecklistenCncAusgabePage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Stücklisten &amp; CNC-Ausgabe</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Ein durchgängiger digitaler Workflow endet nicht bei der
          Konstruktion: Stücklisten, Zuschnittoptimierung und
          Maschinensteuerdaten lassen sich direkt aus dem CAD-Modell
          ableiten – ohne erneute manuelle Eingabe an der Maschine.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Von der Konstruktion zur Stückliste"
          intro="Jedes Bauteil eines 3D-Modells trägt bereits alle Informationen, die für Material, Zuschnitt und Kalkulation nötig sind:"
        >
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Materialliste:</strong> Werkstoff,
              Dicke, Dekor und Menge je Bauteil, automatisch aus dem Modell
              zusammengefasst.
            </li>
            <li>
              <strong className="text-ink">Zuschnittliste:</strong>{" "}
              Einzelmaße aller Bauteile inklusive Kantenbearbeitung, als
              Grundlage für Formatkreissäge oder Nesting-Maschine.
            </li>
            <li>
              <strong className="text-ink">Beschlagliste:</strong> Benötigte
              Scharniere, Auszüge und Verbinder je Bauteil, oft direkt mit
              Bestellnummern des jeweiligen Herstellers verknüpft.
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Von der Stückliste zur CNC-Maschine"
          intro="Die CAM-Software übersetzt die Bauteildaten in maschinenlesbare Steuerprogramme. Gängige Formate im Überblick:"
        >
          <SpecTable columns={["Format", "Typischer Einsatz", "Beschreibung"]} rows={formate} />
        </GuideSection>

        <GuideSection
          title="Nesting: Materialoptimierung automatisch"
          intro="Fragen, die beim Einstieg in automatisiertes Verschachteln (Nesting) häufig aufkommen:"
        >
          <FaqAccordion items={nestingVorteile} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie das CAD/CAM-Zusammenspiel grundsätzlich abläuft, erklärt die{" "}
            <Link href="/digitalisierung/cad-cam-einfuehrung" className="text-accent hover:underline">
              Einführung in CAD/CAM
            </Link>
            , die Maschine selbst wird im Artikel zum{" "}
            <Link href="/maschinen-werkzeuge/cnc-bearbeitungszentrum" className="text-accent hover:underline">
              CNC-Bearbeitungszentrum
            </Link>{" "}
            beschrieben.
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
