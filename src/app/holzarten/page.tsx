import type { Metadata } from "next";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Holzarten",
  description:
    "Steckbriefe zu Massivhölzern: Herkunft, Holzbild, Eigenschaften, Verwendung, Praxistipps und technische Kennwerte.",
};

export default async function HolzartenIndexPage() {
  const holzarten = await getAllMeta("holzarten");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Holzarten</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Steckbriefe zu Massivhölzern. Die Inhalte werden Schritt für Schritt
        ergänzt.
      </p>

      {holzarten.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-holz-300 p-6 text-sm text-foreground/60">
          Noch keine Holzarten erfasst. Neue Einträge als
          <code className="mx-1 font-mono">
            src/content/holzarten/&lt;slug&gt;.mdx
          </code>
          anlegen (Vorlage: <code className="font-mono">_template.mdx</code>).
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {holzarten.map((h) => (
            <li key={h.slug}>
              <Link
                href={`/holzarten/${h.slug}`}
                className="block rounded-xl border border-holz-200/70 bg-holz-50/40 p-5 transition-colors hover:border-holz-400"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold text-holz-800">
                    {h.title}
                  </h2>
                  {h.gruppe && (
                    <span className="text-xs text-foreground/50">{h.gruppe}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground/70">{h.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
