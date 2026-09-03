import { FaqAccordion, GuideSection, GuideShell, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Arbeitszeit erfassen",
    body: "Tragen Sie Ihre Wochenarbeitszeit sowie Urlaubs- und Krankheitstage pro Jahr ein – daraus ergeben sich Ihre tatsächlichen Anwesenheitsstunden.",
  },
  {
    title: "Lohn eintragen",
    body: "Wählen Sie Jahresgehalt oder Stundenlohn und tragen Sie den Bruttowert ein.",
  },
  {
    title: "Lohnnebenkosten und Gemeinkosten ergänzen",
    body: "Lohnnebenkosten (Arbeitgeberanteile, Sozialversicherung) als Prozentsatz, Gemeinkosten (Miete, Fahrzeuge, Verwaltung) als Jahressumme.",
  },
  {
    title: "Produktivität, Wagnis und Gewinn festlegen",
    body: "Der Anteil unproduktiver Zeit sowie der Aufschlag für Wagnis und Gewinn bestimmen den finalen Verrechnungssatz.",
  },
];

const faqs = [
  {
    q: "Was zählt zu den Lohnnebenkosten?",
    a: "Dazu zählen die Arbeitgeberanteile zur Sozialversicherung (Renten-, Kranken-, Pflege- und Arbeitslosenversicherung), Beiträge zur Berufsgenossenschaft sowie Rückstellungen für Urlaubs- und Weihnachtsgeld. In Deutschland liegen die Lohnnebenkosten je nach Betriebsgröße meist zwischen 20 % und 40 % des Bruttolohns.",
  },
  {
    q: "Was zählt zu den Gemeinkosten?",
    a: "Alle Kosten, die nicht direkt einem einzelnen Auftrag zugeordnet werden können: Miete, Fahrzeuge, Versicherungen, Verwaltung, Werkzeug- und Maschinenabschreibung, Marketing und ähnliche Fixkosten.",
  },
  {
    q: "Warum ist die produktive Zeit geringer als die Anwesenheitszeit?",
    a: "Rüstzeiten, Wegezeiten, Büroarbeit, Aufräumen und Wartezeiten lassen sich nicht direkt an Kunden weiterberechnen. Im Handwerk sind 20–40 % unproduktive Zeit üblich – dieser Anteil verteilt die Fixkosten auf weniger tatsächlich verrechenbare Stunden.",
  },
  {
    q: "Wie hoch sollte mein Aufschlag für Wagnis und Gewinn sein?",
    a: "Das hängt stark von Betriebsgröße und Risiko ab: Für Einzelunternehmer sind 5–10 % üblich, kleinere Betriebe kalkulieren meist 10–15 %, Spezialgewerke oder Ladenbau auch 18–25 %. Der Rechner zeigt direkt am Regler eine Einordnung an.",
  },
  {
    q: "Warum wird am Ende noch die Mehrwertsteuer aufgeschlagen?",
    a: "Der berechnete Netto-Verrechnungssatz deckt Ihre Kosten und Ihren Gewinn. Gegenüber Kunden wird zusätzlich die gesetzliche Mehrwertsteuer (aktuell 19 %) ausgewiesen – das ist der Bruttopreis, den der Kunde am Ende zahlt.",
  },
];

export function StundensatzGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Schritt-für-Schritt: Stundenverrechnungssatz kalkulieren"
        intro="Der Rechner baut auf vier Blöcken auf – Arbeitszeit, Lohn, Kosten und Aufschlag:"
      >
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}
