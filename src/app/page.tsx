import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
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

function HingeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <rect x="14" y="3" width="7" height="18" rx="1.5" />
      <circle cx="12" cy="7" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="12" cy="17" r="1.3" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3.5s6.5 7.1 6.5 11.3a6.5 6.5 0 1 1-13 0c0-4.2 6.5-11.3 6.5-11.3z" />
    </svg>
  );
}

function JointIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="6" width="8.5" height="12" rx="1" />
      <rect x="13.5" y="6" width="8.5" height="12" rx="1" />
      <rect x="9.5" y="10.5" width="5" height="3" rx="0.8" />
    </svg>
  );
}

const pillars = [
  {
    href: "/holzarten",
    title: "Holzarten",
    icon: TreeRingsIcon,
    body: "Steckbriefe zu Massivhölzern – Herkunft, Holzbild, Eigenschaften, Verwendung, Praxistipps und technische Kennwerte auf einen Blick.",
    comingSoon: false,
  },
  {
    href: "/plattenwerkstoffe",
    title: "Plattenwerkstoffe",
    icon: LayersIcon,
    body: "Span-, MDF-, OSB-, Multiplex- und Tischlerplatten: Aufbau, Einsatzgrenzen und Hinweise für die saubere Verarbeitung.",
    comingSoon: false,
  },
  {
    href: "/tools",
    title: "Rechner-Tools",
    icon: SquareToolIcon,
    body: "Wiederkehrende Berechnungen aus dem Werkstattalltag – direkt im Browser, ohne Anmeldung, ohne Excel-Gefummel.",
    comingSoon: false,
  },
  {
    href: "/verbindungstechnik",
    title: "Verbindungstechnik",
    icon: JointIcon,
    body: "Dübel, Lamello, Schrauben und Klebstoffe – welche Verbindung für welchen Einsatzzweck die richtige Wahl ist.",
    comingSoon: false,
  },
  {
    href: "/beschlaege",
    title: "Beschläge",
    icon: HingeIcon,
    body: "Scharniere, Griffe und Auszüge im Überblick – Einbaumaße, Belastbarkeit und Auswahlhilfen für die Praxis.",
    comingSoon: false,
  },
  {
    href: "/oberflaechen",
    title: "Oberflächen",
    icon: DropletIcon,
    body: "Öle, Lacke, Wachse und Beizen im Vergleich – Wirkung, Verarbeitung und Pflege für ein sauberes Finish.",
    comingSoon: false,
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
      {/* Hero – forced dark (via the `dark` class) regardless of the site theme,
          since the photo needs a dark scrim for the overlaid text to stay legible. */}
      <section className="dark relative isolate overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-workshop.jpg"
            alt="Laptop mit 3D-Möbelentwurf auf einem Werkstatttisch, umgeben von Holzmustern und Skizzenbüchern, im Hintergrund eine Schreinerwerkstatt mit Werkzeugwand"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper from-15% via-paper/80 via-45% to-transparent to-85%" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 ruler-ticks-lg opacity-60"
        />
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="max-w-xl">
            <Eyebrow>Handwerk trifft Präzision</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.05] text-balance text-ink sm:text-5xl lg:text-6xl">
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
        <Eyebrow>Schreinerwissen</Eyebrow>
        <h2 className="mt-4 text-3xl">Alles für deinen Arbeitsalltag</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) =>
            p.comingSoon ? (
              <div
                key={p.title}
                className="flex h-full flex-col rounded-[var(--radius)] border border-dashed border-border bg-surface/60 p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-surface-2 text-ink-faint">
                  <p.icon className="size-5" />
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-xl text-ink-muted">{p.title}</h3>
                  <Badge>bald</Badge>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">
                  {p.body}
                </p>
              </div>
            ) : (
              <Link
                key={p.title}
                href={p.href}
                className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-xl">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {p.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Zu {p.title}
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ),
          )}
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

      {/* Newsletter */}
      <section className="border-t border-border bg-surface">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <Eyebrow>Newsletter</Eyebrow>
            <h2 className="mt-4 text-3xl">Neue Vorlagen &amp; Tools zuerst erfahren</h2>
            <p className="mt-4 text-ink-muted">
              Kein Spam – nur neue Rechner, Steckbriefe und kostenlose
              Vorlagen direkt ins Postfach, sobald es etwas Neues gibt.
            </p>
          </div>
          <NewsletterForm source="homepage" className="mx-auto mt-7 max-w-md" />
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
