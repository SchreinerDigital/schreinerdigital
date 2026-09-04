import Link from "next/link";
import { Accordion, GuideSection, GuideShell } from "@/components/tools/guide";

function OberflaecheList({ items }: { items: { name: string; slug?: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.name}>
          {item.slug ? (
            <Link
              href={`/oberflaechen/${item.slug}`}
              className="font-medium text-accent hover:underline"
            >
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </li>
      ))}
    </ul>
  );
}

const gruppen = [
  {
    title: "1. Öle & Wachse",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Ziehen in die Holzporen ein statt einen Film zu bilden – erhalten
          die natürliche Optik und Haptik, bieten dafür weniger Schutz als
          Lacke.
        </p>
        <OberflaecheList
          items={[
            { name: "Hartwachsöl", slug: "hartwachsoel" },
            { name: "Leinölfirnis", slug: "leinoelfirnis" },
            { name: "Möbelwachs", slug: "moebelwachs" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Arbeitsplatten,
          Massivholzböden, Pflege bereits behandelter Möbel.
        </p>
      </div>
    ),
  },
  {
    title: "2. Lacke",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Bilden einen geschlossenen Film auf der Oberfläche – von der
          traditionellen Schellackpolitur bis zum hochbeständigen 2K-PU-Lack.
        </p>
        <OberflaecheList
          items={[
            { name: "DD-Lack (2K-PU)", slug: "dd-lack" },
            { name: "Wasserlack", slug: "wasserlack" },
            { name: "Nitrolack", slug: "nitrolack" },
            { name: "Schellack", slug: "schellack" },
            { name: "Bootslack", slug: "bootslack" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> stark beanspruchte
          Möbel, Musikinstrumente, Außenholz.
        </p>
      </div>
    ),
  },
  {
    title: "3. Beizen & Lasuren",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Reine Farbgebung ohne (Beize) oder mit reduziertem (Lasur)
          Oberflächenschutz – meist Vorstufe zu einer weiteren Behandlung.
        </p>
        <OberflaecheList
          items={[
            { name: "Holzbeize", slug: "holzbeize" },
            { name: "Lasur", slug: "lasur" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Farbanpassung vor
          Lackierung, Außenholz (Fenster, Zäune, Gartenmöbel).
        </p>
      </div>
    ),
  },
];

export function OberflaechenGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Oberflächen: Der letzte Schritt entscheidet über Optik und Lebensdauer"
        intro="Die beste Materialauswahl und sauberste Verarbeitung nützen wenig, wenn die abschließende Oberflächenbehandlung nicht zum Einsatzzweck passt. Die Wahl zwischen Öl, Wachs, Lack, Beize und Lasur bestimmt, wie ein Möbelstück aussieht, sich anfühlt und wie gut es Feuchtigkeit, Hitze und mechanische Belastung übersteht."
      >
        <h3 className="mt-6 font-semibold text-ink">Filmbildend oder porenoffen?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Die wichtigste Grundunterscheidung zwischen den Oberflächen in
          diesem Überblick:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Porenoffen (Öle, Wachse):</strong>{" "}
            ziehen ins Holz ein, lassen es „atmen“, sind unkompliziert
            auszubessern, bieten aber geringeren Schutz.
          </li>
          <li>
            <strong className="text-ink">Filmbildend (Lacke):</strong> legen
            sich als geschlossene Schicht auf die Oberfläche, schützen
            deutlich besser vor Feuchtigkeit und Chemikalien, sind bei
            Beschädigung aber aufwendiger auszubessern.
          </li>
          <li>
            <strong className="text-ink">Nur Farbe (Beizen):</strong> verändern
            ausschließlich den Farbton und müssen danach immer mit einer der
            beiden anderen Kategorien versiegelt werden.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Die 3 Gruppen der Oberflächenbehandlung"
        intro="Von der Grundierung bis zum Hochglanzlack – von hier aus gelangst du zu den detaillierten Steckbriefen:"
      >
        <Accordion items={gruppen} />
      </GuideSection>

      <GuideSection title="Praxistipps für Schreiner">
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Immer zuerst testen:</strong> Öle,
            Beizen und Lacke reagieren je nach Holzart unterschiedlich –
            ein Test auf einem Reststück derselben Holzart und Charge
            erspart böse Überraschungen auf der sichtbaren Fläche.
          </li>
          <li>
            <strong className="text-ink">Brandschutz bei Ölen ernst
            nehmen:</strong> Mit Leinölfirnis oder Hartwachsöl getränkte
            Lappen können sich selbst entzünden – ausgebreitet trocknen
            lassen oder in Wasser eintauchen, niemals zusammengeknüllt
            entsorgen.
          </li>
          <li>
            <strong className="text-ink">Innen und außen unterscheiden:</strong>{" "}
            Für den Außenbereich nur speziell dafür entwickelte Produkte
            (Bootslack, Dickschichtlasur) verwenden – reine Innenraumlacke
            versagen unter UV-Strahlung und Feuchtewechsel deutlich schneller.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Es gibt keine universell beste Oberfläche – nur die passende für den jeweiligen Einsatzzweck. Wer Schutzanspruch, gewünschte Optik und Reparaturfreundlichkeit gegeneinander abwägt, statt sich allein am Preis zu orientieren, erspart sich spätere Enttäuschungen an der sichtbarsten Stelle jedes Möbelstücks."
      />
    </GuideShell>
  );
}
