import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MaschinenWerkzeugeGuide } from "./maschinen-werkzeuge-guide";

export const metadata: Metadata = {
  title: "Maschinen & Werkzeuge im Überblick",
  description:
    "Formatkreissäge, Bandsäge, Fräse, CNC-Bearbeitungszentrum und Handwerkzeuge: Aufbau, Sicherheitsnormen und Praxistipps für die Schreinerwerkstatt.",
  alternates: { canonical: "/maschinen-werkzeuge" },
};

/** Display order and heading for each `kategorie` value used in the content files. */
const CATEGORY_LABELS: [kategorie: string, heading: string][] = [
  ["Sägetechnik", "Sägetechnik"],
  ["Hobel- und Frästechnik", "Hobel- und Frästechnik"],
  ["CNC & Digitalfertigung", "CNC & Digitalfertigung"],
  ["Bohr-, Schleif- und Kantentechnik", "Bohr-, Schleif- und Kantentechnik"],
  ["Arbeitssicherheit", "Arbeitssicherheit"],
  ["Handwerkzeuge", "Handwerkzeuge"],
];

function SawBladeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 3v3M12 18v3M21 12h-3M6 12H3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </svg>
  );
}

function ShavingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19c4-1 4-5 8-6s4-5 8-6" />
      <path d="M4 13c3-.5 3-3 6-4" />
    </svg>
  );
}

function CncIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function DrillBitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6h9l4 6-4 6H4" />
      <path d="M4 6v12M9 6l3 6-3 6" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3Z" />
      <path d="m9.5 12 2 2 3.5-4" />
    </svg>
  );
}

function ChiselIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21l6-6M8 16l3-3 7-7-3-3-7 7-3 3Z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, typeof SawBladeIcon> = {
  Sägetechnik: SawBladeIcon,
  "Hobel- und Frästechnik": ShavingIcon,
  "CNC & Digitalfertigung": CncIcon,
  "Bohr-, Schleif- und Kantentechnik": DrillBitIcon,
  Arbeitssicherheit: ShieldCheckIcon,
  Handwerkzeuge: ChiselIcon,
};

export default async function MaschinenWerkzeugeIndexPage() {
  const maschinen = await getAllMeta("maschinen-werkzeuge");

  const groups = CATEGORY_LABELS.map(([kategorie, heading]) => ({
    heading,
    items: maschinen
      .filter((m) => m.kategorie === kategorie)
      .sort((a, b) => a.title.localeCompare(b.title, "de")),
  })).filter((g) => g.items.length > 0);

  const grouped = new Set(groups.flatMap((g) => g.items.map((m) => m.slug)));
  const sonstige = maschinen.filter((m) => !grouped.has(m.slug));
  if (sonstige.length > 0) {
    groups.push({
      heading: "Weitere",
      items: sonstige.sort((a, b) => a.title.localeCompare(b.title, "de")),
    });
  }

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Maschinen &amp; Werkzeuge</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {maschinen.length} Maschinen und Werkzeugen der
        Schreinerwerkstatt – Aufbau, Sicherheitsnormen, Eigenschaften und
        Praxistipps.
      </p>

      {maschinen.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Einträge veröffentlicht. Neue Einträge werden als{" "}
          <code className="font-mono text-ink">
            src/content/maschinen-werkzeuge/&lt;slug&gt;.mdx
          </code>{" "}
          angelegt (Vorlage: <code className="font-mono text-ink">_template.mdx</code>).
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((group) => {
            const Icon = CATEGORY_ICONS[group.heading];
            return (
            <section key={group.heading}>
              <h2 className="flex items-center gap-3 text-2xl">
                {Icon && (
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="size-5" />
                  </span>
                )}
                {group.heading}
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/maschinen-werkzeuge/${m.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
                    >
                      {m.bild && (
                        <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-2">
                          <Image
                            src={m.bild}
                            alt={m.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="min-w-0 break-words text-lg">{m.title}</h3>
                          {m.kurzname && (
                            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                              {m.kurzname}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-ink-muted">{m.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            );
          })}
        </div>
      )}

      <MaschinenWerkzeugeGuide />
    </Container>
  );
}
