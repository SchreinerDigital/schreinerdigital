import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Holzart wählen",
    body: "Jede Holzart hat ein eigenes tangentiales und radiales Schwindmaß. Buche oder Hainbuche arbeiten stark, Nussbaum, Teak oder Mahagoni sind vergleichsweise formstabil.",
  },
  {
    title: "Jahrringlage bestimmen",
    body: "Liegende Ringe (Flachschnitt) bewegen sich in der Breite am stärksten, stehende Ringe (Riftschnitt) nur etwa halb so viel. Ein Blick auf die Hirnholzseite des Brettes zeigt den Ringverlauf.",
  },
  {
    title: "Maße erfassen",
    body: "Breite, Dicke und Länge des Bauteils im Ausgangszustand eintragen – in mm, cm oder Zoll.",
  },
  {
    title: "Feuchteänderung einschätzen",
    body: "Ausgangsholzfeuchte (beim Zuschnitt) und Zielholzfeuchte (am späteren Einsatzort) festlegen, entweder frei oder über einen der Klima-Schnellwahl-Werte.",
  },
];

const klimaTabelle = [
  ["Winter, beheizt", "≈ 7 %", "Trockene Heizungsluft im Winter – Holz schwindet maximal."],
  ["Wohnraum, normal", "≈ 9,5 %", "Typisches Raumklima in Wohnräumen im Frühjahr/Herbst."],
  ["Sommer, feucht", "≈ 12,5 %", "Feucht-warme Sommermonate – Holz nimmt Feuchte auf und quillt."],
  ["Außen, überdacht", "≈ 15 %", "Carports, Terrassenüberdachungen, Gartenlauben."],
];

const faqs = [
  {
    q: "Was ist der Fasersättigungspunkt und warum ist er wichtig?",
    a: "Oberhalb des Fasersättigungspunktes (je nach Holzart ca. 26–32 % Holzfeuchte) befindet sich nur noch freies Wasser im Zellhohlraum, das keine Maßänderung mehr bewirkt. Erst wenn die Holzfeuchte darunter sinkt, beginnt das Holz zu schwinden – umgekehrt quillt es beim Anfeuchten nur bis zu diesem Punkt. Der Rechner berücksichtigt das automatisch und kappt die wirksame Feuchteänderung an dieser Grenze.",
  },
  {
    q: "Warum bewegt sich ein Brett mit liegenden Jahrringen stärker als eins mit stehenden?",
    a: "Holz schwindet und quillt in radialer Richtung (quer zu den Jahresringen) typischerweise nur etwa halb so stark wie in tangentialer Richtung (längs der Jahresringe). Bei liegenden Ringen (Flachschnitt) verläuft die Brettbreite tangential – die stärkste Bewegungsrichtung. Bei stehenden Ringen (Riftschnitt) verläuft sie radial und ist dadurch deutlich formstabiler, aber aufwändiger im Zuschnitt.",
  },
  {
    q: "Wie groß sollte eine Dehnungsfuge sein?",
    a: "Als Faustregel gilt: mindestens die berechnete Quellmenge plus 20–30 % Sicherheitsaufschlag, mindestens jedoch 2 mm. Der Rechner gibt diesen Wert direkt im Ergebnis mit aus.",
  },
  {
    q: "Warum bewegt sich Holz in der Länge (Faserrichtung) kaum?",
    a: "Längs der Faser liegt das Schwindmaß bei nur etwa 0,01 % je 1 % Feuchteänderung – rund 20- bis 40-mal weniger als quer zur Faser. Bei den meisten Bauteillängen im Möbelbau ist diese Bewegung praktisch vernachlässigbar.",
  },
  {
    q: "Woher stammen die Rechenwerte?",
    a: "Die Berechnung folgt dem Grundprinzip der DIN 52184 (Prüfung von Holz – Bestimmung der Quellung und Schwindung). Die hinterlegten Schwindmaße je Holzart sind Näherungswerte aus gängigen Holzartentabellen und können je nach Herkunft, Wuchsgebiet und Trocknung leicht abweichen.",
  },
];

export function QuellSchwundGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt für Schritt: Holzbewegung berechnen"
        intro="Vier Angaben genügen für eine belastbare Einschätzung nach DIN 52184:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection
        title="Typische Zielfeuchte je nach Einsatzort"
        intro="Die Ausgleichsfeuchte von Holz richtet sich nach Temperatur und relativer Luftfeuchte am Aufstellort. Diese Richtwerte sind im Rechner als Schnellwahl hinterlegt:"
      >
        <SpecTable columns={["Einsatzort", "Ziel-Holzfeuchte", "Beschreibung"]} rows={klimaTabelle} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
