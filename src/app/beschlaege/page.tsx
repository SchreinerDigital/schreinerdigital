import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BeschlaegeGuide } from "./beschlaege-guide";

export const metadata: Metadata = {
  title: "Möbelbeschläge im Überblick",
  description:
    "Topfscharniere, Auszüge, Griffe und Funktionsbeschläge: Einbaumaße, Tragkraft, Bohrbilder und Auswahlhilfen für den Möbelbau.",
  alternates: { canonical: "/beschlaege" },
};

/** Display order and heading for each `kategorie` value used in the content files. */
const CATEGORY_LABELS: [kategorie: string, heading: string][] = [
  ["Scharniere", "Scharniere"],
  ["Auszüge", "Auszüge"],
  ["Griffe und Bedienelemente", "Griffe & Bedienelemente"],
  ["Funktionsbeschläge", "Funktionsbeschläge"],
];

export default async function BeschlaegeIndexPage() {
  const beschlaege = await getAllMeta("beschlaege");

  const groups = CATEGORY_LABELS.map(([kategorie, heading]) => ({
    heading,
    items: beschlaege
      .filter((b) => b.kategorie === kategorie)
      .sort((a, b) => a.title.localeCompare(b.title, "de")),
  })).filter((g) => g.items.length > 0);

  const grouped = new Set(groups.flatMap((g) => g.items.map((b) => b.slug)));
  const sonstige = beschlaege.filter((b) => !grouped.has(b.slug));
  if (sonstige.length > 0) {
    groups.push({
      heading: "Weitere",
      items: sonstige.sort((a, b) => a.title.localeCompare(b.title, "de")),
    });
  }

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Beschläge</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {beschlaege.length} Möbelbeschlägen – Aufbau,
        Eigenschaften, Verwendung, Montage und technische Datentabelle.
      </p>

      {beschlaege.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Beschläge veröffentlicht. Neue Einträge werden als{" "}
          <code className="font-mono text-ink">
            src/content/beschlaege/&lt;slug&gt;.mdx
          </code>{" "}
          angelegt (Vorlage: <code className="font-mono text-ink">_template.mdx</code>).
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className="text-2xl">{group.heading}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/beschlaege/${b.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
                    >
                      {b.bild && (
                        <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-2">
                          <Image
                            src={b.bild}
                            alt={b.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-lg">{b.title}</h3>
                          {b.kurzname && (
                            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                              {b.kurzname}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-ink-muted">{b.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <BeschlaegeGuide />
    </Container>
  );
}
