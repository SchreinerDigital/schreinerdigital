import Link from "next/link";
import { Accordion, FaqAccordion, GuideSection, GuideShell, SpecTable } from "@/components/tools/guide";

function MaschineList({ items }: { items: { name: string; slug?: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.name}>
          {item.slug ? (
            <Link
              href={`/maschinen-werkzeuge/${item.slug}`}
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
    title: "1. Sägetechnik",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Gerade Schnitte in Platten und Massivholz sowie Kurven- und
          Freiformschnitte, für die keine Kreissäge geeignet ist.
        </p>
        <MaschineList
          items={[
            { name: "Formatkreissäge", slug: "formatkreissaege" },
            { name: "Bandsäge", slug: "bandsaege" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "2. Hobel- und Frästechnik",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Plane, parallele Flächen sowie Profile, Nuten und Verbindungen –
          die Grundlage jeder maßhaltigen Massivholzverarbeitung.
        </p>
        <MaschineList
          items={[
            { name: "Abricht- und Dickenhobelmaschine", slug: "abricht-dickenhobelmaschine" },
            { name: "Tisch- und Oberfräse", slug: "tischfraese" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "3. CNC & Digitalfertigung",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Automatisierte Bearbeitung nach CAD/CAM-Daten – für Serienarbeit
          und komplexe Konturen in gleichbleibender Präzision.
        </p>
        <MaschineList items={[{ name: "CNC-Bearbeitungszentrum", slug: "cnc-bearbeitungszentrum" }]} />
        <p>
          <strong className="text-ink">Siehe auch:</strong>{" "}
          <Link href="/digitalisierung/cad-cam-software" className="font-medium text-accent hover:underline">
            CAD/CAM-Software im Vergleich
          </Link>
        </p>
      </div>
    ),
  },
  {
    title: "4. Bohr-, Schleif- und Kantentechnik",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Vom exakten Bohrbild über die Oberflächengüte bis zur geschützten
          Plattenkante – die Feinarbeiten vor der Montage.
        </p>
        <MaschineList
          items={[
            { name: "Bohr- und Dübeltechnik", slug: "bohr-duebeltechnik" },
            { name: "Schleifmaschinen", slug: "schleifmaschinen" },
            { name: "Kantenanleimmaschine", slug: "kantenanleimmaschine" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "5. Arbeitssicherheit",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Absaugung, Gefahrstoffrecht und persönliche Schutzausrüstung –
          gesetzlich verbindlich, nicht optional.
        </p>
        <MaschineList items={[{ name: "Absaugtechnik & Arbeitssicherheit", slug: "absaugtechnik-arbeitssicherheit" }]} />
      </div>
    ),
  },
  {
    title: "6. Handwerkzeuge",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Für Passarbeiten, Restaurierung und alles, wofür keine Maschine
          geeignet ist, bleiben Hobel, Stecheisen und Handsäge unverzichtbar.
        </p>
        <MaschineList items={[{ name: "Handwerkzeuge im Möbelbau", slug: "handwerkzeuge-moebelbau" }]} />
      </div>
    ),
  },
];

const normenTabelle = [
  ["DIN EN 1870-1", "Tisch-, Format- und Baustellenkreissägemaschinen"],
  ["DIN EN 847-1", "Fräs- und Hobelwerkzeuge, Kreissägeblätter"],
  ["DIN EN ISO 19085-1", "Holzbearbeitungsmaschinen – gemeinsame Grundanforderungen"],
  ["DIN EN ISO 19085-3", "NC-/CNC-Bohr- und Fräsmaschinen"],
  ["DIN EN ISO 19085-6", "Tischfräsmaschinen (Einspindel, senkrecht)"],
  ["DIN EN ISO 19085-8", "Bandschleif- und Kalibriermaschinen"],
  ["DIN EN ISO 13857", "Sicherheitsabstände gegen das Erreichen von Gefährdungsbereichen"],
];

const faqs = [
  {
    q: "Welche Maschine sollte eine kleine Werkstatt zuerst anschaffen?",
    a: "Formatkreissäge und Abricht-/Dickenhobelmaschine (oder eine Kombimaschine für beide Funktionen) decken den größten Teil der Grundbearbeitung ab. Fräse und Bandsäge folgen meist als Nächstes, ein CNC-Bearbeitungszentrum lohnt sich vor allem bei Serienarbeit oder komplexen Konturen.",
  },
  {
    q: "Ab wann gilt die neue EU-Maschinenverordnung statt der Maschinenrichtlinie?",
    a: "Die Verordnung (EU) 2023/1230 wurde 2023 veröffentlicht, einzelne Artikel gelten bereits seit Januar 2024. Für Hersteller und Inverkehrbringer von Maschinen gilt sie aber erst vollständig ab dem 20. Januar 2027 – bis dahin bleibt die Maschinenrichtlinie 2006/42/EG die maßgebliche Grundlage.",
  },
  {
    q: "Warum gelten ausgerechnet Eichen- und Buchenholzstaub als besonders gefährlich?",
    a: "Nach TRGS 906 sind Eichen- und Buchenholzstäube in Kategorie 1 als beim Menschen krebserzeugend eingestuft (Adenokarzinome der Nasenhaupt- und Nasennebenhöhlen). Stäube anderer Holzarten gelten nach aktuellem Kenntnisstand nur als Verdachtsfälle (Kategorie 2) – der allgemeine Arbeitsplatzgrenzwert von 2 mg/m³ gilt aber für Holzstaub grundsätzlich.",
  },
  {
    q: "Reicht ein normaler Werkstattstaubsauger zum Absaugen von Holzstaub?",
    a: "Nein. Für Holzstaub ist mindestens ein Entstauber oder Sauger der Staubklasse M vorgeschrieben, der auf Stäube mit einem Arbeitsplatzgrenzwert ab 0,1 mg/m³ ausgelegt ist. Ein gewöhnlicher Haushaltsstaubsauger erfüllt diese Anforderung nicht und lässt Feinstaub teilweise ungefiltert wieder in die Raumluft.",
  },
];

export function MaschinenWerkzeugeGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Maschinen und Werkzeuge: Die Grundausstattung der Schreinerwerkstatt"
        intro="Vom ersten Zuschnitt bis zur fertigen Kante durchläuft ein Werkstück mehrere Maschinen – jede mit eigener Funktion, eigenen Sicherheitsanforderungen und eigenen Normen."
      >
        <h3 className="mt-6 font-semibold text-ink">Worauf es bei Maschinen ankommt</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Sicherheitseinrichtungen:</strong>{" "}
            Spaltkeil, Schutzhaube, Vorschubapparat und Sicherheitsbrücke sind
            keine optionalen Zusätze, sondern normativ vorgeschriebene
            Bauteile – regelmäßig auf Funktion prüfen.
          </li>
          <li>
            <strong className="text-ink">Absaugung:</strong> Fast jede
            spanabhebende Maschine benötigt einen funktionierenden
            Absauganschluss, nicht nur aus Komfortgründen, sondern wegen des
            Arbeitsplatzgrenzwerts für Holzstaub.
          </li>
          <li>
            <strong className="text-ink">Werkzeugpflege:</strong> Scharfe
            Sägeblätter, Fräser und Hobelmesser reduzieren nicht nur den
            Kraftaufwand, sondern auch das Unfallrisiko – stumpfe Werkzeuge
            verlangen mehr Anpressdruck und damit unkontrolliertere Führung.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Die 6 Gruppen im Überblick"
        intro="Von der Formatkreissäge bis zum Stechbeitel – von hier aus gelangst du zu den detaillierten Steckbriefen:"
      >
        <Accordion items={gruppen} />
      </GuideSection>

      <GuideSection
        title="Relevante Sicherheitsnormen"
        intro="Die wichtigsten DIN-EN-Normen für Holzbearbeitungsmaschinen im Überblick:"
      >
        <SpecTable columns={["Norm", "Regelungsbereich"]} rows={normenTabelle} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Maschinen nehmen der Hand die Kraftarbeit ab, ersetzen aber nicht die Sorgfalt bei Einrichtung, Wartung und Absaugung. Wer Schutzeinrichtungen konsequent nutzt und Werkzeuge scharf hält, arbeitet zugleich präziser und sicherer."
      />
    </GuideShell>
  );
}
