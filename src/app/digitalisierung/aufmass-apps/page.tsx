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
  title: "Digitale Aufmaß-Apps für Schreiner",
  description:
    "Laser-Entfernungsmesser mit App-Anbindung im Überblick: Bosch MeasureOn, Leica DISTO Plan, Würth WDM, STABILA Measures II und die Aufmaß-Integration in Auftragssoftware.",
  alternates: { canonical: "/digitalisierung/aufmass-apps" },
};

const apps = [
  [
    "Bosch MeasureOn",
    "Bosch",
    "Kostenlose App für Bosch-Laser-Entfernungsmesser, überträgt Maße direkt aufs Smartphone",
  ],
  [
    "Bosch Toolbox (→ PRO360)",
    "Bosch",
    "Bündelt mehrere digitale Werkzeuge inkl. Messkamera zur Vermessung vor Ort; wird schrittweise durch den Nachfolger PRO360 abgelöst",
  ],
  [
    "Leica DISTO Plan",
    "Leica Geosystems",
    "Erstellt aus den Laser-Messungen direkt einfache Grundrisse",
  ],
  [
    "Würth WDM",
    "Würth",
    "Kostenlose Begleit-App für Würth-Entfernungsmesser",
  ],
  [
    "STABILA Measures II",
    "STABILA",
    "Verbindet STABILA-Messgeräte per Bluetooth mit dem Smartphone",
  ],
];

const profiles: SoftwareProfile[] = [
  {
    name: "Bosch MeasureOn",
    kuerzel: "BM",
    website: "https://www.bosch-professional.com/de/de/measureon/",
    beschreibung:
      "MeasureOn ist der cloudbasierte Nachfolgedienst für Bosch-Laser-Entfernungsmesser mit einem „C“ in der Modellbezeichnung, etwa den GLM 50 C. Die App-Basisnutzung inklusive Basic-Cloud-Abo ist kostenlos, Messungen lassen sich darüber auch am Rechner im Webportal weiterverarbeiten.",
    geeignetFuer:
      "Bosch-Nutzer mit neueren Lasermessgeräten (Modellen mit „C“), die Messwerte in der Cloud weiterverarbeiten wollen.",
    vorteile: [
      "Kostenlose Basisnutzung inklusive Basic-Cloud-Abo",
      "Messungen auch am PC im Webportal weiterverarbeitbar",
      "Direkte Bluetooth-Anbindung an kompatible Bosch-Messgeräte",
    ],
    nachteile: [
      "Funktioniert nur mit Bosch-Geräten der passenden Generation (Modelle mit „C“)",
      "Erweiterte Cloud-Funktionen ggf. kostenpflichtig",
      "Kein herstellerübergreifender Einsatz möglich",
    ],
  },
  {
    name: "Bosch Toolbox (→ PRO360)",
    kuerzel: "BT",
    website: "https://www.bosch-professional.com/de/de/pro360/",
    beschreibung:
      "Die Bosch Toolbox bündelt neben einer Messkamera für die Vermessung vor Ort auch Zeiterfassung, Aufgaben- und Materialverwaltung sowie einen Einheitenumrechner. Bosch stellt die App aktuell schrittweise auf den Nachfolger PRO360 um, der zusätzlich Werkzeug-Inventar und Garantieverwaltung übernimmt.",
    geeignetFuer:
      "Bestehende Bosch-Toolbox-Nutzer, die aktuell auf den Nachfolger PRO360 umsteigen.",
    vorteile: [
      "Bündelt Messkamera, Zeiterfassung, Aufgaben- und Materialverwaltung",
      "Kostenlos nutzbar",
      "Nachfolger PRO360 bringt zusätzlich Werkzeug-Inventar und Garantieverwaltung",
    ],
    nachteile: [
      "App wird schrittweise abgeschaltet, Umstieg auf PRO360 nötig",
      "Nur für Bosch-Werkzeuge und -Geräte relevant",
      "Funktionsumfang während der Umstellungsphase in Bewegung",
    ],
  },
  {
    name: "Leica DISTO Plan",
    kuerzel: "LD",
    website: "https://shop.leica-geosystems.com/measurement-tools/disto/leica-disto-plan-app",
    beschreibung:
      "Die App von Leica Geosystems erstellt aus Laser-Messungen direkt einfache Grundrisse und unterstützt die neueste DISTO-Gerätegeneration (X1, D2-2, D2G) inklusive NFC-Kopplung. Fertige Pläne lassen sich unter anderem als DXF- oder DWG-Datei exportieren und direkt in ein CAD-Programm weiterverarbeiten.",
    geeignetFuer:
      "Betriebe, die aus dem Aufmaß direkt einen CAD-fähigen Grundriss brauchen.",
    vorteile: [
      "Erstellt automatisch einfache Grundrisse aus Laser-Messungen",
      "Export als DXF/DWG direkt ins CAD-Programm möglich",
      "NFC-Kopplung mit der neueren DISTO-Gerätegeneration",
    ],
    nachteile: [
      "Nur mit kompatiblen Leica-DISTO-Modellen (X1, D2-2, D2G) nutzbar",
      "Grundrisse bleiben vereinfachte Skizzen, kein vollwertiges Aufmaß-CAD",
      "Zusatzkosten für App bzw. Gerät möglich",
    ],
  },
  {
    name: "Würth WDM",
    kuerzel: "WD",
    website: "https://apps.apple.com/de/app/w%C3%BCrth-wdm/id1501559326",
    beschreibung:
      "Die Würth-WDM-App verbindet sich per Bluetooth mit den Laser-Entfernungsmessern WDM 3-19, WDM 6-22, WDM 8-14 und WDM 9-24 und überträgt Distanzen sowie Flächenwerte direkt aufs Smartphone. Fertige Pläne oder bemaßte Fotos lassen sich als JPG oder PDF exportieren.",
    geeignetFuer:
      "Würth-Kunden mit WDM-Lasermessgerät, die schnell bemaßte Fotos oder Pläne brauchen.",
    vorteile: [
      "Kostenlose Begleit-App zu den WDM-Geräten",
      "Export bemaßter Pläne/Fotos als JPG oder PDF",
      "Einfache Bluetooth-Kopplung mit dem Messgerät",
    ],
    nachteile: [
      "Nur mit Würth-eigenen WDM-Messgeräten nutzbar",
      "Kein automatischer Grundriss wie bei manchen Wettbewerbern",
      "Keine direkte CAD-Anbindung",
    ],
  },
  {
    name: "STABILA Measures II",
    kuerzel: "ST",
    website: "https://www.stabila.com/en/products/details/stabila-measures-ii-measurement-app.html",
    beschreibung:
      "Measures II von STABILA verbindet sich per Bluetooth mit den Messgeräten LD 530 BT, LD 520 und LD 250 BT. Die Smart-Sketch-Funktion erzeugt automatisch einen Raumgrundriss, sobald die Wandmaße erfasst sind, dazu gibt es Zeichenwerkzeuge und Ausrichtungshilfen.",
    geeignetFuer:
      "STABILA-Nutzer, die aus Wandmaßen automatisch einen Raumgrundriss erzeugen wollen.",
    vorteile: [
      "Smart-Sketch-Funktion erzeugt automatisch einen Raumgrundriss",
      "Zusätzliche Zeichenwerkzeuge und Ausrichtungshilfen",
      "Bluetooth-Anbindung an mehrere STABILA-Modelle (LD 530 BT, LD 520, LD 250 BT)",
    ],
    nachteile: [
      "Nur mit kompatiblen STABILA-Messgeräten nutzbar",
      "Kein CAD-Export, eher für schnelle Skizzen gedacht",
      "Wie bei allen Hersteller-Apps kein geräteübergreifender Einsatz",
    ],
  },
];

const faqs = [
  {
    q: "Brauche ich ein bestimmtes Lasermessgerät für diese Apps?",
    a: "Ja. Die Hersteller-Apps (Bosch, Leica, Würth, STABILA) funktionieren jeweils nur mit den eigenen Messgeräten des Herstellers – bevor du dich für eine App entscheidest, lohnt sich also der Blick auf das passende Gerät.",
  },
  {
    q: "Ersetzt eine App das klassische Aufmaß vor Ort?",
    a: "Nein. Gemessen wird weiterhin vor Ort – die App überträgt und dokumentiert die Werte nur digital, statt sie handschriftlich zu notieren und später abzutippen. Genau das reduziert Übertragungsfehler.",
  },
  {
    q: "Brauche ich überhaupt eine separate Aufmaß-App?",
    a: "Nicht unbedingt. Mehrere Kalkulations- und Auftragsprogramme bringen die Aufmaß-Funktion bereits mit (siehe unten) – dann reicht ein einziges System für Aufmaß, Kalkulation und Rechnung.",
  },
];

export default function AufmassAppsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Digitale Aufmaß-Apps</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Laser-Entfernungsmesser gehören in vielen Betrieben längst zum
          Standard. Mit der passenden App landen die gemessenen Werte direkt
          digital auf dem Smartphone oder Tablet – ohne den Umweg über Notizzettel
          und späteres Abtippen.
        </p>
      </div>

      <GuideShell>
        <IndependenceNote />

        <GuideSection
          title="Laser-Messgeräte mit App-Anbindung"
          intro="Die bekanntesten kostenlosen Begleit-Apps der Werkzeughersteller:"
        >
          <SpecTable
            columns={["App", "Hersteller", "Besonderheit"]}
            rows={apps}
            note="Angaben ohne Gewähr, Stand der Recherche. Jede App funktioniert nur mit Messgeräten des jeweils eigenen Herstellers."
          />
        </GuideSection>

        <GuideSection
          title="Die Apps im Einzelnen"
          intro="Kurzporträt je App mit Link zur Anbieter-Website – zum Aufklappen:"
        >
          <SoftwareProfiles items={profiles} />
        </GuideSection>

        <GuideSection title="Aufmaß direkt in der Auftragssoftware">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Statt einer separaten App bringen einige Kalkulations- und
            Auftragsprogramme das digitale Aufmaß bereits mit und verbinden
            sich direkt mit dem Lasermessgerät. So landen die Werte ohne
            Umweg in der Kalkulation. Beispiele sind Plancraft und HERO –
            mehr dazu unter{" "}
            <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
              Kalkulations- und Auftragssoftware
            </Link>
            . Für Betriebe, die ohnehin eine dieser Lösungen einsetzen oder
            planen, kann sich eine zusätzliche, separate Aufmaß-App also
            erübrigen.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
