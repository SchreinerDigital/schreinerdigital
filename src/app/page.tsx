import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { tools } from "@/components/tools/tools.config";
import { getAllMeta } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Materialkunde und kostenlose Rechner für die Schreinerei: Steckbriefe zu Holzarten, Plattenwerkstoffen, Verbindungstechnik, Beschlägen und Oberflächen – praxisnah und ohne Anmeldung.",
  alternates: { canonical: "/" },
};

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

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5v-12Z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5v-12Z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v3h3" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function ChipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v18M7 21h10M5 7h5M14 7h5" />
      <path d="M5 7 2.5 12a2.5 2.5 0 0 0 5 0L5 7ZM19 7l-2.5 5a2.5 2.5 0 0 0 5 0L19 7Z" />
    </svg>
  );
}

function CubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 3 8v8l9 5 9-5V8l-9-5Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  );
}

const pillars = [
  {
    href: "/tools",
    title: "Rechner-Tools",
    cta: "Zu den Tools",
    icon: SquareToolIcon,
    body: "Praktische Rechner für die Werkstatt.",
  },
  {
    href: "/holzarten",
    title: "Schreinerwissen",
    cta: "Zum Wissen",
    icon: BookIcon,
    body: "Fachwissen zu Holz, Platten, Verbindungen & mehr.",
  },
  {
    href: "/vorlagen",
    title: "Vorlagen & Downloads",
    cta: "Zu den Vorlagen",
    icon: DocumentIcon,
    body: "Aufmaßblätter, Checklisten und mehr.",
  },
  {
    href: "/digitalisierung",
    title: "Digitalisierung",
    cta: "Mehr erfahren",
    icon: ChipIcon,
    body: "Aufmaß, Kalkulation und Planung digitalisieren.",
  },
  {
    href: "/betrieb-und-recht",
    title: "Betrieb & Recht",
    cta: "Zum Überblick",
    icon: ScaleIcon,
    body: "Gewährleistung, Meisterpflicht, Datenschutz & mehr.",
  },
  {
    href: "/cad",
    title: "CAD-Vorlagen",
    cta: "Zu den CAD-Vorlagen",
    icon: CubeIcon,
    body: "2D-Zeichenvorlagen im DWG-Format.",
  },
];

const trust = [
  "100 % kostenlos starten",
  "Praxisnah & sofort einsetzbar",
  "Für Schreiner von Schreiner",
  "Keine Anmeldung nötig",
];

/** Zahlen kommen aus dem tatsächlichen Inhalt, damit sie nicht veralten. */
async function getStats() {
  const [holzarten, platten, verbindungen, beschlaege, oberflaechen] =
    await Promise.all([
      getAllMeta("holzarten"),
      getAllMeta("plattenwerkstoffe"),
      getAllMeta("verbindungstechnik"),
      getAllMeta("beschlaege"),
      getAllMeta("oberflaechen"),
    ]);
  const steckbriefe =
    holzarten.length +
    platten.length +
    verbindungen.length +
    beschlaege.length +
    oberflaechen.length;

  return [
    { icon: LayersIcon, value: String(steckbriefe), label: "Steckbriefe gesamt" },
    { icon: TreeRingsIcon, value: String(holzarten.length), label: "Holzarten im Detail" },
    { icon: SquareToolIcon, value: String(tools.length), label: "Rechner-Tools" },
    { icon: CheckIcon, value: "100 %", label: "Kostenlos nutzbar" },
  ];
}

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

export default async function HomePage() {
  const stats = await getStats();

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
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="max-w-xl">
            <Eyebrow>Handwerk trifft Präzision</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.05] font-bold text-balance text-ink sm:text-5xl lg:text-6xl">
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
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-ink-muted">
                <CheckIcon className="size-4 shrink-0 text-accent" />
                {t}
              </li>
            ))}
          </ul>
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
      <Container className="py-14">
        <Eyebrow>Überblick</Eyebrow>
        <h2 className="mt-4 text-3xl">Alles für deinen Arbeitsalltag</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Rechner, Fachwissen, Vorlagen und mehr – die wichtigsten Bereiche von
          schreiner.digital auf einen Blick.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-snug text-ink-muted">
                {p.body}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                {p.cta}
                <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
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
