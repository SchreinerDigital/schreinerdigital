import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";
import { MATERIALS_METRIC } from "./materials";

const steps = [
  {
    title: "Material auswählen",
    body: "Wählen Sie aus über 40 hinterlegten Werkstoffen (Metalle, Holzwerkstoffe, Massivhölzer, Kunststoffe, Sonstige) oder tragen Sie über „Freie Eingabe“ eine eigene Rohdichte ein.",
  },
  {
    title: "Form und Einheitensystem festlegen",
    body: "Rechteck (Platte) oder Rundstab, sowie Metrisch (mm/kg) oder Imperial (in/lbs) – die Rohdichte wird beim Umschalten automatisch mit umgerechnet.",
  },
  {
    title: "Maße eintragen und berechnen",
    body: "Bei Rechteck: Länge, Breite und Stärke. Bei Rundstab: Durchmesser und Länge. Anschließend auf „Berechnen“ klicken.",
  },
];

const dichteTabelle = Object.entries(MATERIALS_METRIC).flatMap(([kategorie, materialien]) =>
  Object.entries(materialien).map(([name, dichte]) => [kategorie, name, `${dichte} kg/m³`]),
);

const faqs = [
  {
    q: "Was ist die Rohdichte und warum ist sie so wichtig?",
    a: "Die Rohdichte gibt an, wie viel Masse ein Kubikmeter des Werkstoffs hat. Sie ist der einzige Materialkennwert, den die Berechnung braucht – das Gewicht ergibt sich direkt aus dem Volumen (bei Rechteck: Länge × Breite × Stärke, bei Rundstab: Kreisfläche × Länge) mal Rohdichte.",
  },
  {
    q: "Rechteck oder Rundstab – was ist der Unterschied?",
    a: "Rechteck berechnet das Volumen einer Platte oder eines Balkens (Länge × Breite × Stärke). Rundstab berechnet das Volumen eines zylindrischen Bauteils wie einer Rundholzleiste, Welle oder eines Rohlings aus Durchmesser und Länge.",
  },
  {
    q: "Was passiert, wenn ich die Rohdichte manuell ändere?",
    a: "Der Rechner wechselt automatisch auf „Freie Eingabe“, sobald Sie den Dichtewert von Hand anpassen. So lässt sich das Ergebnis mit einem herstellerspezifischen Wert verfeinern, ohne die Materialliste zu verlassen.",
  },
  {
    q: "Wie funktioniert der Wechsel zwischen Metrisch und Imperial?",
    a: "Beim Umschalten werden sowohl die Maßeinheiten (mm ↔ in) als auch die eingetragene Rohdichte (kg/m³ ↔ lbs/in³) automatisch umgerechnet, sodass keine manuelle Umrechnung nötig ist.",
  },
  {
    q: "Warum weicht das berechnete Gewicht vom tatsächlichen Wiegen ab?",
    a: "Rohdichte ist ein Durchschnittswert. Bei Massivholz schwankt sie je nach Wuchsgebiet und Holzfeuchte, bei Metallen und Kunststoffen kann sie je nach Legierung oder Rezeptur leicht variieren. Für ein genaueres Ergebnis die Rohdichte bei Bedarf manuell anpassen.",
  },
];

export function PlattengewichtGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Gewicht berechnen"
        intro="Drei Angaben reichen für ein zuverlässiges Ergebnis:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection
        title="Hinterlegte Rohdichten im Überblick"
        intro="Diese Werte sind direkt im Rechner als Schnellauswahl hinterlegt (Angaben in kg/m³, Massivholz bei ca. 12–15 % Holzfeuchte):"
      >
        <SpecTable
          columns={["Kategorie", "Werkstoff", "Rohdichte"]}
          rows={dichteTabelle}
          titleColumn={1}
        />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
