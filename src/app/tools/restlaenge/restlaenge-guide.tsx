import { FaqAccordion, GuideSection, GuideShell, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Außendurchmesser messen",
    body: "Messen Sie den kompletten Durchmesser der Rolle über die äußerste Lage Kantenband, am besten mit einer Schieblehre oder einem Zollstock quer über die Rolle.",
  },
  {
    title: "Innendurchmesser messen",
    body: "Messen Sie den Durchmesser des Wickelkerns (der Hülse) – also den Leerraum in der Mitte der Rolle ohne Band.",
  },
  {
    title: "Bandstärke ermitteln",
    body: "Die Stärke einer einzelnen Kantenbandlage steht meist auf dem Rollenetikett oder Lieferschein (üblich sind 0,4 mm, 1 mm, 2 mm oder 3 mm). Alternativ mit einer Messschieber-Dickenmessung an einem losen Bandstück prüfen.",
  },
];

const faqs = [
  {
    q: "Wie genau ist die Schätzung?",
    a: "Die Formel geht von einer gleichmäßig dichten Wicklung ohne Luftspalt aus. Reale Rollen weichen davon leicht ab – durch Wickeltoleranzen, Materialdehnung oder unsauber gewickelte Lagen. Für die Praxis (reicht die Rolle noch für X Meter?) ist die Genauigkeit aber völlig ausreichend.",
  },
  {
    q: "Wo finde ich Bandstärke und Ausgangslänge einer neuen Rolle?",
    a: "Beide Angaben stehen normalerweise auf dem Rollenetikett oder im Lieferschein des Herstellers. Wenn das Etikett fehlt, hilft eine Messschieber-Messung der Bandstärke – die Ausgangslänge lässt sich dann mit diesem Rechner aus dem Außendurchmesser der vollen Rolle ermitteln.",
  },
  {
    q: "Welchen Wert trage ich als Innendurchmesser ein?",
    a: "Den Durchmesser des Wickelkerns (der Hülse), auf die das Band aufgerollt ist – nicht die Breite des Kantenbands. Die Kerngröße ist herstellerabhängig, häufig sind es 76 mm oder 100 mm, kann aber variieren.",
  },
  {
    q: "Funktioniert die Formel auch für andere aufgerollte Materialien?",
    a: "Ja. Die Berechnung basiert auf reiner Geometrie (Kreisringfläche geteilt durch die Materialstärke) und funktioniert für jedes gleichmäßig aufgewickelte Bandmaterial mit konstanter Dicke, zum Beispiel auch Umleimer oder Klebeband.",
  },
  {
    q: "Das Ergebnis wirkt unrealistisch (zu hoch, zu niedrig oder negativ) – woran liegt das?",
    a: "Meist wurden Außen- und Innendurchmesser vertauscht oder die Einheit stimmt nicht (mm statt cm oder umgekehrt). Prüfen Sie die Eingaben und nutzen Sie bei Bedarf den Einheiten-Umschalter oben im Rechner.",
  },
];

export function RestlaengeGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Restlänge einer Kantenbandrolle ermitteln"
        intro="Mit drei Messungen an der Rolle liefert der Rechner eine verlässliche Schätzung der verbleibenden Bandlänge:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
