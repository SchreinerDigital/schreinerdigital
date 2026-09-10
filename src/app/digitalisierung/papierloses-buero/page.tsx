import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  StepList,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Papierloses Büro in der Schreinerei",
  description:
    "Wie sich Rechnungen, Lieferscheine und Aufmaßprotokolle digital statt in Papierform verwalten lassen – unter Beachtung der GoBD-Anforderungen an die Aufbewahrung.",
  alternates: { canonical: "/digitalisierung/papierloses-buero" },
};

const schritte = [
  {
    title: "Eingehende Belege direkt digitalisieren",
    body: "Rechnungen und Lieferscheine per Scan-App erfassen, statt sie zunächst in Papierform zu sammeln – so entsteht von Anfang an nur eine digitale Ablage.",
  },
  {
    title: "Digitale Belege GoBD-konform archivieren",
    body: "Für steuerlich relevante Unterlagen gelten feste Aufbewahrungsfristen und Anforderungen an Unveränderbarkeit – ein einfacher Ordner auf dem eigenen Rechner reicht dafür oft nicht aus.",
  },
  {
    title: "Digitale Signatur oder Freigabeprozesse etablieren",
    body: "Freigaben (z. B. für Bestellungen oder Auszahlungen), die früher per Unterschrift auf Papier erfolgten, lassen sich durch digitale Freigabeprozesse in der jeweiligen Software ersetzen.",
  },
  {
    title: "Restpapier bewusst einplanen",
    body: "Manche Dokumente – etwa unterschriebene Verträge oder behördliche Originale – bleiben auch im digitalisierten Betrieb papierbasiert; ein vollständig papierloses Büro ist selten das realistische Ziel, ein deutlich reduzierter Papieranteil dagegen meist gut erreichbar.",
  },
];

const faqs = [
  {
    q: "Darf ich Papierrechnungen nach dem Einscannen vernichten?",
    a: "Grundsätzlich ja, wenn die Digitalisierung den GoBD-Anforderungen entspricht (vollständig, richtig, zeitnah, geordnet und unveränderbar archiviert). Details und Fristen dazu erklärt der Artikel zu Aufbewahrungspflichten & GoBD.",
  },
  {
    q: "Reicht ein normaler Cloud-Speicher zur Archivierung von Rechnungen?",
    a: "Ein gewöhnlicher Cloud-Speicherordner allein erfüllt meist nicht die GoBD-Anforderung der Unveränderbarkeit, da Dateien dort in der Regel weiterhin gelöscht oder überschrieben werden können. Dafür sind revisionssichere Archivsysteme oder entsprechende Module in Buchhaltungssoftware vorgesehen.",
  },
  {
    q: "Was mache ich mit bereits vorhandenen Papierakten aus den letzten Jahren?",
    a: "Ein rückwirkendes Digitalisieren ist möglich, aber nicht verpflichtend – solange die gesetzlichen Aufbewahrungsfristen noch laufen, dürfen die Originale in Papierform aufbewahrt werden, während neue Belege bereits digital erfasst werden.",
  },
];

export default function PapierlosesBueroPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Papierloses Büro in der Schreinerei</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Weniger Aktenordner, schnelleres Wiederfinden alter Unterlagen und
          ortsunabhängiger Zugriff – der Umstieg auf digitale Belege lohnt
          sich, muss aber die gesetzlichen Anforderungen an die
          Aufbewahrung erfüllen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Der Weg zum papierarmen Büro"
          intro="Vier Schritte, die sich unabhängig von der gewählten Software bewährt haben:"
        >
          <StepList steps={schritte} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Welche Fristen und Anforderungen die GoBD konkret an die digitale
            Archivierung stellen, erklärt{" "}
            <Link href="/betrieb-und-recht/aufbewahrungspflichten-gobd" className="text-accent hover:underline">
              Aufbewahrungspflichten &amp; GoBD
            </Link>
            , wie Sicherungskopien der digitalen Belege organisiert werden,
            zeigt{" "}
            <Link href="/digitalisierung/datenmanagement-backups" className="text-accent hover:underline">
              Datenmanagement &amp; Backups
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
