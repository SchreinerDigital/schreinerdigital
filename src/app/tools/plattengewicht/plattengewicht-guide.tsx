import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Maße erfassen",
    body: "Tragen Sie Länge, Breite und Dicke der Platte in Millimetern ein. Bei Zuschnitten immer das fertige (geschnittene) Maß verwenden, nicht das Rohplattenformat.",
  },
  {
    title: "Werkstoff wählen",
    body: "Klicken Sie auf einen der Schnellauswahl-Chips oder tragen Sie die Rohdichte des Materials direkt in kg/m³ ein, falls Ihr Werkstoff nicht in der Liste steht.",
  },
  {
    title: "Stückzahl angeben",
    body: "Bei mehreren gleichen Zuschnitten die Stückzahl erhöhen – praktisch für die Planung von Transport, Hubwagen oder Kranlast.",
  },
];

const dichteTabelle = [
  ["Spanplatte", "650 kg/m³"],
  ["MDF", "750 kg/m³"],
  ["Rohspan P2", "630 kg/m³"],
  ["Multiplex Birke", "680 kg/m³"],
  ["OSB/3", "600 kg/m³"],
  ["Tischlerplatte", "500 kg/m³"],
  ["Eiche massiv", "700 kg/m³"],
  ["Fichte massiv", "470 kg/m³"],
];

const faqs = [
  {
    q: "Was ist die Rohdichte und warum ist sie so wichtig?",
    a: "Die Rohdichte gibt an, wie viel Masse ein Kubikmeter des Werkstoffs bei üblicher Ausgleichsfeuchte (meist 12–15 %) hat. Sie ist der einzige Materialkennwert, den die Berechnung braucht – Gewicht ergibt sich direkt aus Volumen (Länge × Breite × Dicke) mal Rohdichte.",
  },
  {
    q: "Warum weicht das berechnete Gewicht vom tatsächlichen Wiegen ab?",
    a: "Rohdichte ist ein Durchschnittswert. Bei Massivholz schwankt sie je nach Wuchsgebiet, Jahrringbreite und Holzfeuchte spürbar – bei industriell gefertigten Plattenwerkstoffen (Span, MDF, OSB) ist die Toleranz deutlich enger, da die Herstellung genormt ist. Beschichtungen, Kanten oder Lackschichten sind in der Rechnung nicht enthalten.",
  },
  {
    q: "Wie berechne ich das Gewicht einer beschichteten oder mit Kante versehenen Platte?",
    a: "Rechnen Sie die Trägerplatte wie gewohnt und addieren Sie schwere Auflagen separat: Dünne Furniere, HPL- oder Melaminbeschichtungen sind in der Praxis vernachlässigbar leicht. Bei einem massiven Anleimer oder einer dicken Umleimung lohnt sich eine grobe Zusatzrechnung mit dessen eigenen Maßen und Rohdichte.",
  },
  {
    q: "Wofür brauche ich die Gesamtgewicht-Anzeige bei mehreren Stück?",
    a: "Für die Praxis: Traglast von Hubwagen, Kran oder Vakuumheber, zulässige Zuladung des Transporters oder die Anzahl der Platten, die zwei Personen noch sicher heben können.",
  },
  {
    q: "Warum ist die Angabe bei Massivholz ungenauer als bei Plattenwerkstoffen?",
    a: "Massivholz ist ein Naturprodukt – seine Rohdichte hängt von Wuchsort, Alter und Jahrringbreite ab und wird deshalb meist als Spanne angegeben (siehe die Holzarten-Steckbriefe). Plattenwerkstoffe werden dagegen industriell mit engen Dichtetoleranzen gefertigt, ihr Gewicht lässt sich daher genauer vorhersagen.",
  },
];

export function PlattengewichtGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Plattengewicht berechnen"
        intro="Für ein zuverlässiges Ergebnis reichen drei Angaben. So gehen Sie vor:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection
        title="Typische Rohdichten im Überblick"
        intro="Diese Werte sind auch als Schnellauswahl direkt im Rechner hinterlegt und dienen als grobe Orientierung (Angaben bei ca. 12–15 % Holzfeuchte):"
      >
        <SpecTable columns={["Werkstoff", "Rohdichte"]} rows={dichteTabelle} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
