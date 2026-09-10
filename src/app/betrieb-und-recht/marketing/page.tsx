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
  title: "Marketing für Schreinereien",
  description:
    "Google Unternehmensprofil, eigene Website, Referenzprojekte und Empfehlungsmarketing – welche Marketingkanäle für Schreinereien den größten Effekt bringen.",
  alternates: { canonical: "/betrieb-und-recht/marketing" },
};

const kanaele = [
  [
    "Google Unternehmensprofil",
    "Sichtbarkeit bei lokaler Suche ('Schreiner in der Nähe')",
    "Kostenlos, hoher Effekt, sollte aktuell gehalten werden (Fotos, Öffnungszeiten, Bewertungen)",
  ],
  [
    "Eigene Website",
    "Referenzprojekte zeigen, Erstkontakt ermöglichen",
    "Volle Kontrolle über Inhalte, langfristig wichtigster eigener Kanal",
  ],
  [
    "Social Media (z. B. Instagram)",
    "Prozess und Werkstattalltag visuell zeigen",
    "Baut Vertrauen und Wiedererkennung auf, erfordert regelmäßige Pflege",
  ],
  [
    "Empfehlungsmarketing",
    "Zufriedene Bestandskunden als Multiplikatoren",
    "Kein direkter Kostenaufwand, aber nur über nachweislich gute Arbeit zu erreichen",
  ],
];

const faqs = [
  {
    q: "Welcher Marketingkanal lohnt sich für eine kleine Schreinerei zuerst?",
    a: "Ein vollständig gepflegtes Google Unternehmensprofil bringt in der Regel den größten Effekt im Verhältnis zum Aufwand, da es direkt bei lokalen Suchanfragen erscheint. Erst danach lohnt sich der Ausbau einer eigenen Website mit Referenzprojekten und, je nach Zielgruppe, ein Social-Media-Kanal.",
  },
  {
    q: "Was muss ich bei der Veröffentlichung von Fotos fertiger Kundenprojekte beachten?",
    a: "Projektfotos, auf denen Räume oder Möbel eines Kunden erkennbar sind, sollten nur mit dessen ausdrücklicher Zustimmung veröffentlicht werden – am besten schriftlich und bereits bei Auftragsabschluss vereinbart. Sind auf den Fotos Personen erkennbar, gelten zusätzliche datenschutzrechtliche Anforderungen. Details dazu erklärt der Artikel zum Datenschutz (DSGVO).",
  },
  {
    q: "Gibt es rechtliche Grenzen bei der Werbung, z. B. bei Preisangaben?",
    a: "Ja – Werbung gegenüber Verbrauchern darf nicht irreführend sein (etwa durch übertriebene oder unbelegte Aussagen) und muss bei Preisangaben die Vorgaben der Preisangabenverordnung beachten. Im Zweifel lohnt sich vor einer größeren Werbeaktion eine kurze Rücksprache mit einer spezialisierten Rechtsberatung.",
  },
];

export default function MarketingPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Marketing für Schreinereien</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Handwerkliche Qualität allein macht einen Betrieb noch nicht
          sichtbar – wer online kaum auffindbar ist, verliert Anfragen an
          Wettbewerber mit gepflegtem Profil und aussagekräftiger Website.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Vier Kanäle mit unterschiedlicher Wirkung"
          intro="Nicht jeder Kanal passt zu jedem Betrieb – ein Überblick über die üblichen Bausteine:"
        >
          <SpecTable columns={["Kanal", "Wirkt vor allem für", "Eigenschaft"]} rows={kanaele} />
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie sich einzelne Kundengespräche professionell gestalten
            lassen, zeigt die{" "}
            <Link href="/betrieb-und-recht/kundenkommunikation" className="text-accent hover:underline">
              Kundenkommunikation
            </Link>
            , die datenschutzrechtlichen Anforderungen an Projektfotos
            erklärt{" "}
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
