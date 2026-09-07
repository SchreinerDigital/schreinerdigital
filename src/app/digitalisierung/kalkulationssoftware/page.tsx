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
  title: "Kalkulations- und Auftragssoftware für Schreiner im Vergleich",
  description:
    "Branchensoftware für Kalkulation, Auftragsverwaltung und Rechnung im Schreinerhandwerk: Schreiners Büro, Sander & Doll, HERO, Corpora, Plancraft, Sage, Zentro, OSD und Kuhnle NG im Überblick.",
  alternates: { canonical: "/digitalisierung/kalkulationssoftware" },
};

const software = [
  [
    "Schreiners Büro",
    "Kleine und mittlere Betriebe",
    "Von einem gelernten Schreiner mit IT-Hintergrund entwickelt, seit rund 25 Jahren am Markt, läuft auf Windows, macOS und Linux",
  ],
  [
    "Sander & Doll (Forma)",
    "Schreiner, Tischler, Fensterbauer",
    "Deckt Mengen- und Zuschnittberechnung sowie Abschlagsrechnungen in allen Varianten ab",
  ],
  [
    "HERO",
    "Kleine bis mittlere Betriebe, cloudbasiert",
    "Eigene Handwerker-App fürs Aufmaß auf der Baustelle, 14 Tage kostenlos testbar",
  ],
  [
    "Corpora",
    "Alle Betriebsgrößen, seit 1987 in der Branche",
    "Vom Anbieter PinnCalc, direkte Anbindung an die CAD-Programme interiorcad und TrunCAD möglich",
  ],
  [
    "Plancraft",
    "Kleine bis mittlere Betriebe, cloudbasiert",
    "Aufmaß, Kalkulation, Plantafel und Rechnung in einer App, GAEB-Schnittstelle für Ausschreibungen",
  ],
  [
    "Sage 50 Handwerk",
    "Alle Betriebsgrößen, Schwerpunkt Buchhaltung",
    "Etablierter, branchenübergreifender ERP-Anbieter mit eigener Tischler- und Schreiner-Variante",
  ],
  [
    "Zentro",
    "Kleine bis größere Betriebe",
    "Durchgängige Lösung von der CAD-Konstruktion bis zur Produktion, seit 2006 am Markt",
  ],
  [
    "OSD",
    "Weit verbreitet, alle Betriebsgrößen",
    "Deckt CAD, Kalkulation, ERP/PPS und CNC-Steuerung in einem System ab",
  ],
  [
    "Kuhnle NG",
    "NG Flex für kleine/mittlere, NG Professional für größere Betriebe",
    "Seit über 40 Jahren am Markt, laut Anbieter in über 2.000 Betrieben im Einsatz",
  ],
];

const faqs = [
  {
    q: "Was kostet Kalkulationssoftware für einen kleinen Betrieb?",
    a: "Das lässt sich pauschal nicht sagen – die Preise variieren stark je nach Anbieter, Modulumfang und Nutzerzahl, meist als Monats- oder Jahreslizenz. Am sinnvollsten ist es, mehrere Angebote und Testversionen direkt zu vergleichen.",
  },
  {
    q: "Cloud oder lokal installierte Software?",
    a: "Cloudbasierte Lösungen laufen ohne eigenen Server und sind ortsunabhängig nutzbar – praktisch, wenn du oder deine Mitarbeitenden auch von der Baustelle aus arbeiten. Lokale Lösungen bieten oft mehr Kontrolle über die eigenen Daten. Welche Variante passt, hängt von der IT-Ausstattung im Betrieb ab.",
  },
  {
    q: "Ersetzt Kalkulationssoftware die Steuerberatung?",
    a: "Nein. Sie bereitet Angebote, Rechnungen und Kostenkalkulationen sauber auf, ersetzt aber keine steuerliche Beratung oder die Buchhaltung durch einen Steuerberater.",
  },
];

export default function KalkulationssoftwarePage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Kalkulations- und Auftragssoftware</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Vom ersten Kundenkontakt über das Angebot bis zur Rechnung: Branchensoftware
          bündelt Kalkulation, Auftragsverwaltung und oft auch Zeiterfassung
          und Buchhaltung an einem Ort – statt in einzelnen Excel-Tabellen und
          Word-Vorlagen.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Software im Vergleich"
          intro="Eine Auswahl gängiger Branchenlösungen – Zielgruppe und Besonderheit auf einen Blick:"
        >
          <SpecTable
            columns={["Software", "Zielgruppe", "Besonderheit"]}
            rows={software}
            note="Angaben ohne Gewähr, Stand der Recherche. Preise variieren stark je nach Anbieter und Modulumfang – am besten direkt beim Anbieter anfragen oder eine Testversion nutzen."
          />
        </GuideSection>

        <GuideSection title="Worauf du bei der Auswahl achten solltest">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Anbindung ans CAD-Programm:</strong>{" "}
              Manche Anbieter kombinieren Kalkulation und{" "}
              <Link href="/digitalisierung/cad-cam-software" className="text-accent hover:underline">
                CAD/CAM-Software
              </Link>{" "}
              aus einer Hand, sodass Maße und Stücklisten nicht doppelt
              gepflegt werden müssen.
            </li>
            <li>
              <strong className="text-ink">Aufmaß-Integration:</strong> Einige
              Programme (z. B. Plancraft, HERO) verbinden sich direkt mit
              Laser-Messgeräten – mehr dazu unter{" "}
              <Link href="/digitalisierung/aufmass-apps" className="text-accent hover:underline">
                digitale Aufmaß-Apps
              </Link>
              .
            </li>
            <li>
              <strong className="text-ink">Betriebsgröße:</strong> Einige
              Systeme sind modular gestaffelt (z. B. Kuhnle NG Flex/Professional)
              und wachsen mit deinem Betrieb mit.
            </li>
            <li>
              <strong className="text-ink">Support und Einführung:</strong>{" "}
              Gerade bei umfangreicheren Systemen lohnt es sich zu prüfen, wie
              viel Unterstützung beim Einrichten und in der Einarbeitungszeit
              enthalten ist.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
