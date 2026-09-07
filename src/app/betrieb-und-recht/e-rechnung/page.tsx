import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "E-Rechnungspflicht 2025 – was für Schreinereien gilt",
  description:
    "Die E-Rechnungspflicht im B2B-Geschäftsverkehr seit 2025: Empfangspflicht, Übergangsfristen fürs Ausstellen und die zulässigen Formate XRechnung und ZUGFeRD.",
  alternates: { canonical: "/betrieb-und-recht/e-rechnung" },
};

const fristen = [
  ["Vorjahresumsatz bis 800.000 €", "Papier-/sonstige elektronische Rechnung bis 31.12.2027 zulässig"],
  ["Vorjahresumsatz über 800.000 €", "Papier-/sonstige elektronische Rechnung bis 31.12.2026 zulässig"],
  ["Ab 1.1.2028", "E-Rechnung für alle inländischen B2B-Umsätze verpflichtend"],
];

const faqs = [
  {
    q: "Gilt die Pflicht auch für Rechnungen an Privatkunden?",
    a: "Nein. Die Pflicht betrifft nur den Geschäftsverkehr zwischen Unternehmen (B2B) im Inland. Rechnungen an Privatpersonen sind nicht betroffen.",
  },
  {
    q: "Muss ich als Kleinunternehmer jetzt schon etwas tun?",
    a: "Ja: Kleinunternehmer im Sinne von § 19 UStG müssen selbst keine E-Rechnungen ausstellen, aber seit 1.1.2025 ohne Übergangsfrist in der Lage sein, E-Rechnungen zu empfangen und zu archivieren.",
  },
  {
    q: "Reicht eine normale PDF-Rechnung per E-Mail?",
    a: "Nein. Eine reine Bild-PDF ohne strukturierte Daten gilt nicht als E-Rechnung im gesetzlichen Sinn. Nötig ist ein zur europäischen Norm EN 16931 konformes Format wie XRechnung oder ZUGFeRD.",
  },
  {
    q: "Was ist der Unterschied zwischen XRechnung und ZUGFeRD?",
    a: "XRechnung ist ein reines XML-Format, ursprünglich für Rechnungen an öffentliche Auftraggeber entwickelt. ZUGFeRD kombiniert eine für Menschen lesbare PDF-Ansicht mit eingebetteten, strukturierten XML-Daten – dadurch bleibt die Rechnung auch optisch prüfbar.",
  },
  {
    q: "Wie lange muss ich eine E-Rechnung aufbewahren?",
    a: "Wie jeder andere Buchungsbeleg unterliegt auch die E-Rechnung den allgemeinen Aufbewahrungspflichten – aktuell 8 Jahre. Aufzubewahren ist dabei der ursprüngliche strukturierte Datensatz, nicht nur ein Ausdruck. Mehr dazu unter Aufbewahrungspflichten & GoBD.",
  },
];

export default function ERechnungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">E-Rechnungspflicht</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Seit dem 1. Januar 2025 ist die elektronische Rechnung im
          Geschäftsverkehr zwischen Unternehmen (B2B) in Deutschland
          verpflichtend. Rechtsgrundlage ist das im März 2024 verabschiedete
          Wachstumschancengesetz.
        </p>
      </div>

      <GuideShell>
        <GuideSection title="Was seit 2025 gilt">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Empfangspflicht ohne Übergangsfrist:</strong>{" "}
              Seit 1.1.2025 müssen alle inländischen Unternehmen E-Rechnungen
              empfangen und archivieren können.
            </li>
            <li>
              <strong className="text-ink">Kleinunternehmer:</strong> Rechnungen
              von Kleinunternehmern nach § 19 UStG müssen nicht als
              E-Rechnung übermittelt werden – zum Empfang bleiben aber auch
              Kleinunternehmer verpflichtet.
            </li>
            <li>
              <strong className="text-ink">Ausstellungspflicht:</strong> Für
              das Ausstellen eigener E-Rechnungen gelten befristete
              Übergangsregelungen (siehe Tabelle unten).
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Übergangsfristen fürs Ausstellen"
          intro="Wie lange Papier- oder sonstige elektronische Rechnungen (z. B. einfache PDF) noch zulässig sind, hängt vom Vorjahresumsatz ab:"
        >
          <SpecTable columns={["Betriebsgröße", "Frist"]} rows={fristen} />
        </GuideSection>

        <GuideSection title="Welches Format ist erlaubt">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die europäische Norm EN 16931 legt fest, welche rund 60
            Datenfelder eine E-Rechnung enthalten muss – sie schreibt aber
            keinen bestimmten Dateityp vor. In Deutschland erfüllen zwei
            Formate diese Norm: <strong className="text-ink">XRechnung</strong>{" "}
            (ein reines XML-Format) und{" "}
            <strong className="text-ink">ZUGFeRD</strong> (eine PDF-Datei mit
            eingebettetem, strukturiertem XML). Beide werden von den
            gängigen Kalkulations- und Rechnungsprogrammen unterstützt – mehr
            dazu unter{" "}
            <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
              Kalkulations- und Auftragssoftware
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Aufbewahrung">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            E-Rechnungen unterliegen denselben Aufbewahrungspflichten wie
            andere Buchungsbelege. Aufzubewahren ist dabei der ursprüngliche
            strukturierte Datensatz (XML bzw. die eingebetteten Daten bei
            ZUGFeRD), nicht nur ein Ausdruck oder Screenshot. Details zu
            Fristen und den GoBD-Anforderungen an die digitale Archivierung
            findest du unter{" "}
            <Link href="/betrieb-und-recht/aufbewahrungspflichten-gobd" className="text-accent hover:underline">
              Aufbewahrungspflichten & GoBD
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Steuer- oder Rechtsberatung. Für
        eine verbindliche Einschätzung zu deinem Betrieb wende dich an deine
        Steuerberatung.
      </p>
    </Container>
  );
}
