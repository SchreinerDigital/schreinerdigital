import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Lagerverwaltung & Materialfluss",
  description:
    "Wie sich Plattenware, Beschläge und Verbrauchsmaterial sinnvoll bevorraten lassen und warum kurze Wege in der Werkstatt bares Geld sparen.",
  alternates: { canonical: "/betrieb-und-recht/lagerverwaltung-materialfluss" },
};

const abcAnalyse = [
  [
    "A-Teile",
    "Hoher Wert oder Verbrauch (z. B. häufig genutzte Plattenware, teure Beschläge)",
    "Genau disponieren, Bestand eng überwachen",
  ],
  [
    "B-Teile",
    "Mittlerer Wert oder Verbrauch",
    "Regelmäßig prüfen, mit etwas Sicherheitsbestand",
  ],
  [
    "C-Teile",
    "Geringer Wert, aber oft hohe Stückzahl (z. B. Schrauben, Dübel, Schleifmittel)",
    "Großzügiger Mindestbestand, seltener zählen",
  ],
];

const faqs = [
  {
    q: "Was ist der Unterschied zwischen Mindestbestand und Meldebestand?",
    a: "Der Mindestbestand (auch eiserne Reserve) ist die Menge, die keinesfalls unterschritten werden sollte, um trotz Lieferverzögerungen weiterarbeiten zu können. Der Meldebestand liegt darüber und markiert den Punkt, an dem eine neue Bestellung ausgelöst wird – er berücksichtigt zusätzlich die übliche Lieferzeit des Materials.",
  },
  {
    q: "Lohnt sich eine ABC-Analyse auch für einen kleinen Betrieb?",
    a: "Ja, auch in vereinfachter Form: Schon eine grobe Einteilung in „wenige teure Teile genau im Blick behalten“ und „viele günstige Teile großzügig bevorraten“ verhindert, dass Kapital in überflüssigen Beständen teurer Ware gebunden wird, während günstiges Verbrauchsmaterial plötzlich fehlt.",
  },
  {
    q: "Wie wirkt sich der Materialfluss auf die Fertigungszeit aus?",
    a: "Jeder unnötige Weg – etwa wenn Plattenware quer durch die Werkstatt zur Säge und danach wieder zurück zur Kantenanleimmaschine transportiert werden muss – kostet Zeit, ohne dem Werkstück einen Mehrwert hinzuzufügen. Eine Werkstatt, deren Maschinen in der tatsächlichen Bearbeitungsreihenfolge angeordnet sind, reduziert solche Leerwege spürbar.",
  },
];

export default function LagerverwaltungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Lagerverwaltung &amp; Materialfluss</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Zu viel Lagerbestand bindet Kapital und Platz, zu wenig führt zu
          Wartezeiten und Eilbestellungen – eine durchdachte Bevorratung und
          kurze Wege in der Werkstatt liegen dazwischen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Material nach Wert und Verbrauch einteilen (ABC-Analyse)"
          intro="Nicht jedes Material verdient denselben Kontrollaufwand – die ABC-Analyse teilt Lagerartikel nach ihrer wirtschaftlichen Bedeutung ein:"
        >
          <SpecTable columns={["Kategorie", "Merkmal", "Umgang"]} rows={abcAnalyse} />
        </GuideSection>

        <GuideSection title="Kurze Wege in der Werkstatt">
          <p className="text-sm leading-relaxed text-ink-muted">
            Neben der reinen Bevorratung entscheidet die räumliche Anordnung
            über die Effizienz: Liegt das Plattenlager nah am Zuschnitt und
            der Beschlagbestand nah an Montage und Endmontage, entfallen
            unnötige Transportwege. Ein Zwischenlager für halbfertige Teile
            lohnt sich nur, wenn dadurch tatsächlich Wartezeiten an
            Maschinen vermieden werden – ansonsten bindet es nur
            zusätzlich Fläche.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie Material- und Zeitbedarf in die Kalkulation einfließen,
            zeigt die{" "}
            <Link href="/digitalisierung/auftragskalkulation" className="text-accent hover:underline">
              Auftragskalkulation
            </Link>
            , wie Aufträge in der Werkstatt eingeplant werden, die{" "}
            <Link href="/betrieb-und-recht/arbeitsvorbereitung" className="text-accent hover:underline">
              Arbeitsvorbereitung
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
