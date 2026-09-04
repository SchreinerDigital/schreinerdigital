import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { RulerBar } from "@/components/brand/wordmark";
import { tools } from "@/components/tools/tools.config";

function TreeRingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="4" rx="1" />
      <rect x="3" y="10.5" width="18" height="4" rx="1" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  );
}

function SquareToolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4v16h16" />
      <path d="M4 4h6M4 8h3M4 12h3M4 16h3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  );
}

const pillars = [
  {
    href: "/holzarten",
    title: "Holzarten",
    icon: TreeRingsIcon,
    body: "Steckbriefe zu Massivhölzern – Herkunft, Holzbild, Eigenschaften, Verwendung, Praxistipps und technische Kennwerte auf einen Blick.",
  },
  {
    href: "/plattenwerkstoffe",
    title: "Plattenwerkstoffe",
    icon: LayersIcon,
    body: "Span-, MDF-, OSB-, Multiplex- und Tischlerplatten: Aufbau, Einsatzgrenzen und Hinweise für die saubere Verarbeitung.",
  },
  {
    href: "/tools",
    title: "Rechner-Tools",
    icon: SquareToolIcon,
    body: "Wiederkehrende Berechnungen aus dem Werkstattalltag – direkt im Browser, ohne Anmeldung, ohne Excel-Gefummel.",
  },
];

const trust = ["Zeit sparen", "Fehler vermeiden", "Sauber kalkulieren"];

const stats = [
  { icon: TreeRingsIcon, value: "43", label: "Holzarten im Detail" },
  { icon: LayersIcon, value: "13", label: "Plattenwerkstoffe" },
  { icon: SquareToolIcon, value: "5", label: "Rechner-Tools" },
  { icon: CheckIcon, value: "100 %", label: "Kostenlos, ohne Anmeldung" },
];

const toolExamples: Record<string, string> = {
  plattengewicht: "71,6 kg",
  tuerenmass: "860 × 1985 mm",
  restlaenge: "47,1 m",
  durchbiegung: "2,38 mm",
  stundensatz: "64,15 €/h",
};

const specPreview = [
  ["Rohdichte (12–15%)", "0,65–0,76 g/cm³"],
  ["Druckfestigkeit", "42–64 N/mm²"],
  ["Biegefestigkeit", "60–110 N/mm²"],
  ["Elastizitätsmodul", "10.000–14.500 N/mm²"],
  ["Härte (Brinell)", "23–42 N/mm²"],
  ["Dauerhaftigkeit", "Klasse 2-4"],
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
                  <CheckIcon className="size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius)] border border-border">
              <Image
                src="/hero-workshop.jpg"
                alt="Digitale Möbelplanung am Laptop, im Hintergrund eine Schreinerwerkstatt mit CNC-Maschine"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 100vw"
              />
            </div>

            {/* Decorative spec sheet – floats over the photo on larger screens */}
            <div className="absolute -bottom-6 -right-6 hidden w-72 lg:block">
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
          </div>
        </Container>
      </section>

      {/* Stats */}
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 bg-surface px-4 py-6 text-center">
              <s.icon className="size-5 text-accent" />
              <span className="font-display text-2xl font-bold text-ink">{s.value}</span>
              <span className="text-xs text-ink-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>

      {/* Pillars */}
      <Container className="py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <p.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-xl">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                {p.body}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Zu {p.title}
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
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
                className="group flex h-full flex-col rounded-lg border border-border bg-paper p-4 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tool.title}</span>
                  {!tool.ready && <Badge>bald</Badge>}
                </div>
                <p className="mt-1 flex-1 text-sm text-ink-muted">
                  {tool.description}
                </p>
                {toolExamples[tool.slug] && (
                  <div className="mt-3 flex items-baseline justify-between rounded-md border border-border bg-surface px-3 py-2">
                    <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
                      Beispiel
                    </span>
                    <span className="font-mono text-sm font-semibold text-accent">
                      {toolExamples[tool.slug]}
                    </span>
                  </div>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink-faint transition-colors group-hover:text-accent">
                  Öffnen
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-xl text-3xl">
            Bereit für präziseres Arbeiten?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            Alle Rechner und Steckbriefe sind kostenlos, ohne Anmeldung und
            direkt im Browser nutzbar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/tools" size="lg">
              Rechner ausprobieren
              <ArrowIcon className="size-4" />
            </ButtonLink>
            <ButtonLink href="/holzarten" size="lg" variant="secondary">
              Schreinerwissen entdecken
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
