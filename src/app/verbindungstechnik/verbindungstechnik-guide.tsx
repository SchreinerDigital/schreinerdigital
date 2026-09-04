import Link from "next/link";
import { Accordion, GuideSection, GuideShell } from "@/components/tools/guide";

function VerbindungList({ items }: { items: { name: string; slug?: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.name}>
          {item.slug ? (
            <Link
              href={`/verbindungstechnik/${item.slug}`}
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
    title: "1. Traditionelle Holzverbindungen",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Verbindungen, deren Festigkeit allein aus der Holzgeometrie und der
          Verleimung entsteht – ohne Metallbeschlag oder Zusatzdübel.
        </p>
        <VerbindungList
          items={[
            { name: "Zapfenverbindung", slug: "zapfenverbindung" },
            { name: "Schwalbenschwanzverbindung (Zinkung)", slug: "schwalbenschwanzverbindung" },
            { name: "Nut-Feder-Verbindung", slug: "nut-feder-verbindung" },
            { name: "Gehrungsverbindung", slug: "gehrungsverbindung" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Rahmen- und
          Fensterbau, Schubladen, Massivholzmöbel, Zierleisten.
        </p>
      </div>
    ),
  },
  {
    title: "2. Dübeltechnik",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Ein separater, meist stiftförmiger Verbinder überbrückt die Fuge
          zwischen beiden Werkstücken – schneller zu fertigen als klassische
          Holzverbindungen, bei ähnlich guter Ausrichtung.
        </p>
        <VerbindungList
          items={[
            { name: "Holzdübelverbindung (Riffeldübel)", slug: "holzduebelverbindung" },
            { name: "Flachdübelverbindung (Lamello)", slug: "flachduebelverbindung" },
            { name: "Domino-Verbindung", slug: "domino-verbindung" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Korpusbau,
          Rahmenverbindungen, Verleimen von Massivholzplatten.
        </p>
      </div>
    ),
  },
  {
    title: "3. Beschlagverbindungen",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Mechanische Verbinder aus Metall, die sich mit einem
          Schraubendreher lösen und wieder festziehen lassen – die
          Grundlage jedes zerlegbaren Möbels.
        </p>
        <VerbindungList
          items={[{ name: "Exzenterverbinder (Rafix, Minifix)", slug: "exzenterverbinder" }]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Flatpack- und
          Serienmöbel, transportfreundliche Konstruktionen, Nachrüstungen.
        </p>
      </div>
    ),
  },
  {
    title: "4. Schraub- und Klebeverbindungen",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die beiden Grundprinzipien Kraftschluss (Schraube) und Stoffschluss
          (Klebstoff) – meist die Ergänzung zu einer der anderen drei
          Verbindungsarten, nicht selten aber auch für sich allein tragfähig.
        </p>
        <VerbindungList
          items={[
            { name: "Schraubverbindung (Konfirmat)", slug: "schraubverbindung" },
            { name: "Leimverbindung", slug: "leimverbindung" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Korpusmontage,
          Beschlagbefestigung, flächige Verleimung von Massivholzplatten.
        </p>
      </div>
    ),
  },
];

export function VerbindungstechnikGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Verbindungstechnik: Das unsichtbare Rückgrat jedes Möbels"
        intro="Egal wie sorgfältig ein Werkstück aus Holz oder Plattenwerkstoff zugeschnitten und veredelt ist – am Ende entscheidet die Verbindungstechnik darüber, ob daraus ein stabiles, langlebiges Möbelstück wird. Die richtige Wahl hängt von Belastung, gewünschter Optik und davon ab, ob eine Verbindung später wieder gelöst werden soll."
      >
        <h3 className="mt-6 font-semibold text-ink">Welche Verbindung für welchen Zweck?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Es gibt nicht die eine „beste“ Verbindung – jede Technik ist ein
          Kompromiss aus Aufwand, Festigkeit, Optik und Lösbarkeit:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Formschluss:</strong> Zapfen, Zinken,
            Nut-Feder und Dübel übertragen Kräfte über ihre Geometrie – sie
            sitzen bereits vor dem Verleimen fest ineinander.
          </li>
          <li>
            <strong className="text-ink">Kraftschluss:</strong> Schrauben
            pressen Bauteile über Gewindekraft zusammen – schnell montiert
            und bei Bedarf wieder lösbar.
          </li>
          <li>
            <strong className="text-ink">Stoffschluss:</strong> Klebstoff
            verbindet die Fügeteile chemisch – bei richtiger Ausführung
            stabiler als das Holz selbst, dafür unlösbar.
          </li>
          <li>
            <strong className="text-ink">Beschlagverbindungen:</strong>{" "}
            Exzenterverbinder kombinieren Formschluss mit gezielter
            Lösbarkeit – der Sonderfall für Möbel, die transportiert oder
            zerlegt werden sollen.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Die 4 Gruppen der Verbindungstechnik"
        intro="Von der handwerklichen Zinkung bis zum Möbelverbinder aus dem Beschlagkatalog – von hier aus gelangst du zu den detaillierten Steckbriefen:"
      >
        <Accordion items={gruppen} />
      </GuideSection>

      <GuideSection title="Praxistipps für Schreiner">
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Bevor du dich für eine Verbindungstechnik entscheidest, lohnt sich
          der Blick auf drei Fragen:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Welche Kraftrichtung wirkt?</strong>{" "}
            Zug-, Druck- und Scherbelastung stellen unterschiedliche
            Anforderungen. Eine reine Stirnholz-Gehrung ist auf Zug kaum
            belastbar, eine Zinkung dagegen sehr.
          </li>
          <li>
            <strong className="text-ink">Soll die Verbindung sichtbar sein?</strong>{" "}
            Zinken und Zapfen werden im Massivholzmöbelbau bewusst als
            Gestaltungsmerkmal gezeigt, während Dübel und Exzenterverbinder
            für eine glatte, verbindungslose Optik sorgen.
          </li>
          <li>
            <strong className="text-ink">Muss sich das Möbel zerlegen lassen?</strong>{" "}
            Für Transport, Serienmontage oder spätere Nachrüstung sind
            Exzenterverbinder oder Schraubverbindungen die richtige Wahl –
            für dauerhafte Stabilität ohne Demontage bleibt die Leim- oder
            Dübelverbindung überlegen.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Verbindungstechnik ist selten das, was man einem fertigen Möbelstück auf den ersten Blick ansieht – und genau deshalb wird ihre Bedeutung oft unterschätzt. Wer die Eigenschaften von Zapfen, Dübel, Beschlagverbinder und Leim genau kennt, wählt nicht nur die wirtschaftlichste, sondern auch die für den jeweiligen Einsatzzweck tragfähigste Lösung – und vermeidet teure Nacharbeit durch zu schwache oder unpassend gewählte Verbindungen."
      />
    </GuideShell>
  );
}
