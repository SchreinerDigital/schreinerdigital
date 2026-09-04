import Link from "next/link";
import { Accordion, GuideSection, GuideShell, SpecTable } from "@/components/tools/guide";

const merkmale = [
  {
    title: "1. Farbe und Farbgruppen",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die Farbe ist das erste Erkennungsmerkmal. Bei Kernholzbäumen ist dabei immer die Farbe
          des Kernholzes entscheidend.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Weißlich:</strong> Ahorn, Birke, Linde
          </li>
          <li>
            <strong className="text-ink">Gelblich:</strong> Fichte, Esche, Douglasie
          </li>
          <li>
            <strong className="text-ink">Rötlich:</strong> Kirschbaum, Erle, Lärche
          </li>
          <li>
            <strong className="text-ink">Bräunlich:</strong> Eiche, Nussbaum
          </li>
          <li>
            <strong className="text-ink">Dunkel:</strong> Wenge, Mooreiche
          </li>
        </ul>
        <p>
          <strong className="text-ink">Tipp:</strong> Die Holzfarbe verändert sich mit der Zeit –
          UV-Strahlung lässt viele Hölzer nachdunkeln.
        </p>
      </div>
    ),
  },
  {
    title: "2. Kern- und Splintholz",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Der Querschnitt eines Stammes verrät viel über den Aufbau und die spätere Optik des
          Holzes. Man unterscheidet drei Hauptgruppen:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Splintholzbäume (einfarbig):</strong> Ahorn, Birke, Erle
          </li>
          <li>
            <strong className="text-ink">Kernholzbäume (zweifarbig):</strong> Eiche, Lärche,
            Kiefer, Nussbaum
          </li>
          <li>
            <strong className="text-ink">Kernreifholzbäume:</strong> Ulme (Rüster), Fichte
          </li>
        </ul>
        <p>
          <strong className="text-ink">Zuschnitt-Tipp:</strong> Der Farbunterschied zwischen Kern
          und Splint ist bei Kernhölzern deutlich sichtbar. Das ist ein extrem wichtiges
          Gestaltungsmerkmal beim Aushobeln und Verleimen von Massivholzplatten.
        </p>
      </div>
    ),
  },
  {
    title: "3. Jahresringe und Maserung",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die Jahresringe zeigen das Wachstum des Baumes. Im Längsschnitt aufgeschnitten, ergibt
          sich daraus die charakteristische Zeichnung des Holzes.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Deutlich sichtbar:</strong> Eiche, Esche, Lärche
          </li>
          <li>
            <strong className="text-ink">Schwach sichtbar:</strong> Birke, Erle, Birnbaum
          </li>
        </ul>
        <p>Daraus resultierende Maserung:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Stark gemasert:</strong> Eiche, Esche, Lärche
          </li>
          <li>
            <strong className="text-ink">Zarte Maserung:</strong> Ahorn, Kirsche, Buche
          </li>
          <li>
            <strong className="text-ink">Kaum sichtbar:</strong> Erle, Birnbaum
          </li>
        </ul>
        <p>
          <strong className="text-ink">Gestaltungs-Tipp:</strong> Stark gemaserte Hölzer eignen
          sich perfekt als optisches Highlight (z. B. für Fronten), während zarte Maserungen Ruhe
          in große Flächen bringen.
        </p>
      </div>
    ),
  },
  {
    title: "4. Porenstruktur",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die Porenstruktur beeinflusst maßgeblich das Erscheinungsbild, die Haptik und die
          Oberflächenbehandlung eines Holzes:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Ringporig (grobe Struktur):</strong> Eiche, Esche, Ulme
          </li>
          <li>
            <strong className="text-ink">Zerstreutporig (feine Struktur):</strong> Buche, Birke,
            Ahorn
          </li>
          <li>
            <strong className="text-ink">Porenlos (Nadelhölzer):</strong> Fichte, Tanne, Kiefer
          </li>
        </ul>
        <p>
          <strong className="text-ink">Fachwissen:</strong> Ringporige Hölzer wirken markanter und
          sind besonders beliebt für rustikale Möbel. Beachte beim Lackieren oder Ölen, dass tiefe
          Poren deutlich mehr Material aufnehmen!
        </p>
      </div>
    ),
  },
  {
    title: "5. Härte (nach Brinell)",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die Härte (Brinell-Methode / HB) gibt an, wie widerstandsfähig das Holz gegen Druck ist.
          Grundregel: Je dichter das Holz, desto höher die Festigkeit.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Weichholz:</strong> Fichte, Kiefer, Lärche
          </li>
          <li>
            <strong className="text-ink">Mittelhart:</strong> Ahorn, Birke, Kirsche
          </li>
          <li>
            <strong className="text-ink">Hartholz:</strong> Eiche, Esche, Buche
          </li>
        </ul>
        <p>
          <strong className="text-ink">Werkstatt-Tipp:</strong> Harthölzer sind ideal für stark
          beanspruchte Flächen wie Tischplatten oder Treppen. Sie erfordern aber schärfere
          Werkzeuge und sollten bei Schraubverbindungen zwingend vorgebohrt werden.
        </p>
      </div>
    ),
  },
  {
    title: "6. Gewicht und Dichte",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Das spezifische Gewicht (hier bei ca. 15 % Holzfeuchte) beeinflusst sowohl die
          maschinelle Bearbeitung als auch das spätere Einsatzgebiet des Holzes.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Leicht (&lt; 0,43 g/cm³):</strong> Fichte, Tanne
          </li>
          <li>
            <strong className="text-ink">Mittelschwer (0,43–0,72 g/cm³):</strong> Ahorn, Birke,
            Buche, Kiefer
          </li>
          <li>
            <strong className="text-ink">Schwer (0,72–1,00 g/cm³):</strong> Eiche, Esche,
            Hainbuche
          </li>
          <li>
            <strong className="text-ink">Sehr schwer (&gt; 1,00 g/cm³):</strong> Ebenholz, Pockholz
          </li>
        </ul>
        <p>
          <strong className="text-ink">Kalkulations-Tipp:</strong> Das Gewicht ist extrem wichtig
          für den Transport, die Montage und die Auswahl der richtigen Beschläge (z. B. bei Klappen
          oder großen Türen). Nutze zur schnellen Berechnung in der Werkstatt einfach unseren{" "}
          <Link href="/tools/plattengewicht" className="font-medium text-accent hover:underline">
            Gewichtsrechner
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    title: "7. Geruch und Harzgehalt",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Ein oft unterschätztes, aber sehr eindeutiges Erkennungsmerkmal. Viele Hölzer verraten
          sich bereits bei der ersten Bearbeitung durch ihren charakteristischen Eigengeruch.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-ink">Harzig:</strong> Fichte, Kiefer, Lärche
          </li>
          <li>
            <strong className="text-ink">Säuerlich:</strong> Tanne
          </li>
          <li>
            <strong className="text-ink">Gerbsäurehaltig:</strong> Eiche
          </li>
          <li>
            <strong className="text-ink">Süßlich:</strong> Rosenholz, Palisander
          </li>
          <li>
            <strong className="text-ink">Unangenehm (feucht):</strong> Nussbaum
          </li>
        </ul>
        <p>
          <strong className="text-ink">Werkstatt-Tipp:</strong> Nadelhölzer wie Kiefer besitzen oft
          Harzgänge. Austretendes Harz verklebt schnell Sägeblätter und Fräser – hier hilft
          spezieller Harzlöser. Achtung bei Eiche: Die enthaltene Gerbsäure führt in Verbindung mit
          Eisenmetallen (z. B. Spänen) und Feuchtigkeit zu blauschwarzen Verfärbungen auf dem Holz!
        </p>
      </div>
    ),
  },
];

const moebelbauTabelle = [
  ["Eiche", "hellbraun, markante Poren", "hart", "Möbel, Parkett, Küchenfronten"],
  ["Buche", "rötlich, gleichmäßig", "hart", "Stühle, Tische, Innenausbau"],
  ["Ahorn", "hell, feinporig", "mittel", "Arbeitsplatten, Fronten"],
  ["Nussbaum", "dunkelbraun, elegant", "hart", "Designmöbel, Furniere"],
  ["Kiefer", "gelblich, astreich", "weich", "Landhausmöbel, Türen"],
  ["Esche", "hell, lebhafte Maserung", "hart", "Möbel, Sportgeräte"],
  ["Birke", "hell, gleichmäßig", "mittel", "Sperrholz, Schränke"],
  ["Lärche", "rötlich, harzhaltig", "mittelhart", "Fenster, rustikale Möbel"],
];

export function HolzartenGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Holzbestimmung: So erkennst du dein Material sicher"
        intro="Farbe, Struktur, Härte oder Geruch – Holz lässt sich anhand verschiedener natürlicher Merkmale eindeutig identifizieren. Diese Erkennungsmerkmale sind sowohl für die Holzauswahl als auch für die Qualitätsprüfung im Werkstattalltag entscheidend. Hier findest du die 7 wichtigsten Erkennungsmerkmale auf einen Blick."
      >
        <Accordion items={merkmale} />
      </GuideSection>

      <GuideSection
        title="Geeignete Holzarten für den Möbelbau"
        intro="Im Möbelbau kommen sowohl Nadel- als auch Laubhölzer zum Einsatz. Die Wahl hängt von Optik, Härte, Bearbeitbarkeit und Preis ab."
      >
        <SpecTable
          columns={["Holzart", "Farbe & Optik", "Härte", "Verwendung"]}
          rows={moebelbauTabelle}
        />
      </GuideSection>

      <GuideSection title="Praxistipps für Schreiner">
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Feuchtegehalt prüfen:</strong> Idealerweise liegt er
            zwischen 8–12 %.
          </li>
          <li>
            <strong className="text-ink">Zertifizierung beachten:</strong> FSC® oder PEFC™ steht
            für nachhaltige Forstwirtschaft.
          </li>
          <li>
            <strong className="text-ink">Verwendungszweck bedenken:</strong> Innenbereich,
            Außenbereich oder Feuchtraum benötigen unterschiedliche Holzarten.
          </li>
          <li>
            <strong className="text-ink">Oberflächen anpassen:</strong> Harthölzer wie Eiche oder
            Buche reagieren unterschiedlich auf Lacke und Öle.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Die Kenntnis über Holzarten und ihre Eigenschaften ist ein zentraler Bestandteil im Schreinerhandwerk. Wer weiß, wie man Holz richtig bestimmt und auswählt, kann langlebige, formstabile und ästhetisch ansprechende Möbel herstellen. Die Materialkunde ist somit nicht nur theoretisches Wissen, sondern die Grundlage für präzises Handwerk und hochwertige Ergebnisse."
      />
    </GuideShell>
  );
}
