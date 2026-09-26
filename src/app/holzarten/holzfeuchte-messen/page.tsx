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
  title: "Holzfeuchte richtig messen",
  description:
    "Widerstandsmessgerät oder kapazitives Messgerät: wie du die Holzfeuchte im Werkstattalltag korrekt misst – Messtiefe, Elektrodenausrichtung, Holzartenkorrektur und Zielwerte je nach Einsatzort.",
  alternates: { canonical: "/holzarten/holzfeuchte-messen" },
};

const verfahren = [
  [
    "Widerstandsmessgerät (Einstechelektroden)",
    "Misst den elektrischen Widerstand zwischen zwei ins Holz getriebenen Elektroden – trockenes Holz leitet schlechter, der Widerstand steigt.",
    "Sehr genau bei richtiger Messtiefe, hinterlässt aber zwei kleine Einstichlöcher.",
  ],
  [
    "Kapazitives Messgerät (Streufeldmessung)",
    "Misst berührungsfrei über ein elektromagnetisches Feld, das über eine Messfläche ins Holz eindringt.",
    "Zerstörungsfrei, ideal für fertige Oberflächen – dafür über ein größeres Volumen gemittelt und etwas ungenauer.",
  ],
];

const zielwerte = [
  ["Winter beheizt", "ca. 7 %"],
  ["Wohnraum normal", "ca. 9,5 %"],
  ["Sommer feucht", "ca. 12,5 %"],
  ["Außen überdacht", "ca. 15 %"],
];

const messSteps = [
  {
    title: "Richtige Messtiefe wählen",
    body: "Elektroden auf etwa 1/4 bis maximal 1/3 der Holzdicke eintreiben. Nur so erfasst du den Kernbereich statt nur die – meist trockenere oder feuchtere – Oberfläche.",
  },
  {
    title: "Elektroden quer zur Faser ausrichten",
    body: "Für einen zuverlässigen Widerstandswert stehen die Elektroden quer zur Faserrichtung im Holz.",
  },
  {
    title: "Abstand zum Hirnholz einhalten",
    body: "Mindestens 30 cm vom Stirnende entfernt messen. Hirnholz trocknet und nimmt Feuchte deutlich schneller auf als die Breitseite und verfälscht den Wert.",
  },
  {
    title: "Holzart und Temperatur korrigieren",
    body: "Am Gerät die passende Holzart-Kennlinie und bei Bedarf die Temperaturkorrektur einstellen – der elektrische Widerstand fällt je nach Holzart und Temperatur unterschiedlich aus. Ohne diese Korrektur kann die Anzeige spürbar danebenliegen.",
  },
  {
    title: "Mehrere Messpunkte prüfen",
    body: "An verschiedenen Stellen und wenn möglich mehreren Brettern eines Stapels messen, Knoten und Harzgallen meiden, und den Mittelwert bilden statt einer Einzelmessung zu vertrauen.",
  },
];

const faqs = [
  {
    q: "Was ist die größte Fehlerquelle bei elektronischen Messgeräten?",
    a: "Eine vergessene oder falsche Holzart-Korrektur. Der elektrische Widerstand unterscheidet sich je nach Holzart bei gleicher Feuchte deutlich – ohne die passende Kennlinie zeigt das Gerät einen plausibel aussehenden, aber falschen Wert an.",
  },
  {
    q: "Reicht eine einzige Messung am gelieferten Stapel?",
    a: "Nein. Die Feuchte schwankt innerhalb eines Stapels und selbst innerhalb eines einzelnen Bretts. Miss mehrere Bretter an mehreren Stellen und bilde einen Mittelwert, bevor du eine Lieferung freigibst.",
  },
  {
    q: "Was, wenn mein Messgerät keine Holzartenkorrektur hat?",
    a: "Der angezeigte Wert dient dann bestenfalls als grobe Orientierung. Für belastbare Werte lohnt sich ein Gerät mit Holzarten- und Temperaturkorrektur – brauchbare Modelle gibt es bereits im Bereich von 40 bis 80 Euro.",
  },
  {
    q: "Kann ich mit einem kapazitiven Gerät durch eine Lackschicht messen?",
    a: "In der Regel ja, solange die Beschichtung dünn ist. Dickere Lack-, Öl- oder Furnierschichten verfälschen die Streufeldmessung zunehmend, da das Messfeld auch durch die Beschichtung hindurch misst.",
  },
];

export default function HolzfeuchteMessenPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/holzarten"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Holzarten
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Holzfeuchte richtig messen</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Ob eine frisch gelieferte Ladung Massivholz schon verarbeitet werden
          kann, entscheidet nicht das Gefühl, sondern die gemessene
          Holzfeuchte. Wer dabei falsch misst, bekommt einen falschen Wert –
          und baut im Zweifel zu feuchtes Holz ein.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Zwei Messverfahren im Vergleich"
          intro="Für die Werkstatt kommen praktisch zwei Gerätetypen infrage:"
        >
          <SpecTable
            columns={["Verfahren", "Funktionsweise", "Vor-/Nachteile"]}
            rows={verfahren}
            note="Für den Werkstattalltag an rohem Schnittholz ist das Widerstandsmessgerät der Klassiker. Bei bereits verleimten oder beschichteten Werkstücken ist ein kapazitives Gerät die schonendere Wahl."
          />
        </GuideSection>

        <GuideSection
          title="So misst du mit dem Widerstandsmessgerät richtig"
          intro="Die Genauigkeit steht und fällt mit fünf Punkten:"
        >
          <StepList steps={messSteps} />
        </GuideSection>

        <GuideSection
          title="Zielwerte je nach späterem Einsatzort"
          intro="Welche Holzfeuchte am Ende richtig ist, hängt vom Einbauort ab – Holz strebt immer die Ausgleichsfeuchte seiner Umgebung an:"
        >
          <SpecTable columns={["Einsatzort", "Ziel-Holzfeuchte"]} rows={zielwerte} />
          <p className="mt-3 text-xs text-ink-faint">
            Dieselben Richtwerte nutzt auch unser{" "}
            <Link href="/tools/quell-schwund" className="text-accent hover:underline">
              Quell- und Schwundrechner
            </Link>
            , mit dem du die zu erwartende Maßänderung beim Wechsel zwischen zwei Einsatzorten direkt berechnen kannst.
          </p>
        </GuideSection>

        <GuideSection
          title="Die Darrprobe: die genaueste, aber unpraktischste Methode"
          intro="Als Referenzmethode gilt nach wie vor die Darrprobe (früher DIN 52183, heute Kalibriergrundlage der DIN EN 13183):"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>Eine Probe wird direkt nach der Entnahme auf einer Präzisionswaage gewogen (Feuchtgewicht).</li>
            <li>Anschließend wird sie bei 103 °C ± 2 °C im Ofen bis zur Gewichtskonstanz getrocknet – je nach Probengröße und Holzart 24 bis 48 Stunden.</li>
            <li>Aus dem Gewichtsverlust errechnet sich die exakte Holzfeuchte in Prozent.</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Für den täglichen Gebrauch ist das zu langsam und zerstörend – aber ideal, um ein elektronisches Messgerät gelegentlich gegenzuprüfen und seine Anzeige neu zu vertrauen.
          </p>
        </GuideSection>

        <GuideSection title="Praxistipps für den Betrieb">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>Neu gelieferte Ware direkt bei Anlieferung stichprobenartig prüfen, nicht erst kurz vor der Verarbeitung.</li>
            <li>Holz vor der Messung an die Werkstatttemperatur angleichen lassen – kaltes Holz verfälscht die Widerstandsmessung.</li>
            <li>Bei sichtbaren Unterschieden zwischen Stapelrand und Stapelmitte beide Bereiche messen, nicht nur die leicht zugänglichen Außenkanten.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr. Herstellerangaben zum eigenen Messgerät
        gehen im Zweifel vor.
      </p>
    </Container>
  );
}
