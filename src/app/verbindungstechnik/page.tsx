import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { VerbindungstechnikGuide } from "./verbindungstechnik-guide";

export const metadata: Metadata = {
  title: "Verbindungstechnik",
  description:
    "Steckbriefe zu Holzverbindungen: Aufbau, Eigenschaften, Verwendung und Verarbeitungshinweise.",
  alternates: { canonical: "/verbindungstechnik" },
};

/** Display order and heading for each `kategorie` value used in the content files. */
const CATEGORY_LABELS: [kategorie: string, heading: string][] = [
  ["Traditionelle Holzverbindung", "Traditionelle Holzverbindungen"],
  ["Dübeltechnik", "Dübeltechnik"],
  ["Beschlagverbindung", "Beschlagverbindungen"],
  ["Schraub- und Klebeverbindung", "Schraub- & Klebeverbindungen"],
];

export default async function VerbindungstechnikIndexPage() {
  const verbindungen = await getAllMeta("verbindungstechnik");

  const groups = CATEGORY_LABELS.map(([kategorie, heading]) => ({
    heading,
    items: verbindungen
      .filter((v) => v.kategorie === kategorie)
      .sort((a, b) => a.title.localeCompare(b.title, "de")),
  })).filter((g) => g.items.length > 0);

  const grouped = new Set(groups.flatMap((g) => g.items.map((v) => v.slug)));
  const sonstige = verbindungen.filter((v) => !grouped.has(v.slug));
  if (sonstige.length > 0) {
    groups.push({
      heading: "Weitere",
      items: sonstige.sort((a, b) => a.title.localeCompare(b.title, "de")),
    });
  }

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Verbindungstechnik</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {verbindungen.length} Holzverbindungen – Aufbau,
        Eigenschaften, Verwendung, Verarbeitung und technische Datentabelle.
      </p>

      {verbindungen.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Verbindungstechniken veröffentlicht. Neue Einträge werden
          als{" "}
          <code className="font-mono text-ink">
            src/content/verbindungstechnik/&lt;slug&gt;.mdx
          </code>{" "}
          angelegt (Vorlage: <code className="font-mono text-ink">_template.mdx</code>).
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className="text-2xl">{group.heading}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((v) => (
                  <li key={v.slug}>
                    <Link
                      href={`/verbindungstechnik/${v.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
                    >
                      {v.bild && (
                        <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-2">
                          <Image
                            src={v.bild}
                            alt={v.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-lg">{v.title}</h3>
                          {v.kurzname && (
                            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                              {v.kurzname}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-ink-muted">{v.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <VerbindungstechnikGuide />
    </Container>
  );
}
