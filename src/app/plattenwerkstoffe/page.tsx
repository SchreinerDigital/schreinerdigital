import type { Metadata } from "next";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Plattenwerkstoffe",
  description:
    "Steckbriefe zu Plattenwerkstoffen: Aufbau, Eigenschaften, Verwendung und Verarbeitungshinweise.",
};

export default async function PlattenwerkstoffeIndexPage() {
  const platten = await getAllMeta("plattenwerkstoffe");

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Materialkunde</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Plattenwerkstoffe</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Steckbriefe zu Holzwerkstoffplatten – Aufbau, Eigenschaften, Einsatz und
        Verarbeitung. Die Inhalte kommen Schritt für Schritt dazu.
      </p>

      {platten.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
          Noch keine Plattenwerkstoffe veröffentlicht. Neue Einträge werden als{" "}
          <code className="font-mono text-ink">
            src/content/plattenwerkstoffe/&lt;slug&gt;.mdx
          </code>{" "}
          angelegt (Vorlage: <code className="font-mono text-ink">_template.mdx</code>).
        </div>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platten.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/plattenwerkstoffe/${p.slug}`}
                className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg">{p.title}</h2>
                  {p.kategorie && (
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                      {p.kategorie}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-ink-muted">{p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
