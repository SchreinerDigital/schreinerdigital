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
  title: "Kundenkommunikation in der Schreinerei",
  description:
    "Vom Erstkontakt über die Angebotsphase bis zur Übergabe – wie klare Kommunikation Missverständnisse vermeidet und Reklamationen leichter macht.",
  alternates: { canonical: "/betrieb-und-recht/kundenkommunikation" },
};

const phasen = [
  {
    title: "Erstkontakt und Beratung",
    body: "Bereits im ersten Gespräch wird geklärt, was der Kunde sich vorstellt, welches Budget realistisch ist und ob die Vorstellungen mit der eigenen Kapazität und Spezialisierung zusammenpassen – ein ehrliches 'das passt eher nicht zu uns' spart beiden Seiten Zeit.",
  },
  {
    title: "Angebot verständlich erklären",
    body: "Ein Angebot, das nur Positionen und Preise auflistet, wirft beim Kunden oft Rückfragen auf. Ein kurzes Begleitschreiben oder Gespräch, das die wichtigsten Positionen einordnet, reduziert spätere Missverständnisse über den Leistungsumfang.",
  },
  {
    title: "Während der Fertigung informieren",
    body: "Bei längeren Projekten schätzen Kunden einen kurzen Zwischenstand, besonders wenn sich Liefertermine für Material verschieben. Eine frühzeitige, proaktive Nachricht wird deutlich besser aufgenommen als eine Erklärung erst nach der verpassten Deadline.",
  },
  {
    title: "Übergabe und Nachbetreuung",
    body: "Bei der Übergabe lohnt sich ein kurzer Hinweis zu Pflege und Nutzung des Werkstücks (z. B. Verhalten von Massivholz bei Heizungsluft) – das beugt Rückfragen vor, die sonst später als vermeintliche Mängel ankommen.",
  },
];

const faqs = [
  {
    q: "Eignen sich WhatsApp oder ähnliche Messenger für die Kundenkommunikation?",
    a: "Praktisch ja, rechtlich ist jedoch Vorsicht geboten: Der private WhatsApp-Messenger überträgt beim Import von Kontakten automatisch das gesamte Adressbuch an den Anbieter, was datenschutzrechtlich problematisch ist. Für den geschäftlichen Einsatz eignet sich eher WhatsApp Business mit reduzierter Kontaktfreigabe, verbunden mit einer transparenten Information der Kunden darüber, wie ihre Daten dabei verarbeitet werden.",
  },
  {
    q: "Wie geht man kommunikativ mit einer berechtigten Reklamation um?",
    a: "Am besten zeitnah, mit ernsthaftem Interesse an der Schilderung des Kunden und ohne vorschnelle Schuldzuweisung. Ein zügig vereinbarter Vor-Ort-Termin zur Begutachtung wirkt professioneller als tagelanges Hin- und Herschreiben – die rechtlichen Details zur Nacherfüllung klärt die Gewährleistung.",
  },
  {
    q: "Wie viel Kommunikation ist bei einem laufenden Projekt angemessen?",
    a: "Eine feste Taktung (z. B. wöchentliches Kurz-Update bei längeren Projekten) schafft Verlässlichkeit, ohne den Kunden mit zu häufigen Nachrichten zu belasten. Wichtiger als die Frequenz ist, ungeplante Änderungen (Termin, Preis, Ausführung) immer sofort statt erst beim nächsten ohnehin geplanten Update zu melden.",
  },
];

export default function KundenkommunikationPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Kundenkommunikation in der Schreinerei</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Die meisten Konflikte mit Kunden entstehen nicht durch
          handwerkliche Fehler, sondern durch unklare oder zu späte
          Kommunikation – von der ersten Beratung bis zur Übergabe.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Vier Phasen mit unterschiedlichem Kommunikationsbedarf"
          intro="Jede Projektphase stellt eigene Anforderungen an die Kommunikation mit dem Kunden:"
        >
          <StepList steps={phasen} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie ein Angebot inhaltlich aufgebaut sein sollte, zeigt{" "}
            <Link href="/digitalisierung/aufmass-angebotserstellung" className="text-accent hover:underline">
              Aufmaß &amp; Angebotserstellung
            </Link>
            , welche Rechte und Fristen bei einer Reklamation gelten, die{" "}
            <Link href="/betrieb-und-recht/gewaehrleistung-maengelhaftung" className="text-accent hover:underline">
              Gewährleistung &amp; Mängelhaftung
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
