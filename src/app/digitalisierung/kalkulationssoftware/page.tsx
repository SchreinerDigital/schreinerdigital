import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  IndependenceNote,
  SoftwareProfiles,
  SpecTable,
  type SoftwareProfile,
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

const profiles: SoftwareProfile[] = [
  {
    name: "Schreiners Büro",
    kuerzel: "SB",
    website: "https://www.schreiners-buero.de/",
    beschreibung:
      "Schreiners Büro wird von einem gelernten Schreiner mit IT-Hintergrund entwickelt und ist seit rund 25 Jahren am Markt. Die Software läuft plattformübergreifend auf Windows, macOS und Linux und lässt sich auch von unterwegs auf Tablet oder Smartphone nutzen.",
  },
  {
    name: "Sander & Doll (Forma)",
    kuerzel: "SD",
    website: "https://sander-doll.com/produkte/forma",
    beschreibung:
      "Forma von der Sander & Doll AG deckt Mengen- und Zuschnittberechnung sowie Abschlagsrechnungen in allen gängigen Varianten ab und importiert Stücklisten direkt aus CAD-Programmen. Neue Kundinnen und Kunden erhalten in den ersten sechs Wochen kostenlose Unterstützung durch ein eigenes Einführungsteam.",
  },
  {
    name: "HERO",
    kuerzel: "HE",
    website: "https://hero-software.de/anwendungen/tischler-software",
    beschreibung:
      "HERO ist eine cloudbasierte Handwerkersoftware mit eigener App für Android und iOS, die Kalkulation, Auftragsplanung und Rechnungsstellung in einem System bündelt. Die App erlaubt zusätzlich das digitale Aufmaß direkt auf der Baustelle, die Software lässt sich 14 Tage kostenlos und unverbindlich testen.",
  },
  {
    name: "Corpora",
    kuerzel: "CO",
    website: "https://p-s-s.de/",
    beschreibung:
      "Corpora vom Anbieter PinnCalc aus Eckernförde ist seit 1987 in der Branche im Einsatz und bildet den kompletten Auftragsprozess vom Angebot bis zur Rechnung ab. Über direkte Schnittstellen zu den CAD-Programmen interiorcad und TrunCAD lassen sich Konstruktionsdaten ohne doppelte Erfassung übernehmen.",
  },
  {
    name: "Plancraft",
    kuerzel: "PL",
    website: "https://plancraft.com/de-de/gewerke/software-schreiner",
    beschreibung:
      "Plancraft ist eine cloudbasierte Handwerkersoftware aus Hamburg, gegründet 2020 und laut Anbieter mittlerweile von über 30.000 Handwerksbetrieben in mehreren Ländern genutzt. Aufmaß, Kalkulation, Plantafel und Rechnung laufen in einer App zusammen, eine GAEB-Schnittstelle deckt auch öffentliche Ausschreibungen ab.",
  },
  {
    name: "Sage 50 Handwerk",
    kuerzel: "SA",
    website: "https://www.sage.com/de-de/produkte/sage-50-handwerk/",
    beschreibung:
      "Sage 50 Handwerk ist die kaufmännische Lösung des etablierten, branchenübergreifenden ERP-Anbieters Sage mit einer eigenen Ausrichtung für Tischler und Schreiner. Von der Angebotserstellung über GAEB-Ausschreibungen bis zu Abschlags- und Schlussrechnungen deckt die Software die komplette kaufmännische Prozesskette ab.",
  },
  {
    name: "Zentro",
    kuerzel: "ZE",
    website: "https://www.zentro.at/branchen/tischler-schreiner-software",
    beschreibung:
      "Zentro ist ein ERP-Anbieter aus dem österreichischen Almtal, der seit fast 20 Jahren maßgeschneiderte Lösungen für Tischler und Schreiner entwickelt. Der Fokus liegt auf durchgängigen Prozessen für projektorientierte Betriebe – vom ersten Kundenkontakt bis zur Abrechnung.",
  },
  {
    name: "OSD",
    kuerzel: "OS",
    website: "https://www.osd.de/branchen/die-software-fuer-schreiner-tischler/",
    beschreibung:
      "OS Datensysteme (OSD) bietet seit 1984 durchgängige Software für Schreiner, Tischler, Laden- und Messebau sowie Möbelfertigung und deckt damit CAD, Kalkulation, ERP/PPS und CNC-Steuerung in einem System ab. Der Anbieter zählt nach eigenen Angaben über 4.000 Nutzerbetriebe in Deutschland.",
  },
  {
    name: "Kuhnle NG",
    kuerzel: "KU",
    website: "https://www.kuhnle.com/KuhnleNG.html",
    beschreibung:
      "Kuhnle entwickelt seit über 40 Jahren Branchensoftware für Tischler und Schreiner und ist nach eigenen Angaben in über 2.000 Betrieben im Einsatz. Kuhnle NG Flex richtet sich an kleine und mittlere Betriebe, NG Professional bringt mit zusätzlichen Modulen und Schnittstellen mehr Flexibilität für größere Betriebe.",
  },
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
        <IndependenceNote />

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

        <GuideSection
          title="Die Programme im Einzelnen"
          intro="Kurzporträt je Software mit Link zur Anbieter-Website – zum Aufklappen:"
        >
          <SoftwareProfiles items={profiles} />
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
