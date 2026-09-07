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
  title: "Gewährleistung & Mängelhaftung im Schreinerhandwerk",
  description:
    "Werkvertrag, Kaufvertrag oder Werklieferungsvertrag: Welches Recht für Möbelstücke, Einbauschränke und Türen gilt, welche Fristen greifen und wie die Nacherfüllung abläuft.",
  alternates: { canonical: "/betrieb-und-recht/gewaehrleistung-maengelhaftung" },
};

const vertragsarten = [
  [
    "Werklieferungsvertrag (§ 650 BGB)",
    "Freistehendes Möbelstück nach Maß, z. B. ein Schreibtisch oder Regal",
    "Kaufrecht (§§ 433 ff., 434 ff. BGB) – bei Unikaten ergänzt um einzelne Werkvertragsvorschriften (§§ 642, 643, 645, 648, 649 BGB)",
  ],
  [
    "Werkvertrag (§ 631 BGB)",
    "Fest verbaute Arbeiten, z. B. Einbauschrank, Innentür, Fenster im eingebauten Zustand",
    "Werkvertragsrecht (§§ 631 ff. BGB) inkl. Abnahme und Nacherfüllung nach § 635 BGB",
  ],
  [
    "Kaufvertrag (§ 433 BGB)",
    "Verkauf eines bereits fertigen Möbelstücks von der Stange",
    "Kaufrecht (§§ 433 ff. BGB)",
  ],
];

const fristen = [
  [
    "Freistehende Möbel (Werklieferung/Kauf)",
    "2 Jahre ab Übergabe",
    "§ 438 Abs. 1 Nr. 3 BGB",
  ],
  [
    "Fest verbaute Arbeiten an einem Bauwerk (Einbauschrank, Tür, Fenster fest eingebaut)",
    "5 Jahre ab Abnahme",
    "§ 634a Abs. 1 Nr. 2 BGB",
  ],
  [
    "Beweislastumkehr bei Verbraucher-Kaufverträgen",
    "12 Monate ab Übergabe (Mangel wird zugunsten des Kunden vermutet)",
    "§ 477 BGB, seit 1.1.2022",
  ],
];

const nacherfuellungSteps = [
  {
    title: "Mangel wird gemeldet",
    body: "Der Kunde zeigt den Mangel an – am besten schriftlich mit Fotos und genauer Beschreibung. Eine Frist ist dafür beim BGB-Werk- und Kaufvertrag (anders als im Handelsrecht bei Kaufleuten) grundsätzlich nicht vorgeschrieben, sollte aber zeitnah erfolgen.",
  },
  {
    title: "Du bekommst das Recht zur Nacherfüllung",
    body: "Der Kunde muss dir zunächst die Gelegenheit geben, den Mangel zu beheben (Nachbesserung) oder eine mangelfreie Sache zu liefern (Ersatzlieferung) – mit einer angemessenen Frist. Erst danach darf er weitere Rechte geltend machen.",
  },
  {
    title: "Du trägst die Kosten der Nacherfüllung",
    body: "Material, Arbeitszeit, Transport- und Wegekosten für die Nacherfüllung gehen zu deinen Lasten – unabhängig davon, wie der Mangel entstanden ist.",
  },
  {
    title: "Bei Fehlschlagen: Rücktritt, Minderung oder Schadensersatz",
    body: "Schlägt die Nacherfüllung fehl – in der Praxis meist nach dem zweiten erfolglosen Versuch – oder verweigerst du sie zu Unrecht, kann der Kunde vom Vertrag zurücktreten, den Preis mindern oder auf eigene Kosten nachbessern lassen und dir die Rechnung stellen.",
  },
];

const faqs = [
  {
    q: "Zählt ein Einbauschrank als Bauwerk mit 5 Jahren Gewährleistung?",
    a: "In der Regel ja, wenn der Schrank fest mit dem Gebäude verbunden ist (verschraubt, eingepasst, nicht ohne Weiteres zerstörungsfrei entfernbar) und die Arbeiten für den Bestand oder die bestimmungsgemäße Nutzung des Gebäudes von wesentlicher Bedeutung sind – etwa bei einer maßgefertigten Einbauküche. Ein lose aufgestellter, verschraubter Kleiderschrank zählt dagegen eher als freistehendes Möbelstück mit 2 Jahren Frist. Im Zweifel entscheidet der Einzelfall, sprich unklare Fälle am besten vorab mit deiner Rechtsberatung durch.",
  },
  {
    q: "Was ist der Unterschied zwischen Gewährleistung und Garantie?",
    a: "Die Gewährleistung ist gesetzlich vorgeschrieben und gilt automatisch bei jedem Kauf- oder Werkvertrag – du kannst sie nicht ausschließen. Eine Garantie ist eine freiwillige Zusatzleistung, die du (oder ein Hersteller) on top anbietest, mit eigenen, frei vereinbarten Bedingungen. Beide Ansprüche können nebeneinander bestehen.",
  },
  {
    q: "Darf ich die Gewährleistung gegenüber Privatkunden vertraglich verkürzen?",
    a: "Bei neu hergestellten Sachen gegenüber Verbrauchern grundsätzlich nicht wirksam per AGB – die gesetzlichen Fristen (2 bzw. 5 Jahre) sind hier zwingend. Gegenüber Unternehmern (B2B) sind Verkürzungen in engeren Grenzen möglich. Individuelle Vertragsgestaltung dazu gehört in die Hände einer Rechtsberatung.",
  },
  {
    q: "Muss ich auf natürliche Unterschiede bei Massivholz im Angebot hinweisen?",
    a: "Ja, das lohnt sich in jedem Fall – und seit der Kaufrechtsreform 2022 ist es sogar rechtlich relevant: Willst du wirksam vereinbaren, dass eine Eigenschaft von der objektiv üblichen Beschaffenheit abweicht (z. B. Farb- und Maserungsunterschiede bei Massivholz, Astlöcher, Verfärbungen), muss der Kunde vor Vertragsschluss ausdrücklich darauf hingewiesen werden und dies gesondert vereinbaren – ein Hinweis allein in den AGB reicht nicht.",
  },
  {
    q: "Was bringt mir eine förmliche Abnahme?",
    a: "Bis zur Abnahme musst du als Handwerksbetrieb beweisen, dass dein Werk vertragsgemäß und mangelfrei ist. Mit der Abnahme dreht sich das um: Ab dann muss der Kunde beweisen, dass ein Mangel bereits bei Abnahme vorlag. Eine dokumentierte, am besten schriftliche Abnahme mit Unterschrift schafft für beide Seiten Klarheit über den Zustand zu diesem Zeitpunkt.",
  },
];

export default function GewaehrleistungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Gewährleistung & Mängelhaftung</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Ob ein Kunde bei einem Mangel zwei oder fünf Jahre lang Ansprüche
          hat, hängt nicht vom Zufall ab, sondern davon, welcher
          Vertragstyp im Hintergrund gilt. Ein Überblick über Werkvertrag,
          Kaufvertrag und Werklieferungsvertrag im Schreinerhandwerk – und
          was das für Fristen, Beweislast und Nacherfüllung bedeutet.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Welcher Vertragstyp gilt für deine Arbeit?"
          intro="Nicht jede handwerkliche Leistung ist automatisch ein Werkvertrag. Entscheidend ist, ob am Ende eine bewegliche Sache übergeben wird oder eine fest mit einem Gebäude verbundene Leistung entsteht:"
        >
          <SpecTable
            columns={["Vertragsart", "Beispiel", "Anwendbares Recht"]}
            rows={vertragsarten}
            note="Bei einem maßgefertigten, aber freistehenden Möbelstück greift über § 650 BGB im Ergebnis Kaufrecht – auch wenn du es individuell nach Maß fertigst. Erst die feste Verbindung mit einem Bauwerk macht daraus einen echten Werkvertrag."
          />
        </GuideSection>

        <GuideSection
          title="Fristen im Überblick"
          intro="Die Verjährungsfrist für Mängelansprüche richtet sich nach dem Vertragstyp und danach, ob die Leistung mit einem Gebäude fest verbunden ist:"
        >
          <SpecTable
            columns={["Leistungsart", "Frist", "Rechtsgrundlage"]}
            rows={fristen}
          />
        </GuideSection>

        <GuideSection
          title="Abnahme: der Wendepunkt für die Beweislast"
          intro="Bei Werkverträgen markiert die Abnahme (§ 640 BGB) einen entscheidenden Stichtag:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Vor der Abnahme:</strong> Du musst
              beweisen, dass dein Werk der vereinbarten Beschaffenheit
              entspricht und frei von Mängeln ist.
            </li>
            <li>
              <strong className="text-ink">Nach der Abnahme:</strong> Die
              Beweislast dreht sich um – der Kunde muss nun nachweisen, dass
              ein Mangel bereits zum Zeitpunkt der Abnahme vorlag.
            </li>
            <li>
              <strong className="text-ink">Form der Abnahme:</strong> Eine
              Abnahme kann ausdrücklich (z. B. per Unterschrift auf einem
              Abnahmeprotokoll), konkludent (etwa durch vorbehaltlose Nutzung
              und Bezahlung) oder fiktiv erfolgen, wenn der Kunde eine
              gesetzte, angemessene Frist zur Abnahme verstreichen lässt,
              ohne die Abnahme unter Angabe konkreter Mängel zu verweigern.
            </li>
            <li>
              Bekannte Mängel sollten bei der Abnahme ausdrücklich im
              Protokoll vermerkt werden – sonst verliert der Kunde
              möglicherweise spätere Ansprüche dafür.
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Nacherfüllung: der Ablauf bei einem Mangel"
          intro="Bevor ein Kunde weitergehende Rechte geltend machen kann, hast du grundsätzlich das Recht (und die Pflicht), den Mangel selbst zu beheben:"
        >
          <StepList steps={nacherfuellungSteps} />
        </GuideSection>

        <GuideSection title="Praxistipps für den Betrieb">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              Dokumentiere die Abnahme schriftlich, auch bei kleineren
              Aufträgen – ein kurzes Protokoll mit Unterschrift reicht.
            </li>
            <li>
              Halte den Zustand des fertigen Werks fotografisch fest, bevor
              der Kunde es übernimmt oder nutzt.
            </li>
            <li>
              Weise auf natürliche Material- und Maserungsunterschiede bei
              Massivholz oder Furnier ausdrücklich und gesondert im Angebot
              hin, nicht nur in den AGB.
            </li>
            <li>
              Reagiere auf eine Mängelanzeige zügig und biete aktiv die
              Nacherfüllung an – das verhindert, dass der Kunde vorzeitig zu
              weitergehenden Rechten wie Minderung oder Rücktritt greift.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Rechtsberatung im Einzelfall. Für
        eine verbindliche Einschätzung zu deinem Betrieb oder einem
        konkreten Streitfall wende dich an eine Rechtsanwältin oder einen
        Rechtsanwalt für Bau- und Werkvertragsrecht.
      </p>
    </Container>
  );
}
