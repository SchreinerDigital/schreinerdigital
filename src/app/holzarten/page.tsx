import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HolzartenGuide } from "./holzarten-guide";

export const metadata: Metadata = {
  title: "Holzarten-Lexikon",
  description:
    "Massivholz-Lexikon für die Werkstatt: Herkunft, Holzbild, Rohdichte, Festigkeit und Verarbeitungstipps – von Ahorn bis Zwetschge.",
  alternates: { canonical: "/holzarten" },
};

export default async function HolzartenIndexPage() {
  const holzarten = await getAllMeta("holzarten");

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Materialkunde</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Holzarten</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu {holzarten.length} Massivhölzern – jeweils mit Herkunft,
        Holzbild, Eigenschaften, Verwendung, Praxistipps und technischer
        Datentabelle.
      </p>

      {holzarten.length === 0 ? (
        <p className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Holzarten veröffentlicht.
        </p>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holzarten.map((h) => (
            <li key={h.slug}>
              <Link
                href={`/holzarten/${h.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-colors hover:border-accent"
              >
                {h.bild && (
                  <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-2">
                    <Image
                      src={h.bild}
                      alt={h.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-lg">{h.title}</h2>
                    {h.gruppe && (
                      <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                        {h.gruppe}
                      </span>
                    )}
                  </div>
                  {h.botanical && (
                    <p className="mt-0.5 text-sm italic text-ink-faint">
                      {h.botanical}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-ink-muted">{h.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <HolzartenGuide />
    </Container>
  );
}
