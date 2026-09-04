import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { OberflaechenGuide } from "./oberflaechen-guide";

export const metadata: Metadata = {
  title: "Oberflächen",
  description:
    "Steckbriefe zu Oberflächenbehandlungen: Zusammensetzung, Eigenschaften, Verwendung und Verarbeitungshinweise.",
  alternates: { canonical: "/oberflaechen" },
};

/** Display order and heading for each `kategorie` value used in the content files. */
const CATEGORY_LABELS: [kategorie: string, heading: string][] = [
  ["Öle und Wachse", "Öle & Wachse"],
  ["Lacke", "Lacke"],
  ["Beizen und Lasuren", "Beizen & Lasuren"],
];

export default async function OberflaechenIndexPage() {
  const oberflaechen = await getAllMeta("oberflaechen");

  const groups = CATEGORY_LABELS.map(([kategorie, heading]) => ({
    heading,
    items: oberflaechen
      .filter((o) => o.kategorie === kategorie)
      .sort((a, b) => a.title.localeCompare(b.title, "de")),
  })).filter((g) => g.items.length > 0);

  const grouped = new Set(groups.flatMap((g) => g.items.map((o) => o.slug)));
  const sonstige = oberflaechen.filter((o) => !grouped.has(o.slug));
  if (sonstige.length > 0) {
    groups.push({
      heading: "Weitere",
      items: sonstige.sort((a, b) => a.title.localeCompare(b.title, "de")),
    });
  }

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Oberflächen</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {oberflaechen.length} Oberflächenbehandlungen –
        Zusammensetzung, Eigenschaften, Verwendung, Verarbeitung und
        technische Datentabelle.
      </p>

      {oberflaechen.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Oberflächen veröffentlicht. Neue Einträge werden als{" "}
          <code className="font-mono text-ink">
            src/content/oberflaechen/&lt;slug&gt;.mdx
          </code>{" "}
          angelegt (Vorlage: <code className="font-mono text-ink">_template.mdx</code>).
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className="text-2xl">{group.heading}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/oberflaechen/${o.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
                    >
                      {o.bild && (
                        <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-2">
                          <Image
                            src={o.bild}
                            alt={o.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-lg">{o.title}</h3>
                          {o.kurzname && (
                            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                              {o.kurzname}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-ink-muted">{o.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <OberflaechenGuide />
    </Container>
  );
}
