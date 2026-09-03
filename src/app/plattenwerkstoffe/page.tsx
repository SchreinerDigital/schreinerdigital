import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { PlattenwerkstoffMeta } from "@/types/content";

export const metadata: Metadata = {
  title: "Plattenwerkstoffe",
  description:
    "Steckbriefe zu Holzwerkstoffplatten: Aufbau, Eigenschaften, Verwendung, Verarbeitung und technische Kennwerte – von Spanplatte bis HPL-Kompaktplatte.",
};

/** Display order + labels for the five main groups. */
const GRUPPEN = [
  {
    key: "Spanwerkstoff",
    label: "Spanwerkstoffe",
    text: "Holzspäne mit Bindemittel verpresst. Die Klassiker im Korpusbau.",
  },
  {
    key: "Faserwerkstoff",
    label: "Faserwerkstoffe",
    text: "Bis auf die Holzfaser aufgeschlossen – homogen, mit feinen Oberflächen und Kanten.",
  },
  {
    key: "Lagenwerkstoff",
    label: "Lagenwerkstoffe",
    text: "Furniere oder Massivholzstäbe kreuzweise verleimt. Hohe Stabilität bei geringem Gewicht.",
  },
  {
    key: "Verbundwerkstoff",
    label: "Verbundwerkstoffe",
    text: "Sandwich aus dünnen Deckschichten und leichtem Kern. Dick, aber sehr leicht.",
  },
  {
    key: "Schichtstoffplatte",
    label: "Schichtstoff- & Spezialplatten",
    text: "Harzgetränkte Papierlagen unter Hochdruck verpresst. Wasserfest und hygienisch.",
  },
];

const auswahl = [
  {
    titel: "Feuchtebeständigkeit",
    text: "Trocken- oder Feuchtbereich? Auf die Nutzungsklassen achten (z. B. P2 vs. P3 bei Spanplatten, IF20 vs. AW100 bei Sperrholz).",
  },
  {
    titel: "Emissionsklasse",
    text: "Der Leim bestimmt die Formaldehyd-Abgabe. E1 ist der europäische Standard; im hochwertigen Innenausbau werden E0,5 oder formaldehydfreie Platten gefordert.",
  },
  {
    titel: "Oberflächengüte",
    text: "Furniert, beschichtet oder deckend lackiert? Rohdichte und Deckschichtfeinheit entscheiden über Endergebnis und Schleifaufwand.",
  },
];

function PlatteCard({ p }: { p: PlattenwerkstoffMeta }) {
  return (
    <li>
      <Link
        href={`/plattenwerkstoffe/${p.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
          {p.bild && (
            <Image
              src={p.bild}
              alt={p.title}
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold">{p.title}</h3>
            {p.norm && (
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-faint">
                {p.norm}
              </span>
            )}
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{p.summary}</p>
        </div>
      </Link>
    </li>
  );
}

export default async function PlattenwerkstoffeIndexPage() {
  const platten = await getAllMeta("plattenwerkstoffe");

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Materialkunde</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Plattenwerkstoffe</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {platten.length} Holzwerkstoffplatten – Aufbau,
        Eigenschaften, Verwendung, Verarbeitung und technische Datentabelle.
      </p>

      {/* Grundlagen */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-2xl">Warum Plattenwerkstoffe statt Massivholz?</h2>
        <p className="mt-3 text-ink-muted">
          Massivholz arbeitet – es quillt, schwindet und wirft sich.
          Plattenwerkstoffe zerlegen das Holz in Späne, Fasern oder Furniere und
          verleimen es unter Druck und Hitze neu. Das Quell- und Schwindverhalten
          wird dadurch stark reduziert, die Platte sperrt sich in sich selbst.
          Dazu kommen riesige, fugenlose Formate und eine effiziente Nutzung von
          Rest- und Durchforstungsholz.
        </p>
        <p className="mt-3 text-ink-muted">
          Eingeteilt werden sie nach der Größe ihrer Holzbestandteile – von der
          Faser bis zur Massivholzlage:
        </p>
        <ul className="mt-4 space-y-2">
          {GRUPPEN.map((g) => (
            <li key={g.key} className="text-sm">
              <span className="font-medium text-ink">{g.label}: </span>
              <span className="text-ink-muted">{g.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Material groups */}
      {platten.length === 0 ? (
        <p className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Plattenwerkstoffe veröffentlicht.
        </p>
      ) : (
        GRUPPEN.map((g) => {
          const items = platten.filter((p) => p.kategorie === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key} className="mt-16">
              <h2 className="flex items-baseline gap-3 text-2xl">
                {g.label}
                <span className="font-mono text-sm text-ink-faint">
                  {items.length}
                </span>
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p) => (
                  <PlatteCard key={p.slug} p={p} />
                ))}
              </ul>
            </section>
          );
        })
      )}

      {/* Auswahl-Praxistipps */}
      <section className="mt-20 rounded-[var(--radius)] border border-border bg-surface p-6 sm:p-8">
        <Eyebrow>Praxistipps</Eyebrow>
        <h2 className="mt-4 text-2xl">Die richtige Platte auswählen</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {auswahl.map((a) => (
            <div key={a.titel}>
              <h3 className="text-sm font-semibold text-ink">{a.titel}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
