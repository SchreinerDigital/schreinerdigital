import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/components/tools/tools.config";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Rechner-Tools",
  description:
    "Praxisnahe Rechner für den Schreineralltag: Plattengewicht, Türenmaß, Restlänge, Durchbiegung und Stundensatz.",
  alternates: { canonical: "/tools" },
};

export default function ToolsIndexPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Werkstatt</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Rechner-Tools</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Kleine Helfer für wiederkehrende Berechnungen – direkt im Browser, ohne
        Anmeldung.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg">{tool.title}</h2>
                {tool.ready ? (
                  <Badge tone="accent">live</Badge>
                ) : (
                  <Badge>bald</Badge>
                )}
              </div>
              <p className="mt-3 text-sm text-ink-muted">{tool.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
