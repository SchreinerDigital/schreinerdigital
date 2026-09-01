import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/components/tools/tools.config";

export const metadata: Metadata = {
  title: "Rechner-Tools",
  description:
    "Praxisnahe Rechner für den Schreineralltag: Plattengewicht, Türenmaß, Restlänge, Durchbiegung und Stundensatz.",
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Rechner-Tools</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Kleine Helfer für wiederkehrende Berechnungen – direkt im Browser, ohne
        Anmeldung.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="block h-full rounded-xl border border-holz-200/70 bg-holz-50/40 p-5 transition-colors hover:border-holz-400"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-holz-800">
                  {tool.title}
                </h2>
                {!tool.ready && (
                  <span className="rounded-full bg-holz-200/60 px-2 py-0.5 text-xs text-holz-800">
                    bald
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground/70">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
