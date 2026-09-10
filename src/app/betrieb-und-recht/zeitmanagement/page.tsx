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
  title: "Zeitmanagement & Arbeitszeiterfassung",
  description:
    "Warum Arbeitszeiterfassung in Deutschland bereits verpflichtend ist, welche Erfassungsmethoden sich für Werkstätten eignen und wie eine Nachkalkulation die Planung verbessert.",
  alternates: { canonical: "/betrieb-und-recht/zeitmanagement" },
};

const methoden = [
  [
    "Papier-Stundenzettel",
    "Sehr kleine Teams",
    "Kein Aufwand für Software, aber fehleranfällig und mühsam auszuwerten",
  ],
  [
    "App oder Software zur Zeiterfassung",
    "Teams mit mehreren Mitarbeitern, auch auf Baustellen",
    "Ordnet Zeiten direkt Aufträgen zu, auswertbar für Nachkalkulation",
  ],
  [
    "Terminal/Zeiterfassungsuhr",
    "Feste Werkstatt mit regelmäßiger Anwesenheit vor Ort",
    "Schnelle Erfassung per Karte oder Chip, weniger geeignet für Außeneinsätze",
  ],
];

const nachkalkulation = [
  {
    title: "Geplante Stunden je Auftrag festhalten",
    body: "Schon bei der Kalkulation wird dokumentiert, wie viele Stunden für welchen Arbeitsschritt veranschlagt wurden – diese Zahl ist die spätere Vergleichsgrundlage.",
  },
  {
    title: "Tatsächliche Stunden auftragsbezogen erfassen",
    body: "Mitarbeiter buchen ihre Arbeitszeit nicht nur allgemein, sondern je Auftrag – nur so lässt sich später erkennen, wo die Kalkulation gestimmt hat und wo nicht.",
  },
  {
    title: "Abweichungen auswerten",
    body: "Größere Abweichungen zwischen geplanten und tatsächlichen Stunden werden nicht nur festgestellt, sondern auf ihre Ursache hin geprüft – lag es an der Kalkulation selbst, an einem unerwarteten Mehraufwand oder an der Auftragsabwicklung?",
  },
  {
    title: "Erkenntnisse in künftige Kalkulationen einfließen lassen",
    body: "Wiederkehrende Abweichungen bei bestimmten Arbeitsschritten (z. B. Oberflächenbehandlung dauert regelmäßig länger als kalkuliert) fließen in die nächste Kalkulation ein, statt denselben Fehler erneut zu machen.",
  },
];

const faqs = [
  {
    q: "Muss ich als kleiner Handwerksbetrieb die Arbeitszeit meiner Mitarbeiter erfassen?",
    a: "Das Bundesarbeitsgericht hat mit Beschluss vom 13. September 2022 entschieden, dass sich aus dem Arbeitsschutzgesetz bereits jetzt eine Pflicht zur Arbeitszeiterfassung ergibt – unabhängig von der Betriebsgröße. Eine eigenständige gesetzliche Neuregelung im Arbeitszeitgesetz, die Einzelheiten der technischen Umsetzung und mögliche Erleichterungen für Kleinbetriebe konkret festlegt, war zum Zeitpunkt dieser Recherche noch nicht final beschlossen. Bis dahin gilt die aus der Rechtsprechung abgeleitete Pflicht.",
  },
  {
    q: "Reicht eine formlose Selbstaufschreibung der Mitarbeiter aus?",
    a: "Nach aktuellem Diskussionsstand ja, solange Beginn, Ende und Dauer der täglichen Arbeitszeit objektiv, verlässlich und zugänglich dokumentiert werden. Eine bestimmte Software oder Hardware schreibt die Rechtsprechung bislang nicht zwingend vor – wichtig ist, dass die Erfassung tatsächlich und nicht nur auf dem Papier stattfindet.",
  },
  {
    q: "Was bringt eine Nachkalkulation über die reine Pflicht zur Zeiterfassung hinaus?",
    a: "Erfasste Stunden lassen sich nicht nur für den Arbeitsschutz, sondern auch betriebswirtschaftlich nutzen: Der Vergleich von geplanten und tatsächlichen Stunden je Auftrag deckt auf, welche Kalkulationsannahmen in der Praxis nicht zutreffen, und verbessert damit die Genauigkeit künftiger Angebote.",
  },
];

export default function ZeitmanagementPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Zeitmanagement &amp; Arbeitszeiterfassung</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Erfasste Arbeitszeit ist nicht nur eine rechtliche Pflicht, sondern
          auch die Grundlage für eine realistische Kalkulation künftiger
          Aufträge.
        </p>
      </div>

      <GuideShell>
        <GuideSection title="Die rechtliche Ausgangslage">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Der Europäische Gerichtshof stellte 2019 klar, dass
            EU-Mitgliedstaaten Arbeitgeber zur Einführung eines Systems zur
            Messung der täglichen Arbeitszeit verpflichten müssen. Das
            Bundesarbeitsgericht leitete daraus mit Beschluss vom 13.
            September 2022 (1 ABR 22/21) ab, dass eine entsprechende Pflicht
            in Deutschland bereits aus dem geltenden Arbeitsschutzgesetz
            besteht – auch ohne eine ausdrückliche Neuregelung im
            Arbeitszeitgesetz. Eine solche gesetzliche Konkretisierung, die
            unter anderem die technische Umsetzung und mögliche Ausnahmen
            regeln soll, befand sich zum Zeitpunkt dieser Recherche noch im
            Gesetzgebungsverfahren.
          </p>
        </GuideSection>

        <GuideSection
          title="Erfassungsmethoden im Vergleich"
          intro="Welche Methode passt, hängt von Teamgröße und Arbeitsort ab:"
        >
          <SpecTable columns={["Methode", "Passt zu", "Eigenschaften"]} rows={methoden} />
        </GuideSection>

        <GuideSection
          title="Nachkalkulation: Aus erfassten Stunden lernen"
          intro="Erfasste Arbeitszeit lässt sich über die reine Pflichterfüllung hinaus für die eigene Kalkulation nutzen:"
        >
          <StepList steps={nachkalkulation} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie erfasste Stunden in die Angebotskalkulation einfließen,
            zeigt die{" "}
            <Link href="/digitalisierung/auftragskalkulation" className="text-accent hover:underline">
              Auftragskalkulation
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Rechtsberatung im Einzelfall. Für
        eine verbindliche Einschätzung zu deinem Betrieb wende dich an eine
        arbeitsrechtliche Beratung.
      </p>
    </Container>
  );
}
