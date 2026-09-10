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
  title: "Auftragskalkulation: Material, Zeit und Gemeinkosten",
  description:
    "Wie die Zuschlagskalkulation im Handwerk funktioniert – mit Formel, einer durchgerechneten Beispielkalkulation für einen Möbelauftrag und typischen Stolperfallen.",
  alternates: { canonical: "/digitalisierung/auftragskalkulation" },
};

const schritte = [
  {
    title: "Materialeinzelkosten ermitteln",
    body: "Alle Werkstoffe, Beschläge und Verbrauchsmaterialien für den konkreten Auftrag zu Einkaufspreisen zusammenstellen.",
  },
  {
    title: "Materialgemeinkosten aufschlagen",
    body: "Ein Zuschlag (Materialgemeinkostenzuschlag, MGK) deckt Lager, Verschnitt und Einkaufsverwaltung ab und wird auf die Materialeinzelkosten aufgeschlagen.",
  },
  {
    title: "Fertigungslohn kalkulieren",
    body: "Die geplanten Fertigungsstunden mit dem betrieblichen Stundenverrechnungssatz multiplizieren (siehe Stundensatzrechner).",
  },
  {
    title: "Fertigungsgemeinkosten aufschlagen",
    body: "Ein weiterer Zuschlag (Fertigungsgemeinkosten, FGK) deckt Maschinen, Energie, Miete und nicht direkt zurechenbare Werkstattkosten ab.",
  },
  {
    title: "Selbstkosten und Gewinnzuschlag",
    body: "Materialkosten und Fertigungskosten ergeben zusammen die Selbstkosten. Ein Gewinnzuschlag (üblich: ca. 3–8 %) sichert Reinvestitionen und das unternehmerische Risiko ab – der Angebotspreis ergibt sich als Selbstkosten plus Gewinnzuschlag.",
  },
];

const beispiel = [
  ["Materialeinzelkosten (Holz, Beschläge)", "1.200,00 €"],
  ["+ Materialgemeinkostenzuschlag (15 %)", "180,00 €"],
  ["= Materialkosten", "1.380,00 €"],
  ["Fertigungslohn (24 Std. × 45 €/Std.)", "1.080,00 €"],
  ["+ Fertigungsgemeinkostenzuschlag (80 %)", "864,00 €"],
  ["= Fertigungskosten", "1.944,00 €"],
  ["Selbstkosten (Material + Fertigung)", "3.324,00 €"],
  ["+ Gewinnzuschlag (6 %)", "199,44 €"],
  ["= Angebotspreis (netto)", "3.523,44 €"],
];

const faqs = [
  {
    q: "Woher bekomme ich meine eigenen Zuschlagssätze für MGK und FGK?",
    a: "Am genauesten aus der eigenen Buchhaltung: Gemeinkosten eines Jahres (Miete, Energie, Maschinenabschreibung, Verwaltung) durch die jeweilige Bezugsgröße (Materialeinzelkosten bzw. Fertigungslöhne desselben Zeitraums) teilen. Der Steuerberater oder die Handwerkskammer helfen bei der ersten Ermittlung, danach lässt sich der Satz jährlich aktualisieren.",
  },
  {
    q: "Was, wenn die Kalkulation höher ausfällt als der Preis der Konkurrenz?",
    a: "Ein zu niedriger Preis, der die eigenen Selbstkosten nicht deckt, führt langfristig zu Verlusten – selbst bei voller Auslastung. Es lohnt sich eher zu prüfen, ob der eigene Zeitaufwand realistisch geschätzt ist, als den Gewinnzuschlag unter ein wirtschaftlich tragfähiges Niveau zu drücken.",
  },
  {
    q: "Sollte man Nachlässe direkt in der Kalkulation einrechnen?",
    a: "Besser nicht dauerhaft: Ein sauber kalkulierter Angebotspreis macht Rabatte für Stammkunden oder Großaufträge transparent nachvollziehbar, statt sie unsichtbar in überhöhten Zuschlägen zu verstecken.",
  },
];

export default function AuftragskalkulationPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Auftragskalkulation: Material, Zeit und Gemeinkosten</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Die im Handwerk übliche Zuschlagskalkulation verteilt alle
          Betriebskosten nachvollziehbar auf einzelne Aufträge – vom
          Materialeinkauf bis zum Gewinnzuschlag. Wer die Methode einmal
          durchdrungen hat, kalkuliert jeden weiteren Auftrag in wenigen
          Minuten.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Die Zuschlagskalkulation Schritt für Schritt"
          intro="Fünf Schritte führen von den reinen Materialkosten zum vollständigen Angebotspreis:"
        >
          <StepList steps={schritte} />
        </GuideSection>

        <GuideSection
          title="Durchgerechnetes Beispiel"
          intro="Ein Einbauschrank mit 24 Stunden geplanter Fertigungszeit, 45 €/Std. Stundenverrechnungssatz, 15 % Materialgemeinkosten- und 80 % Fertigungsgemeinkostenzuschlag:"
        >
          <SpecTable columns={["Position", "Betrag"]} rows={beispiel} />
          <p className="mt-3 text-xs text-ink-faint">
            Die Zuschlagssätze (hier 15 % / 80 % / 6 %) sind Beispielwerte –
            sie unterscheiden sich je nach Betrieb deutlich und sollten
            anhand der eigenen Kostenstruktur ermittelt werden.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Den eigenen Stundenverrechnungssatz für den Fertigungslohn
            berechnest du mit dem{" "}
            <Link href="/tools/stundensatz" className="text-accent hover:underline">
              Stundensatzrechner
            </Link>
            . Wie sich die Kalkulation in ein verbindliches Angebot
            überführen lässt, zeigt der Artikel{" "}
            <Link href="/digitalisierung/aufmass-angebotserstellung" className="text-accent hover:underline">
              Aufmaß &amp; Angebotserstellung
            </Link>
            , Software für die laufende Kalkulation vergleicht die Übersicht{" "}
            <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
              Kalkulations- &amp; Auftragssoftware
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
