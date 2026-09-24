import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Anreißen",
    body: "Schulterlinie mit dem Streichmaß rundherum auf beiden Brettern anreißen (Tiefe = Materialstärke des Gegenbretts, bei halbverdeckten Verbindungen abzüglich des Decksteg-Maßes). Maße immer von der gleichen Anschlagkante aus antragen.",
  },
  {
    title: "Schwalben sägen",
    body: "Mit der Zinkensäge exakt an der Risslinie sägen – immer im Abfallbereich, sodass die Rissline am fertigen Holz stehen bleibt.",
  },
  {
    title: "Übertragen",
    body: "Das fertige Schwalbenbrett bündig auf das Hirnholz des Zinkenbretts stellen und die Konturen mit einem scharfen Anreißmesser spielfrei übertragen.",
  },
  {
    title: "Einstemmen",
    body: "Zwischenräume mit der Laubsäge grob freisägen und mit Stechbeiteln von beiden Seiten bis zur Grundlinie rechtwinklig nachstemmen.",
  },
];

const angleRows = [
  ["1:8 (~7,1°)", "Hartholz", "Eiche, Buche, Nussbaum, Ahorn, Kirsche"],
  ["1:7 (~8,1°)", "Universal", "Gemischte Holzarten, handgesägte Verbindungen"],
  ["1:6 (~9,5°)", "Weichholz", "Kiefer, Fichte, Tanne, Lärche"],
  ["1:4 (14,0°)", "Frässchablone", "Oberfräsen-Zinkenfräser (Festool, Leigh, Porter-Cable)"],
];

const faqs = [
  {
    q: "Offen oder halbverdeckt – welche Verbindung passt wann?",
    a: "Die offene (durchgesteckte) Schwalbenschwanzverbindung zeigt Hirnholz auf beiden Seiten und eignet sich für Kastenkorpusse, Kisten und sichtbare Eckverbindungen. Die halbverdeckte Verbindung lässt einen Decksteg (Front-Lap) stehen, der das Hirnholz der Schwalben von der Sichtseite verdeckt – der Klassiker für Schubladenfronten.",
  },
  {
    q: "Woher weiß ich, wie viele Schwalben ich brauche?",
    a: "Der Rechner schlägt bei aktivierter Automatik eine Anzahl anhand von Brettbreite und -stärke vor (Faustregel: Teilung ≈ 1,4× Materialstärke, mindestens 22 mm). Für eine bewusst gröbere oder feinere Optik lässt sich die Anzahl jederzeit manuell über die Plus/Minus-Steller anpassen.",
  },
  {
    q: "Was bedeutet das Verhältnis Schwalbe zu Zinke?",
    a: "Es legt fest, wie viel breiter die Schwalben (das tragende, sichtbare Element) gegenüber den Zinken (dem schmaleren Gegenstück) sind. Werte um 1,8–2,2 : 1 sind für Möbelbau üblich; ein höheres Verhältnis wirkt dekorativer, verkleinert aber die tragende Fläche der Zinken.",
  },
  {
    q: "Warum werden die Zinken an der Spitze so schmal?",
    a: "Bei steilen Winkeln, dicken Brettern oder wenigen, breiten Schwalben verjüngen sich die Zinken zur Spitze hin stark. Der Rechner warnt automatisch, sobald ein Wert unter die gängige Mindestbreite fällt – reduzieren Sie in diesem Fall die Zinkenanzahl, das Schwalbe-zu-Zinke-Verhältnis oder wählen Sie einen flacheren Winkel.",
  },
  {
    q: "Wie nutze ich die 1:1-Druckschablone?",
    a: "Im Druckdialog unbedingt „Tatsächliche Größe“ bzw. 100 % Skalierung wählen – nicht „An Seite anpassen“. Der aufgedruckte 50-mm-Kontrollbalken lässt sich nach dem Ausdruck mit einem Lineal nachmessen; stimmt er exakt, kann die Schablone direkt aufgeklebt werden.",
  },
];

export function SchwalbenschwanzGuide() {
  return (
    <GuideShell>
      <GuideSection title="Schritt-für-Schritt: Von Hand zinken" intro="Die klassische Reihenfolge „Schwalben zuerst“:">
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection title="Zinkenwinkel nach Holzart" intro="Traditionelle Faustwerte, die der Rechner als Vorlagen anbietet:">
        <SpecTable columns={["Winkel", "Empfehlung für", "Typische Anwendung"]} rows={angleRows} titleColumn={0} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
