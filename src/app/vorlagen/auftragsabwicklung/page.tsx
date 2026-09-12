import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { FaqAccordion } from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Lehrzettel-Serie: Auftragsabwicklung",
  description:
    "Zehn kurze E-Mails über die Dokumente einer echten Auftragsabwicklung – vom Angebot bis zur Stornorechnung, mit den wichtigsten rechtlichen Grundlagen zu jedem Dokument.",
  alternates: { canonical: "/vorlagen/auftragsabwicklung" },
};

const AUSGABEN = [
  { titel: "Angebot", hook: "Ab wann dich ein Angebot rechtlich bindet." },
  { titel: "Auftragsbestätigung", hook: "Formsache oder der eigentliche Vertragsschluss?" },
  { titel: "Anzahlungsrechnung", hook: "Der Steuertermin, den viele übersehen." },
  { titel: "Lieferschein", hook: "Von niemandem vorgeschrieben, trotzdem dein bester Beweis." },
  { titel: "Rechnung", hook: "10 Pflichtangaben, ohne die es teuer werden kann." },
  { titel: "Zahlungserinnerung", hook: "Freundlich bleiben, ohne dein Geld zu vergessen." },
  { titel: "1. Mahnung", hook: "Was jetzt rechtlich passiert und was sie kosten darf." },
  { titel: "2. Mahnung", hook: "Der Irrtum über „drei Mahnungen“." },
  { titel: "Gutschrift", hook: "Das Wort, das im Handwerk fast immer falsch benutzt wird." },
  { titel: "Stornorechnung", hook: "Warum „einfach löschen“ die schlechteste Idee ist." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Wie oft bekomme ich eine E-Mail?",
    a: "Die erste Ausgabe direkt nach der Bestätigung, danach in regelmäßigem Abstand von mehreren Tagen, bis alle zehn Ausgaben da sind.",
  },
  {
    q: "Bekomme ich die passenden Vorlagen direkt dazu?",
    a: "Jede Ausgabe verweist auf die passende Vorlage, die bei uns bereits fertig gestaltet ist. Der Kauf der Vorlagen-Pakete ist aktuell aber noch nicht freigeschaltet – du erfährst als Erstes per E-Mail, sobald es so weit ist.",
  },
  {
    q: "Kostet die Serie etwas?",
    a: "Nein, die Anmeldung und alle zehn Ausgaben sind kostenlos.",
  },
  {
    q: "Bekomme ich dann auch den normalen Newsletter?",
    a: "Ja. Mit der Anmeldung zur Serie meldest du dich in einem Schritt automatisch auch für den allgemeinen schreiner.digital-Newsletter an. Beide laufen parallel – die zehn Lehrzettel-Ausgaben zusätzlich zu den regulären Newsletter-Mails.",
  },
  {
    q: "Wie melde ich mich wieder ab?",
    a: "Über den Abmeldelink in jeder E-Mail, jederzeit mit einem Klick.",
  },
];

export default function AuftragsabwicklungNewsletterPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>E-Mail-Serie</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Auftragsabwicklung: die Lehrzettel-Serie</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Zehn kurze E-Mails über die Dokumente, die in einem echten Auftrag
        anfallen – vom ersten Angebot bis zur Stornorechnung. Jede Ausgabe
        erklärt kurz, wofür das jeweilige Dokument rechtlich und praktisch
        gut ist.
      </p>

      <div className="mt-10 max-w-lg rounded-[var(--radius)] border border-accent bg-accent-soft/20 p-6">
        <h2 className="text-lg font-medium text-ink">Jetzt anmelden</h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Eine Ausgabe direkt nach der Bestätigung, danach im Abstand von
          mehreren Tagen bis alle zehn da sind – parallel dazu meldest du
          dich in einem Schritt automatisch auch für den allgemeinen
          schreiner.digital-Newsletter an.
        </p>
        <NewsletterForm source="auftragsabwicklung" submitLabel="Serie abonnieren" className="mt-5" />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl">Die zehn Ausgaben</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {AUSGABEN.map((a, i) => (
            <li key={a.titel} className="flex gap-3 rounded-[var(--radius)] border border-border bg-surface p-4">
              <span className="font-mono text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium text-ink">{a.titel}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{a.hook}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl">Häufige Fragen</h2>
        <FaqAccordion items={FAQ} />
      </div>

      <p className="mt-16 text-sm text-ink-muted">
        <Link href="/vorlagen" className="text-accent hover:underline">
          Zurück zu allen Vorlagen &amp; Downloads
        </Link>
      </p>
    </Container>
  );
}
