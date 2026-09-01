import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { RulerBar } from "@/components/brand/wordmark";
import { tools } from "@/components/tools/tools.config";

const pillars = [
  {
    href: "/holzarten",
    title: "Holzarten",
    body: "Steckbriefe zu Massivhölzern – Herkunft, Holzbild, Eigenschaften, Verwendung, Praxistipps und technische Kennwerte auf einen Blick.",
  },
  {
    href: "/plattenwerkstoffe",
    title: "Plattenwerkstoffe",
    body: "Span-, MDF-, OSB-, Multiplex- und Tischlerplatten: Aufbau, Einsatzgrenzen und Hinweise für die saubere Verarbeitung.",
  },
  {
    href: "/tools",
    title: "Rechner-Tools",
    body: "Wiederkehrende Berechnungen aus dem Werkstattalltag – direkt im Browser, ohne Anmeldung, ohne Excel-Gefummel.",
  },
];

const trust = ["Zeit sparen", "Fehler vermeiden", "Sauber kalkulieren"];

const specPreview = [
  ["Rohdichte r12–15", "0,65–0,75 g/cm³"],
  ["Druckfestigkeit ∥", "52 N/mm²"],
  ["Biegefestigkeit", "95 N/mm²"],
  ["Brinellhärte ⟂", "34 N/mm²"],
  ["Dauerhaftigkeit", "Klasse 2"],
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 ruler-ticks-lg opacity-60"
        />
        <Container className="grid items-center gap-12 pt-16 pb-14 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24 lg:pb-16">
          <div>
            <Eyebrow>Handwerk trifft Präzision</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Wissen und Werkzeuge für die{" "}
              <span className="text-accent">Schreinerei</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted">
              schreiner.digital bündelt fundierte Materialkunde und praxisnahe
              Rechner an einem Ort – für Meister, Gesellen und Auszubildende, die
              präziser planen und schneller fertigen wollen.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/tools" size="lg">
                Rechner ausprobieren
                <ArrowIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="/holzarten" size="lg" variant="secondary">
                Holzarten ansehen
              </ButtonLink>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-accent/70" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative spec sheet */}
          <div className="relative hidden lg:block">
            <div className="rounded-[var(--radius)] border border-border bg-surface shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_40px_-12px_rgba(60,40,20,0.15)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                  Datenblatt
                </span>
                <span className="font-display text-sm font-bold">Eiche</span>
              </div>
              <dl className="divide-y divide-border">
                {specPreview.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                  >
                    <dt className="text-sm text-ink-muted">{k}</dt>
                    <dd className="font-mono text-sm tabular-nums text-ink">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="px-5 pb-4 pt-2">
                <RulerBar className="h-2.5 text-border-strong" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <Container className="py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <h2 className="flex items-center justify-between text-xl">
                {p.title}
                <ArrowIcon className="size-5 text-ink-faint transition-colors group-hover:text-accent" />
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {p.body}
              </p>
            </Link>
          ))}
        </div>
      </Container>

      {/* Tools strip */}
      <section className="border-y border-border bg-surface">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Rechner</Eyebrow>
              <h2 className="mt-4 text-3xl">Fünf Helfer für den Alltag</h2>
            </div>
            <Link
              href="/tools"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover sm:flex"
            >
              Alle Rechner <ArrowIcon className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-paper p-4 transition-colors hover:border-accent"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool.title}</span>
                    {!tool.ready && <Badge>bald</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">
                    {tool.description}
                  </p>
                </div>
                <ArrowIcon className="mt-0.5 size-4 shrink-0 text-ink-faint transition-colors group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Roadmap / honest status */}
      <Container className="py-16">
        <Eyebrow>Im Aufbau</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl">
          Die Seite wächst Schritt für Schritt
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Das Grundgerüst steht. Als Nächstes kommen die ersten Holzarten-
          Steckbriefe, die übrigen Rechner sowie Nutzerkonten für gespeicherte
          Berechnungen.
        </p>
      </Container>
    </>
  );
}
