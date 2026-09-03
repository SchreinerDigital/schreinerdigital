import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Breite messen",
    body: "Messen Sie den Abstand von der linken bis zur rechten Mauerleibung an drei Stellen: oben, in der Mitte und unten. Das kleinste der drei Maße ist Ihre Rohbaubreite.",
  },
  {
    title: "Höhe messen",
    body: "Messen Sie vom fertigen Fußboden (Oberkante des Teppichs, Parketts oder der Fliesen) bis zur Unterkante des Türsturzes. Messen Sie links und rechts. Das kürzere Maß ist Ihre Rohbauhöhe.",
  },
  {
    title: "Wandstärke messen",
    body: "Messen Sie die Gesamtdicke der Wand an mehreren Stellen. Achten Sie darauf, Putz, Fliesen oder Trockenbau-Verkleidungen mitzumessen. Das größte ermittelte Maß bestimmt die benötigte Zargen-Wandstärke.",
  },
];

const massTabelle = [
  ["635 – 660 mm", "610 mm", "2000 – 2025 mm", "1985 mm"],
  ["760 – 785 mm", "735 mm", "2125 – 2150 mm", "2110 mm"],
  ["885 – 910 mm", "860 mm", "2250 – 2275 mm", "2235 mm"],
  ["1010 – 1035 mm", "985 mm", "—", "—"],
  ["1135 – 1160 mm", "1110 mm", "—", "—"],
  ["1260 – 1285 mm", "1235 mm", "—", "—"],
];

const faqs = [
  {
    q: "Wie messe ich die Maueröffnung (Rohbaumaß) richtig aus?",
    a: "Messen Sie stets die nackte Maueröffnung (ohne alte Zarge). Ermitteln Sie die Breite an mindestens drei Stellen (oben, mitte, unten) und nehmen Sie das schmalste Maß. Die Höhe messen Sie links und rechts von der fertig verlegten Fußbodenoberkante (OFF) bis zur Unterkante des Sturzes – nehmen Sie hier das kürzeste Maß. Die Wandstärke messen Sie an mehreren Stellen inklusive Putz, Fliesen oder Trockenbauwänden und wählen das dickste Maß.",
  },
  {
    q: "Was bedeutet DIN Links und DIN Rechts bei einer Tür?",
    a: "Die Anschlagsrichtung DIN Links oder DIN Rechts legt fest, auf welcher Seite die Scharniere (Bänder) sitzen und in welche Richtung sich die Tür öffnet. Stellen Sie sich vor die geschlossene Tür, und zwar auf die Seite, auf der Sie die Türbänder sehen können (die Tür öffnet sich auf Sie zu). Sind die Scharniere links, ist es eine DIN Links Tür. Sind die Scharniere rechts, ist es eine DIN Rechts Tür.",
  },
  {
    q: "Welchen Spielraum bieten die Standard-Zargen bei der Wandstärke?",
    a: "Moderne Türzargen verfügen über einen sogenannten Zierbekleidungs-Verstellbereich. In der Regel lässt sich die Zarge um ca. -5 mm bis +15 mm verstellen, um Toleranzen in der Wanddicke auszugleichen. Beispielsweise passt eine Standard-Zarge mit dem Nennmaß 145 mm für Wandstärken von 140 mm bis 160 mm.",
  },
  {
    q: "Warum weicht die Empfehlung im Grenzbereich ab?",
    a: "Wenn Ihre gemessenen Maße im „Grenzbereich“ liegen (gelbe Warnung), ist die Montage einer Standardzarge zwar physikalisch möglich, erfordert aber oft zusätzliche Fachkniffe – wie das Einstemmen der Bandtaschen oder das Unterfüttern der Leibung. Bei besonderen Funktionstüren (z. B. Wohnungseingangstüren mit Brand- oder Schallschutz) darf kein Grenzbereich ausgereizt werden, da sonst die Dichtigkeit verloren geht. Hier ist ein Sondermaß Pflicht.",
  },
  {
    q: "Was tun bei roten Ergebnissen (Sondermaß)?",
    a: "Wenn eine Dimension rot markiert ist, liegt das Maß weit außerhalb der DIN 18101 Norm. Sie haben zwei Möglichkeiten: Entweder passen Sie die Maueröffnung baulich an (z. B. Aufdoppeln des Sturzes, Beiputzen der Seiten oder Aufmauern) oder Sie bestellen eine maßgefertigte Tür samt Sonderzarge. Dies ist meist etwas teurer und hat längere Lieferzeiten, sorgt aber für ein perfektes, unkompliziertes Endergebnis.",
  },
];

export function TuerenmassGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Türen & Zargen richtig ausmessen"
        intro="Das korrekte Aufmaß ist der wichtigste Schritt beim Kauf neuer Innentüren. Messen Sie stets das lichte Rohbaumaß (die nackte Maueröffnung) und nicht die alte Tür oder Zarge. Befolgen Sie diese drei Schritte, um Fehlbestellungen zu vermeiden:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection
        title="DIN 18101 Maßtabelle für Standard-Innentüren"
        intro="Die DIN 18101 regelt das Verhältnis zwischen dem lichten Rohbaumaß der Wandöffnung und dem Türblattmaß. Hier sind die gängigsten Normmaße auf einen Blick:"
      >
        <SpecTable
          columns={[
            "Lichte Rohbaubreite (Maueröffnung)",
            "Türblattbreite",
            "Lichte Rohbauhöhe (ab OFF)",
            "Türblatthöhe",
          ]}
          rows={massTabelle}
          note="* Hinweis: Für die Standard-Türblattbreite 860 mm (sehr häufig bei Wohnräumen) muss die Maueröffnung zwischen 885 mm und 910 mm breit sein."
        />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
