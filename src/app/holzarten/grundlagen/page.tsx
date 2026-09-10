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
  title: "Holzarten bestimmen – Merkmale und Grundlagen",
  description:
    "Wie man Holzarten anhand von Farbe, Kern-/Splintholz, Jahresringen, Porenstruktur, Härte und Dichte sicher unterscheidet – plus geeignete Hölzer für den Möbelbau.",
  alternates: { canonical: "/holzarten/grundlagen" },
};

const farbgruppen = [
  ["Weißlich", "Ahorn, Birke, Linde, Hainbuche, Pappel, Tanne"],
  ["Gelblich", "Fichte, Esche, Douglasie"],
  ["Rötlich", "Kirschbaum, Erle, Lärche, Kiefer"],
  ["Bräunlich", "Eiche, Buche, Nussbaum, Ulme"],
  ["Dunkel bis schwärzlich", "Mooreiche, Wenge, Ebenholz"],
];

const kernSplint = [
  [
    "Splintholzbäume (einfarbig)",
    "Ahorn, Birke, Erle",
    "Kein Farbunterschied zwischen äußerem Splint und innerem Holzkörper.",
  ],
  [
    "Kernholzbäume (zweifarbig)",
    "Eiche, Lärche, Kiefer, Nussbaum",
    "Deutlicher Farbunterschied zwischen hellem Splint und dunklerem Farbkern.",
  ],
  [
    "Kernreifholzbäume",
    "Ulme (Rüster), Buche, Fichte",
    "Drei erkennbare Zonen (Splint – Reifholz – Kern); der Übergang ist fließender als bei echten Kernholzbäumen.",
  ],
];

const poren = [
  ["Ringporig", "Eiche, Esche, Ulme", "Grobe Poren konzentriert im Frühholzring – markante, rustikale Maserung."],
  ["Zerstreutporig", "Buche, Birke, Ahorn", "Poren gleichmäßig über den Jahresring verteilt – feine, ruhige Zeichnung."],
  [
    "Ohne echte Poren (Nadelhölzer)",
    "Fichte, Tanne, Kiefer",
    "Nadelhölzer besitzen keine Gefäße (Poren) im botanischen Sinn, sondern Tracheiden – im Sprachgebrauch oft vereinfachend „porenlos“ genannt.",
  ],
];

const haerte = [
  ["Weichholz", "Fichte, Kiefer, Lärche, Linde", "< 25 N/mm² (Brinellhärte, Faserrichtung quer)"],
  ["Mittelhart", "Ahorn, Birke, Kirschbaum", "ca. 25–35 N/mm²"],
  ["Hartholz", "Eiche, Esche, Buche, Nussbaum, Hainbuche", "> 35 N/mm²"],
];

const dichte = [
  ["Leicht", "< 0,43 g/cm³", "Balsaholz (tropisch) – unter den heimischen Nutzhölzern kaum unterschritten"],
  ["Mittelschwer", "0,43–0,72 g/cm³", "Fichte, Tanne, Ahorn, Birke, Kiefer"],
  ["Schwer", "0,72–1,00 g/cm³", "Eiche, Esche, Buche, Hainbuche"],
  ["Sehr schwer", "> 1,00 g/cm³", "Pockholz, Ebenholz"],
];

const eignungMoebelbau = [
  ["Eiche", "hellbraun, markante Poren", "hart", "Möbel, Parkett, Küchenfronten"],
  ["Buche", "rötlich-blass, gleichmäßig", "hart", "Stühle, Tische, Innenausbau"],
  ["Ahorn", "hell, feinporig", "mittel", "Arbeitsplatten, Fronten"],
  ["Nussbaum", "dunkelbraun, elegant", "hart", "Designmöbel, Furniere"],
  ["Kiefer", "gelblich, astreich", "weich", "Landhausmöbel, Türen"],
  ["Esche", "hell, lebhafte Maserung", "hart", "Möbel, Sportgeräte"],
  ["Birke", "hell, gleichmäßig", "mittel", "Sperrholz, Schränke"],
  ["Lärche", "rötlich, harzhaltig", "mittelhart", "Fenster, rustikale Möbel"],
];

const faqs = [
  {
    q: "Warum ändert Holz nach dem Zuschnitt seine Farbe?",
    a: "UV-Strahlung und Sauerstoff verändern die Farbstoffe im Holz auch nach der Verarbeitung weiter – die meisten Hölzer dunkeln über Monate bis Jahre nach, manche (z. B. Kirschbaum) deutlich sichtbar, andere kaum merklich.",
  },
  {
    q: "Was bedeutet FSC- oder PEFC-Zertifizierung beim Holzeinkauf?",
    a: "Beide Siegel bestätigen, dass das Holz aus nachweislich nachhaltig bewirtschafteten Wäldern stammt. FSC (Forest Stewardship Council) und PEFC (Programme for the Endorsement of Forest Certification) prüfen dafür unabhängig die gesamte Lieferkette vom Wald bis zum Sägewerk.",
  },
  {
    q: "Welche Holzfeuchte sollte Massivholz beim Verarbeiten haben?",
    a: "Für den Innenausbau und Möbelbau hat sich ein Bereich von etwa 8–12 % Holzfeuchte etabliert, angepasst an die spätere Raumklimasituation. Wie stark sich Holz bei Feuchteänderungen noch bewegt, lässt sich mit dem Quell- und Schwundrechner für die jeweilige Holzart abschätzen.",
  },
  {
    q: "Ist ringporiges Holz stabiler als zerstreutporiges?",
    a: "Nicht grundsätzlich – die Porenverteilung beeinflusst vor allem die Optik und Oberflächenwirkung. Stabilität und Härte hängen stärker von Dichte und Zellwandstruktur der jeweiligen Holzart ab als von der reinen Porenverteilung.",
  },
];

export default function HolzartenGrundlagenPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/holzarten"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Holzarten
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Holzarten bestimmen: Merkmale und Grundlagen</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Holz ist der traditionsreichste Werkstoff im Schreinerhandwerk –
          und zugleich einer der vielseitigsten. Wer die wichtigsten
          Erkennungsmerkmale kennt, kann Material gezielt auswählen und
          richtig verarbeiten, statt sich allein auf das Etikett des
          Händlers zu verlassen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Holzbestimmung: So lassen sich Holzarten unterscheiden"
          intro="Farbe, Struktur, Härte und Geruch sind die wichtigsten Erkennungsmerkmale – sowohl für die Holzauswahl als auch für die Qualitätsprüfung im Werkstattalltag."
        >
          <h3 className="mt-6 font-semibold text-ink">1. Farbe und Farbgruppen</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Holzfarben reichen von fast weiß bis tiefschwarz. Bei
            Kernholzbäumen ist dabei die Farbe des Kernholzes ausschlaggebend.
            Grob lassen sich fünf Gruppen unterscheiden:
          </p>
          <SpecTable columns={["Farbgruppe", "Beispiele"]} rows={farbgruppen} />
          <p className="mt-3 text-xs text-ink-faint">
            Hinweis: Die Holzfarbe verändert sich mit der Zeit – UV-Strahlung
            lässt viele Hölzer nachdunkeln.
          </p>

          <h3 className="mt-8 font-semibold text-ink">2. Kern-, Splint- und Kernreifholz</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die innere Struktur des Stammquerschnitts gibt Aufschluss über
            den Holzaufbau und beeinflusst Zuschnitt wie
            Oberflächenbehandlung:
          </p>
          <SpecTable columns={["Typ", "Beispiele", "Merkmal"]} rows={kernSplint} />

          <h3 className="mt-8 font-semibold text-ink">3. Jahresringe und Maserung</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die Jahresringe zeigen das Wachstum des Baumes: Eiche, Esche,
            Lärche und Kiefer bilden deutliche, kontrastreiche Ringe,
            während sie bei Birke, Erle und Birnbaum kaum sichtbar sind.
            Entsprechend variiert auch die Maserung im Längsschnitt – von
            stark gezeichnet (Eiche, Esche, Lärche) über zart (Ahorn,
            Kirschbaum, Buche) bis kaum erkennbar (Erle, Birnbaum).
          </p>

          <h3 className="mt-8 font-semibold text-ink">4. Porenstruktur</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die Verteilung der Gefäße (Poren) prägt das Erscheinungsbild und
            die Oberflächenwirkung von Laubhölzern:
          </p>
          <SpecTable columns={["Porentyp", "Beispiele", "Beschreibung"]} rows={poren} />
          <p className="mt-3 text-xs text-ink-faint">
            Fachwissen: Ringporige Hölzer wirken markanter und sind
            besonders beliebt für rustikale oder klassische Möbel.
          </p>

          <h3 className="mt-8 font-semibold text-ink">5. Härte und Dichte (nach Brinell)</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die Härte eines Holzes wird nach der Brinell-Methode (HB)
            gemessen und gibt an, wie widerstandsfähig das Material gegen
            Eindrücken ist. Grundsätzlich gilt: Je dichter das Holz, desto
            höher meist auch die Festigkeit.
          </p>
          <SpecTable columns={["Härtegrad", "Beispiele", "Brinellhärte (quer zur Faser)"]} rows={haerte} />

          <h3 className="mt-8 font-semibold text-ink">6. Gewicht und Rohdichte</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die Rohdichte beeinflusst sowohl die Bearbeitung als auch das
            Einsatzgebiet. Angegeben bei etwa 12–15 % Holzfeuchte (also im
            lufttrockenen, praxisüblichen Zustand):
          </p>
          <SpecTable columns={["Gewichtsklasse", "Rohdichte", "Beispiele"]} rows={dichte} />
          <p className="mt-3 text-xs text-ink-faint">
            Fichte und Tanne liegen mit rund 0,46–0,48 g/cm³ trotz ihres
            Rufs als „leichtes“ Bauholz bereits in der Klasse
            „mittelschwer“ – echte Leichthölzer unter 0,43 g/cm³ sind unter
            den in Mitteleuropa gängigen Nutzhölzern die Ausnahme.
          </p>

          <h3 className="mt-8 font-semibold text-ink">7. Geruch und Harzgehalt</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Viele Holzarten haben einen charakteristischen Eigengeruch:
            harzig bei Fichte, Kiefer und Lärche, säuerlich bei Tanne,
            gerbsäurehaltig bei Eiche, süßlich bei Rosenholz und Palisander,
            eher unangenehm-feucht bei frisch aufgeschnittenem Nussbaum und
            Ulme. Nadelhölzer wie Fichte und Kiefer besitzen zudem
            sichtbare Harzgänge, die beim Bearbeiten austreten können.
          </p>
        </GuideSection>

        <GuideSection
          title="Geeignete Holzarten für den Möbelbau"
          intro="Im Möbelbau kommen sowohl Nadel- als auch Laubhölzer zum Einsatz – die Wahl hängt von Optik, Härte, Bearbeitbarkeit und Preis ab. Ausführliche Steckbriefe zu jeder Holzart finden sich im Holzarten-Lexikon."
        >
          <SpecTable
            columns={["Holzart", "Farbe & Optik", "Härte", "Typische Verwendung"]}
            rows={eignungMoebelbau}
          />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection
          title="Fazit"
          intro="Die Kenntnis über Holzarten und ihre Eigenschaften ist ein zentraler Bestandteil im Schreinerhandwerk. Wer weiß, wie man Holz anhand von Farbe, Poren, Härte und Dichte richtig bestimmt und auswählt, kann langlebige, formstabile und ästhetisch ansprechende Möbel herstellen – die Materialkunde ist damit nicht nur theoretisches Wissen, sondern die Grundlage für präzises Handwerk."
        />
      </GuideShell>
    </Container>
  );
}
