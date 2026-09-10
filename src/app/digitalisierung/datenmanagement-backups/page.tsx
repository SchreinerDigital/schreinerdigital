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
  title: "Datenmanagement & Backups",
  description:
    "Die 3-2-1-Backup-Regel für Konstruktionsdaten, Kundendaten und Buchhaltung – und was bei Cloud- und Vor-Ort-Sicherungen zu beachten ist.",
  alternates: { canonical: "/digitalisierung/datenmanagement-backups" },
};

const regel321 = [
  {
    title: "3 Kopien der Daten",
    body: "Das Original plus mindestens zwei weitere Kopien – ein einzelnes Backup ist kein Backup, sondern nur eine zweite Kopie, die genauso ausfallen kann wie das Original.",
  },
  {
    title: "2 verschiedene Speichermedien",
    body: "Etwa interne Festplatte und externe Festplatte oder NAS – fällt ein Medientyp durch einen technischen Defekt aus, bleibt die zweite Kopie auf anderem Medium erhalten.",
  },
  {
    title: "1 Kopie an einem anderen Ort",
    body: "Eine Kopie außerhalb des Betriebsgebäudes (Cloud-Speicher oder physisch ausgelagerte Festplatte) schützt zusätzlich vor Brand, Einbruch oder Wasserschaden am Hauptstandort.",
  },
];

const faqs = [
  {
    q: "Wie oft sollte ein Backup laufen?",
    a: "Automatisiert und regelmäßig ist wichtiger als eine bestimmte Taktung – täglich für laufende Auftrags- und Buchhaltungsdaten, bei größeren Konstruktionsprojekten auch häufiger. Automatische Backups vermeiden, dass die Sicherung im Tagesgeschäft schlicht vergessen wird.",
  },
  {
    q: "Reicht eine externe Festplatte im selben Raum wie der Server?",
    a: "Als eine der Kopien ja, als einzige Absicherung nicht – ein Brand oder Diebstahl im selben Raum würde Original und Kopie gleichzeitig treffen. Die dritte, ausgelagerte Kopie der 3-2-1-Regel deckt genau dieses Risiko ab.",
  },
  {
    q: "Muss ich Backups regelmäßig auf Wiederherstellbarkeit prüfen?",
    a: "Ja – ein Backup, das sich im Ernstfall nicht zurückspielen lässt (etwa wegen eines beschädigten Datenträgers oder eines falsch konfigurierten Sicherungsjobs), bietet keinen tatsächlichen Schutz. Ein testweises Zurückspielen einzelner Dateien in größeren Abständen deckt solche Probleme rechtzeitig auf.",
  },
];

export default function DatenmanagementBackupsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Datenmanagement &amp; Backups</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Konstruktionsdaten, Kundendaten und Buchhaltung sind je
          digitalisierterem Betrieb umso verletzlicher gegenüber
          Festplattendefekten, Diebstahl oder Ransomware – die
          seit über zwanzig Jahren bewährte 3-2-1-Backup-Regel schafft
          hier verlässlichen Schutz.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Die 3-2-1-Backup-Regel"
          intro="Ein einfaches, seit Jahrzehnten bewährtes Grundprinzip für Datensicherung:"
        >
          <StepList steps={regel321} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie sich Cloud-Speicher und lokaler Server als Teil der eigenen
            Backup-Strategie einordnen, zeigt{" "}
            <Link href="/digitalisierung/cloud-tools-dateiverwaltung" className="text-accent hover:underline">
              Cloud-Tools &amp; Dateiverwaltung
            </Link>
            , die datenschutzrechtlichen Pflichten beim Umgang mit
            Kundendaten erklärt{" "}
            <Link href="/betrieb-und-recht/datenschutz-dsgvo" className="text-accent hover:underline">
              Datenschutz (DSGVO)
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
