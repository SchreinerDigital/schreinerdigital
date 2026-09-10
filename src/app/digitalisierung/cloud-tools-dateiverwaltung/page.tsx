import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Cloud-Tools & Dateiverwaltung",
  description:
    "Cloud-Speicher versus lokaler Server für Konstruktionsdaten, Angebote und Fotos in der Schreinerei – Vor- und Nachteile sowie Anforderungen an den Datenschutz.",
  alternates: { canonical: "/digitalisierung/cloud-tools-dateiverwaltung" },
};

const vergleich = [
  [
    "Verfügbarkeit",
    "Ortsunabhängig, auch von der Baustelle aus abrufbar",
    "Nur im Betriebsnetzwerk oder per VPN erreichbar",
  ],
  [
    "Verantwortung für Backups",
    "Meist beim Anbieter, sollte vertraglich klar geregelt sein",
    "Vollständig beim eigenen Betrieb",
  ],
  [
    "Laufende Kosten",
    "Abo-Gebühr, meist nach Speicherplatz oder Nutzerzahl",
    "Einmalige Anschaffung, dafür eigener Wartungsaufwand",
  ],
  [
    "Datenschutz-Aufwand",
    "Auftragsverarbeitungsvertrag (AVV) mit dem Anbieter nötig",
    "Volle Kontrolle, aber auch volle Eigenverantwortung",
  ],
];

const faqs = [
  {
    q: "Darf ich Kundendaten und Projektfotos einfach in einer Cloud speichern?",
    a: "Ja, sofern mit dem Cloud-Anbieter ein Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO abgeschlossen ist und der Anbieter angemessene technische und organisatorische Maßnahmen nachweist. Details dazu im Artikel zum Datenschutz (DSGVO).",
  },
  {
    q: "Was passiert mit den Daten, wenn ich den Cloud-Anbieter wechsle?",
    a: "Das hängt vom gewählten Format ab: Offene, weit verbreitete Dateiformate (z. B. DXF, PDF) lassen sich meist unkompliziert exportieren und übertragen. Bei stark proprietären Formaten spezialisierter Branchensoftware lohnt sich vor Vertragsabschluss ein Blick auf die Exportmöglichkeiten.",
  },
  {
    q: "Reicht eine private Cloud-Lösung (z. B. Konsumenten-Speicherdienst) für den Betrieb aus?",
    a: "Für den professionellen Einsatz mit Kundendaten sind Geschäftskonten mit klar geregeltem AVV, Rechteverwaltung pro Mitarbeiter und Protokollierung sinnvoller als private Konten, die für den privaten Gebrauch konzipiert sind.",
  },
];

export default function CloudToolsDateiverwaltungPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Cloud-Tools &amp; Dateiverwaltung</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Konstruktionsdateien, Angebote und Baustellenfotos wollen von
          mehreren Personen und oft von unterwegs erreichbar sein – die Wahl
          zwischen Cloud-Speicher und eigenem Server hat dabei handfeste
          praktische wie rechtliche Konsequenzen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Cloud-Speicher versus lokaler Server"
          intro="Beide Ansätze haben in der Praxis ihre Berechtigung – die Entscheidung hängt vom Betrieb ab:"
        >
          <SpecTable columns={["Kriterium", "Cloud-Speicher", "Lokaler Server"]} rows={vergleich} />
        </GuideSection>

        <GuideSection title="Eine sinnvolle Ordnerstruktur">
          <p className="text-sm leading-relaxed text-ink-muted">
            Unabhängig vom gewählten Speicherort erleichtert eine einheitliche
            Struktur die tägliche Arbeit: ein Ordner je Auftrag, darin
            unterteilt nach Aufmaß, Konstruktion, Kalkulation und
            Kommunikation. Wird diese Struktur konsequent eingehalten, findet
            auch eine Vertretung während Urlaub oder Krankheit die relevanten
            Unterlagen ohne Rückfrage.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Die datenschutzrechtlichen Anforderungen an Cloud-Anbieter
            erklärt{" "}
            <Link href="/betrieb-und-recht/datenschutz-dsgvo" className="text-accent hover:underline">
              Datenschutz (DSGVO)
            </Link>
            , wie Sicherungskopien der eigenen Daten organisiert werden,
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
