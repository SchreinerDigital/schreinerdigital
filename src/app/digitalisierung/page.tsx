import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Digitalisierung im Schreinerhandwerk",
  description:
    "CAD/CAM-Software, Kalkulationsprogramme, digitale Aufmaß-Apps und die E-Rechnungspflicht – ein Überblick für Schreinereien und Tischlereien.",
  alternates: { canonical: "/digitalisierung" },
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const artikel = [
  {
    href: "/digitalisierung/cad-cam-software",
    titel: "CAD/CAM-Software für Schreiner",
    text: "Welche 3D-CAD- und CAM-Programme es für Möbel- und Innenausbauplanung gibt und wodurch sie sich unterscheiden.",
  },
  {
    href: "/digitalisierung/kalkulationssoftware",
    titel: "Kalkulations- und Auftragssoftware",
    text: "Von der Angebotserstellung bis zur Rechnung: Branchensoftware für Kalkulation, Auftragsverwaltung und Buchhaltung im Überblick.",
  },
  {
    href: "/digitalisierung/aufmass-apps",
    titel: "Digitale Aufmaß-Apps",
    text: "Wie Laser-Messgeräte und Apps das Aufmaß vor Ort beschleunigen – und wo sie sich direkt in die Auftragssoftware einbinden lassen.",
  },
  {
    href: "/digitalisierung/e-rechnung",
    titel: "E-Rechnungspflicht",
    text: "Was seit 2025 im Geschäftsverkehr zwischen Unternehmen gilt, welche Formate erlaubt sind und welche Übergangsfristen es gibt.",
  },
];

export default function DigitalisierungPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Digitalisierung im Schreinerhandwerk</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Software und Werkzeuge, mit denen sich Planung, Kalkulation und
        Verwaltung in der Schreinerei digitalisieren lassen – praxisnah
        erklärt, ohne Verkaufsversprechen.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {artikel.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <h2 className="text-xl">{a.titel}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                {a.text}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Weiterlesen
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
