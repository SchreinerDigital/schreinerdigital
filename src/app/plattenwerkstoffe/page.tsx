import type { Metadata } from "next";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plattenwerkstoffe",
  description:
    "Steckbriefe zu Plattenwerkstoffen: Aufbau, Eigenschaften, Verwendung und Verarbeitungshinweise.",
};

export default async function PlattenwerkstoffeIndexPage() {
  const platten = await getAllMeta("plattenwerkstoffe");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Plattenwerkstoffe</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Steckbriefe zu Holzwerkstoffplatten. Die Inhalte werden Schritt für
        Schritt ergänzt.
      </p>

      {platten.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-holz-300 p-6 text-sm text-foreground/60">
          Noch keine Plattenwerkstoffe erfasst. Neue Einträge als
          <code className="mx-1 font-mono">
            src/content/plattenwerkstoffe/&lt;slug&gt;.mdx
          </code>
          anlegen (Vorlage: <code className="font-mono">_template.mdx</code>).
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {platten.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/plattenwerkstoffe/${p.slug}`}
                className="block rounded-xl border border-holz-200/70 bg-holz-50/40 p-5 transition-colors hover:border-holz-400"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold text-holz-800">
                    {p.title}
                  </h2>
                  {p.kategorie && (
                    <span className="text-xs text-foreground/50">
                      {p.kategorie}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground/70">{p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
