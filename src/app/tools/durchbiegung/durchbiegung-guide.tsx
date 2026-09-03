import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Maße erfassen",
    body: "Messen Sie die Spannweite (Länge zwischen den Auflagern), die Tiefe und die Dicke des Bodens in Millimetern.",
  },
  {
    title: "Werkstoff wählen",
    body: "Das Elastizitätsmodul (E-Modul) des gewählten Werkstoffs bestimmt maßgeblich die Steifigkeit – wählen Sie aus der Liste oder orientieren Sie sich an der Referenztabelle im Rechner (Profi-Ansicht).",
  },
  {
    title: "Belastungsart und Nutzlast festlegen",
    body: "Flächenlast für gleichmäßig verteiltes Gut (Bücher, Ordner, Geschirr) oder Punktlast für ein schweres Einzelobjekt in der Mitte (z. B. Standfuß, Fernseher). Schätzen Sie die zu erwartende Last in Kilogramm.",
  },
  {
    title: "Anforderung wählen",
    body: "Der Grenzwert (L/200, L/300 oder L/400) legt fest, wie streng der Nachweis ausfällt – je nach Einsatzzweck des Möbelstücks.",
  },
];

const limitTabelle = [
  ["L/200", "Regal / Lager", "Funktional, sichtbare Durchbiegung möglich"],
  ["L/300", "Möbel Standard", "Übliche Anforderung für Schrankböden"],
  ["L/400", "Hochwertig", "Optisch anspruchsvoll, kaum sichtbare Durchbiegung"],
];

const faqs = [
  {
    q: "Was ist das Elastizitätsmodul (E-Modul) und warum ist es wichtig?",
    a: "Das E-Modul beschreibt die Steifigkeit eines Werkstoffs: Je höher der Wert, desto weniger biegt sich ein Bauteil unter gleicher Last durch. Es ist neben der Geometrie (Länge, Tiefe, Dicke) der wichtigste Einflussfaktor auf die Durchbiegung.",
  },
  {
    q: "Flächenlast oder Punktlast – was wähle ich?",
    a: "Flächenlast passt für gleichmäßig verteiltes Gut wie Bücher, Ordner oder Geschirr. Punktlast wählen Sie, wenn eine schwere Einzellast mittig auf dem Boden steht, etwa ein Standfuß oder ein Fernseher – das führt bei gleichem Gewicht zu einer größeren Durchbiegung als eine Flächenlast.",
  },
  {
    q: "Soll ich das Eigengewicht der Platte mitrechnen?",
    a: "Ja, besonders bei langen Spannweiten oder schweren Werkstoffen (Massivholz, HPL, Aluverbund) trägt das Eigengewicht der Platte selbst spürbar zur Gesamtdurchbiegung bei. Der Rechner addiert es automatisch, wenn die Option aktiviert ist.",
  },
  {
    q: "Welchen Grenzwert (L/200, L/300, L/400) soll ich wählen?",
    a: "L/200 eignet sich für rein funktionale Lager- oder Kellerregale, bei denen sichtbare Durchbiegung keine Rolle spielt. L/300 ist der übliche Standard im Möbelbau. L/400 empfiehlt sich für hochwertige, optisch anspruchsvolle Möbelstücke, bei denen selbst eine minimale Durchbiegung auffallen würde.",
  },
  {
    q: "Was tun, wenn die Konstruktion laut Rechner überlastet ist?",
    a: "Der Rechner zeigt in diesem Fall automatisch eine Handlungsempfehlung: die Dicke erhöhen, ein steiferes Material wählen oder die Spannweite durch eine zusätzliche Mittelwange oder Zarge verkürzen.",
  },
];

export function DurchbiegungGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Durchbiegung eines Bodens abschätzen"
        intro="Vier Angaben genügen, um eine belastbare Einschätzung nach Euler-Bernoulli zu erhalten:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection
        title="Grenzwerte im Überblick"
        intro="Der zulässige Durchhang wird als Bruchteil der Spannweite (L) angegeben. Je nach Anspruch gelten unterschiedliche Grenzwerte:"
      >
        <SpecTable columns={["Grenzwert", "Einsatzbereich", "Beschreibung"]} rows={limitTabelle} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
