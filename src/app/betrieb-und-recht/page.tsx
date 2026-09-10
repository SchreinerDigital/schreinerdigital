import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Betrieb & Recht für Schreinereien und Tischlereien",
  description:
    "Gewährleistung, Meisterpflicht, Datenschutz und Arbeitszeiterfassung bis Arbeitsvorbereitung, Kalkulation und Marketing: Recht und Betriebsführung für Schreinerei- und Tischlereibetriebe im Überblick.",
  alternates: { canonical: "/betrieb-und-recht" },
};

const rechtUndPflichten = [
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
  {
    href: "/betrieb-und-recht/zeitmanagement",
    titel: "Zeitmanagement & Arbeitszeiterfassung",
    text: "Warum Arbeitszeiterfassung bereits verpflichtend ist und welche Erfassungsmethoden sich für Werkstätten eignen.",
  },
];

const betriebsfuehrung = [
  {
    href: "/betrieb-und-recht/arbeitsvorbereitung",
    titel: "Arbeitsvorbereitung",
    text: "Von der Auftragsklärung bis zur Reihenfolgeplanung: wie Aufträge reibungslos durch die Werkstatt laufen.",
  },
  {
    href: "/betrieb-und-recht/lagerverwaltung-materialfluss",
    titel: "Lagerverwaltung & Materialfluss",
    text: "ABC-Analyse, Mindest- und Meldebestand sowie kurze Wege in der Werkstatt.",
  },
  {
    href: "/betrieb-und-recht/qualitaetsmanagement",
    titel: "Qualitätsmanagement",
    text: "Wareneingangs-, Zwischen- und Endkontrolle sowie strukturiertes Reklamationsmanagement.",
  },
  {
    href: "/betrieb-und-recht/preisgestaltung-wirtschaftlichkeit",
    titel: "Preisgestaltung & Wirtschaftlichkeit",
    text: "Kostenorientierte, wettbewerbsorientierte und wertorientierte Preisstrategien im Vergleich.",
  },
  {
    href: "/betrieb-und-recht/kundenkommunikation",
    titel: "Kundenkommunikation",
    text: "Vom Erstkontakt über die Angebotsphase bis zur Übergabe – Kommunikation ohne Missverständnisse.",
  },
  {
    href: "/betrieb-und-recht/marketing",
    titel: "Marketing für Schreinereien",
    text: "Google Unternehmensprofil, eigene Website, Social Media und Empfehlungsmarketing im Vergleich.",
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
      <Eyebrow>Pflichten & Betriebsführung</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Betrieb & Recht</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Rechtliche Pflichten und betriebswirtschaftliches Grundwissen für
        Schreinerei- und Tischlereibetriebe – praxisnah erklärt, ohne Ersatz
        für eine individuelle Rechts- oder Steuerberatung.
      </p>

      <div className="mt-12">
        <h2 className="text-2xl">Recht &amp; Pflichten</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {rechtUndPflichten.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="text-xl">{a.titel}</h3>
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
      </div>

      <div className="mt-14">
        <h2 className="text-2xl">Betriebsführung &amp; Organisation</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {betriebsfuehrung.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="text-xl">{a.titel}</h3>
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
      </div>
    </Container>
  );
}
