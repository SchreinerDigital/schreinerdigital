import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Betrieb & Recht für Schreinereien und Tischlereien",
  description:
    "Gewährleistung, Meisterpflicht, Aufbewahrungsfristen, Datenschutz und E-Rechnung: die wichtigsten rechtlichen Pflichten für Schreinerei- und Tischlereibetriebe im Überblick.",
  alternates: { canonical: "/betrieb-und-recht" },
};

const artikel = [
  {
    href: "/betrieb-und-recht/gewaehrleistung-maengelhaftung",
    titel: "Gewährleistung & Mängelhaftung",
    text: "Werkvertrag, Kaufvertrag oder Werklieferungsvertrag: welches Recht gilt, welche Fristen greifen und wie die Nacherfüllung abläuft.",
  },
  {
    href: "/betrieb-und-recht/meisterpflicht-handwerksordnung",
    titel: "Meisterpflicht & Handwerksordnung",
    text: "Warum Tischler zulassungspflichtig ist, welche Wege es neben dem Meisterbrief gibt und wie die Eintragung in die Handwerksrolle abläuft.",
  },
  {
    href: "/betrieb-und-recht/aufbewahrungspflichten-gobd",
    titel: "Aufbewahrungspflichten & GoBD",
    text: "Wie lange Rechnungen und Geschäftsbriefe aufbewahrt werden müssen und was die GoBD für die digitale Archivierung vorschreiben.",
  },
  {
    href: "/betrieb-und-recht/datenschutz-dsgvo",
    titel: "Datenschutz (DSGVO)",
    text: "Verzeichnis von Verarbeitungstätigkeiten, Datenschutzbeauftragter, Auftragsverarbeitung bei Cloud-Software und Projektfotos richtig veröffentlichen.",
  },
  {
    href: "/betrieb-und-recht/e-rechnung",
    titel: "E-Rechnungspflicht",
    text: "Was seit 2025 im Geschäftsverkehr zwischen Unternehmen gilt, welche Formate erlaubt sind und welche Übergangsfristen es gibt.",
  },
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function BetriebUndRechtPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Pflichten & Vorschriften</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Betrieb & Recht</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Rechtliche und betriebswirtschaftliche Pflichten, die für
        Schreinerei- und Tischlereibetriebe unabhängig vom Tagesgeschäft
        gelten – praxisnah erklärt, ohne Ersatz für eine individuelle
        Rechts- oder Steuerberatung.
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
