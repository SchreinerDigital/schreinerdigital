import Link from "next/link";
import { Accordion, GuideSection, GuideShell } from "@/components/tools/guide";

function MaterialList({ items }: { items: { name: string; slug?: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.name}>
          {item.slug ? (
            <Link
              href={`/plattenwerkstoffe/${item.slug}`}
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

const hauptgruppen = [
  {
    title: "1. Spanwerkstoffe",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die Klassiker im Korpusbau. Hier werden Holzspäne mit Bindemitteln verpresst.
        </p>
        <MaterialList
          items={[
            { name: "Spanplatte", slug: "spanplatte" },
            { name: "OSB-Platte (Oriented Strand Board)", slug: "osb" },
            { name: "Röhrenspanplatte (Strangpressplatte)", slug: "roehrenspanplatte" },
            { name: "Zement- oder gipsgebundene Spanplatten" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Möbelkorpusse, Fußböden, statisch
          beanspruchte Bauplatten (OSB).
        </p>
      </div>
    ),
  },
  {
    title: "2. Faserwerkstoffe",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Holz wird bis auf die Holzfaser aufgeschlossen. Das Ergebnis sind sehr homogene
          Platten mit feinen Oberflächen und Kanten.
        </p>
        <MaterialList
          items={[
            { name: "MDF (Mitteldichte Faserplatte)", slug: "mdf" },
            { name: "HDF (Hochdichte Faserplatte)", slug: "hdf" },
            { name: "CDF (Compact Density Fiberboard)", slug: "cdf" },
            { name: "Hartfaserplatte (HB)", slug: "hartfaserplatte" },
            { name: "Holzfaserdämmplatten" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Lackierte Möbelfronten,
          Profilfräsungen, Trägermaterial für Laminat, Dämmung.
        </p>
      </div>
    ),
  },
  {
    title: "3. Lagenwerkstoffe (Sperrholz)",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Hier werden dünne Holzschichten (Furniere) oder Massivholzstäbe kreuzweise
          miteinander verleimt. Das sorgt für enorme Stabilität bei relativ geringem
          Gewicht.
        </p>
        <MaterialList
          items={[
            { name: "Multiplexplatte (MPX)", slug: "multiplexplatte" },
            { name: "Tischlerplatte (Stabsperrholz – ST)", slug: "tischlerplatte" },
            { name: "Stäbchensperrholz (STAE)" },
            { name: "Dreischichtplatte (Massivholzplatte)", slug: "dreischichtplatte" },
            { name: "Siebdruckplatte", slug: "siebdruckplatte" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Hochwertiger Möbelbau, Werkbänke,
          Fahrzeugausbau, Fachböden mit hoher Biegebelastung.
        </p>
      </div>
    ),
  },
  {
    title: "4. Verbundwerkstoffe",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Zwei unterschiedliche Werkstoffe – meist dünne, feste Deckschichten und ein
          leichter Kern – werden zu einem Sandwich verklebt. So entstehen dicke, optisch
          massive Bauteile bei einem Bruchteil des Gewichts einer Vollplatte.
        </p>
        <MaterialList
          items={[
            { name: "Wabenplatten (Leichtbauplatten)", slug: "wabenplatte" },
            { name: "Sandwichplatten mit Schaumkern" },
            { name: "Spezial-Verbundplatten" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Dicke, aber leichte Tischplatten,
          Messebau, Innentüren.
        </p>
      </div>
    ),
  },
  {
    title: "5. Schichtstoff- & Spezialplatten (HPL / Kompaktplatten)",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Auch wenn sie streng genommen oft zu den Kunststoffen zählen, werden sie in der
          Schreinerei mit den gleichen Maschinen und Werkzeugen bearbeitet wie Holz. Sie
          bestehen aus harzgetränkten Papierschichten.
        </p>
        <MaterialList
          items={[
            { name: "HPL-Kompaktplatten (Vollkernplatten)", slug: "hpl-kompaktplatte" },
            { name: "Mineralwerkstoffe (Solid Surface)" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Nassräume (WC-Trennwände),
          Küchenarbeitsplatten, Labormöbel, Fassadenbau.
        </p>
        <p>
          <strong className="text-ink">Besonderheit:</strong> Extrem stoßfest,
          wasserresistent und absolut hygienisch, erfordern aber oft diamantbestückte
          (DP) Werkzeuge.
        </p>
      </div>
    ),
  },
];

export function PlattenwerkstoffeGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Plattenwerkstoffe: Das Fundament für modernen Möbel- und Innenausbau"
        intro="Wer heute im Möbelbau, Innenausbau oder Ladenbau arbeitet, kommt an Plattenwerkstoffen (auch Holzwerkstoffe genannt) nicht vorbei. Während Massivholz durch seine natürliche Schönheit und Individualität besticht, bieten Plattenwerkstoffe die technische Lösung für großflächige, maßhaltige und wirtschaftliche Konstruktionen."
      >
        <h3 className="mt-6 font-semibold text-ink">Warum Plattenwerkstoffe statt Massivholz?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Als Schreiner wissen wir: Holz arbeitet. Es quillt, schwindet und neigt zum
          Werfen. Plattenwerkstoffe wurden entwickelt, um genau diese natürlichen
          Eigenschaften des Holzes zu minimieren und zu kontrollieren. Die wesentlichen
          Vorteile auf einen Blick:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Höchstes Stehvermögen:</strong> Durch das
            Zerkleinern (in Späne, Fasern oder Furniere) und anschließende Verleimen
            unter Druck und Hitze wird das Quell- und Schwindverhalten des Holzes stark
            reduziert. Die Platte sperrt sich in sich selbst.
          </li>
          <li>
            <strong className="text-ink">Homogenität:</strong> Äste, Risse oder
            unruhiger Wuchs spielen keine Rolle mehr. Die Platte bietet (je nach Art)
            durchgehend gleiche Eigenschaften in der Fläche.
          </li>
          <li>
            <strong className="text-ink">Riesige Formate:</strong> Bauteile in Größen
            von 2800 × 2070 mm oder mehr, fugenlos und am Stück. Mit Massivholz
            unmöglich!
          </li>
          <li>
            <strong className="text-ink">Ressourceneffizienz:</strong> Für viele
            Holzwerkstoffe (wie Span- oder Faserplatten) wird Restholz,
            Durchforstungsholz oder Sägerestholz verwendet. Das schont die wertvollen
            Stammhölzer.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Die 5 Hauptgruppen der Plattenwerkstoffe"
        intro="Um im Materialdschungel den Überblick zu behalten, teilen wir die Plattenwerkstoffe grob nach der Größe ihrer Holzbestandteile ein. Von hier aus gelangst du zu den detaillierten Material-Steckbriefen:"
      >
        <Accordion items={hauptgruppen} />
      </GuideSection>

      <GuideSection title="Praxistipps für Schreiner">
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Nicht jede Platte ist für jeden Zweck geeignet. Wenn du Holzwerkstoffe
          auswählst, solltest du immer diese drei Faktoren im Blick behalten:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Feuchtebeständigkeit (Nutzungsklassen):</strong>{" "}
            Für das Badezimmer brauchst du andere verleimte Platten als für das
            Wohnzimmer. Achte auf die Kürzel (z. B. P2 für Trockenbereich, P3 für
            Feuchtbereich bei Spanplatten).
          </li>
          <li>
            <strong className="text-ink">Emissionsklassen:</strong> Durch den
            eingesetzten Leim dünsten Platten Formaldehyd aus. In Europa ist die Klasse
            E1 der Standard, im hochwertigen Innenausbau wird oft schon E0,5 oder
            formaldehydfrei verleimtes Material gefordert.
          </li>
          <li>
            <strong className="text-ink">Oberflächengüte:</strong> Soll die Platte
            furniert, beschichtet (Melamin) oder deckend lackiert werden? Die Rohdichte
            und die Feinheit der Deckschicht entscheiden über das Endergebnis und deinen
            Schleifaufwand.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Im modernen Schreinerhandwerk ist das fundierte Wissen über Plattenwerkstoffe unverzichtbar. Während Massivholz seine absolute Berechtigung für exklusive Einzelstücke hat, basiert das wirtschaftliche Tagesgeschäft im Innenausbau auf der cleveren Auswahl der passenden Trägerplatte. Wer die spezifischen Eigenschaften von MDF, Spanplatte oder Lagenwerkstoffen genau kennt, arbeitet nicht nur wirtschaftlicher, sondern vermeidet auch teure Reklamationen durch Verzug, ausgerissene Kanten oder aufquellende Bauteile."
      />
    </GuideShell>
  );
}
