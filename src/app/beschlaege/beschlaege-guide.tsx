import Link from "next/link";
import { Accordion, GuideSection, GuideShell } from "@/components/tools/guide";

function BeschlagList({ items }: { items: { name: string; slug?: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.name}>
          {item.slug ? (
            <Link
              href={`/beschlaege/${item.slug}`}
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
    title: "1. Scharniere",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Bewegliche Verbindung zwischen Tür und Korpus – vom unsichtbaren
          Topfscharnier bis zum durchgehenden Stangenscharnier für schwere
          Klappen.
        </p>
        <BeschlagList
          items={[
            { name: "Topfscharnier", slug: "topfscharnier" },
            { name: "Stangenscharnier", slug: "stangenscharnier" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Möbeltüren,
          Klappen, Deckel, Truhen.
        </p>
      </div>
    ),
  },
  {
    title: "2. Auszüge",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Führungssysteme für Schubladen – von der einfachen Rollenschiene
          bis zum vorgefertigten Systemschubkasten mit voller Auszugstiefe.
        </p>
        <BeschlagList
          items={[
            { name: "Vollauszug (Kugelführung)", slug: "vollauszug" },
            { name: "Systemschubkasten", slug: "systemschubkasten" },
            { name: "Rollenauszug", slug: "rollenauszug" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Küchen-, Bad- und
          Büromöbel mit Schubladen.
        </p>
      </div>
    ),
  },
  {
    title: "3. Griffe & Bedienelemente",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Die täglich berührte Schnittstelle zum Möbel – klassisch mit
          Griff oder komplett grifflos per Antippen.
        </p>
        <BeschlagList
          items={[
            { name: "Möbelgriff", slug: "moebelgriff" },
            { name: "Push-to-Open-Beschlag", slug: "push-to-open" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> alle sichtbaren
          Fronten, grifflose Küchen- und Badmöbel.
        </p>
      </div>
    ),
  },
  {
    title: "4. Funktionsbeschläge",
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        <p>
          Kleine Bauteile mit großer Wirkung: Sie dämpfen, tragen und
          nivellieren, ohne selbst im Vordergrund zu stehen.
        </p>
        <BeschlagList
          items={[
            { name: "Türdämpfer", slug: "tuerdaempfer" },
            { name: "Regalbodenträger", slug: "regalbodentraeger" },
            { name: "Stellfuß", slug: "stellfuss" },
          ]}
        />
        <p>
          <strong className="text-ink">Einsatz:</strong> Fachböden,
          Türdämpfung, Sockelausgleich bei Küchen- und Badmöbeln.
        </p>
      </div>
    ),
  },
];

export function BeschlaegeGuide() {
  return (
    <GuideShell>
      <GuideSection
        title="Beschläge: Klein, aber entscheidend für Komfort und Lebensdauer"
        intro="Ein Beschlag wird selten bewusst wahrgenommen – bis er fehlt, klemmt oder zu früh verschleißt. Die richtige Wahl entscheidet darüber, ob sich ein Möbelstück über Jahre hinweg leichtgängig und zuverlässig bedienen lässt oder schon nach kurzer Zeit hakt und wackelt."
      >
        <h3 className="mt-6 font-semibold text-ink">Worauf es bei der Auswahl ankommt</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Belastung:</strong> Tragkraftangaben
            von Scharnieren und Auszügen beziehen sich auf den Dauerbetrieb –
            bei häufig genutzten oder schwer beladenen Elementen lohnt sich
            eine Reserve nach oben.
          </li>
          <li>
            <strong className="text-ink">Verstellbarkeit:</strong> Gute
            Beschläge lassen sich nach der Montage noch justieren (Scharniere
            3-fach, Systemschubkästen in Front und Höhe) – das gleicht
            Fertigungstoleranzen aus, ohne neu zu bohren.
          </li>
          <li>
            <strong className="text-ink">Rastermaß:</strong> Die meisten
            Beschlagbohrungen folgen dem 32-mm-System – wer sich daran hält,
            kann Scharniere, Griffe und Regalbodenträger mit denselben
            Bohrschablonen setzen.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Die 4 Gruppen der Beschlagtechnik"
        intro="Von der Scharnierauswahl bis zum Stellfuß – von hier aus gelangst du zu den detaillierten Steckbriefen:"
      >
        <Accordion items={gruppen} />
      </GuideSection>

      <GuideSection title="Praxistipps für Schreiner">
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Kompatibilität vor Preis:</strong>{" "}
            Systemschubkästen, Exzenterverbinder und viele Auszugssysteme
            sind zwischen Herstellern selten kompatibel – Zubehör und
            Ersatzteile möglichst vom selben Hersteller planen.
          </li>
          <li>
            <strong className="text-ink">Ein Lochraster für alles:</strong>{" "}
            Scharnier-Montageplatten, Regalbodenträger und Exzenterverbinder
            im selben 32-mm-Raster setzen – spart eine zweite Bohrschablone
            und hält die Optik einheitlich.
          </li>
          <li>
            <strong className="text-ink">Dämpfung nachrüsten statt neu
            kaufen:</strong> Viele einfache Scharniere und Auszüge lassen
            sich mit separaten Türdämpfern nachrüsten, statt das ganze
            Beschlagsystem gegen eine gedämpfte Variante zu tauschen.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Fazit"
        intro="Beschläge entscheiden über den gefühlten Qualitätseindruck eines Möbelstücks oft stärker als das Material selbst. Wer bei Scharnieren, Auszügen und Griffen auf geprüfte Belastungsklassen, sauberes Rastermaß und passende Dämpfung achtet, spart sich spätere Nachbesserungen und liefert Möbel, die sich über Jahre hinweg leichtgängig anfühlen."
      />
    </GuideShell>
  );
}
