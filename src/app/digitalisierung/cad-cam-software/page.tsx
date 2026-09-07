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
  title: "CAD/CAM-Software für Schreiner – Programme im Vergleich",
  description:
    "3D-CAD- und CAM-Software für die Möbel- und Innenausbauplanung im Vergleich: imos, paletteCAD, PYTHA, TopSolid'Wood, TrunCAD, interiorcad und mehr.",
  alternates: { canonical: "/digitalisierung/cad-cam-software" },
};

const software = [
  [
    "imos iX",
    "Modular, skaliert vom kleinen Betrieb bis zum Großunternehmen",
    "Cloud-Services, VR/AR-Funktionen, Anbindung an die Homag Digital Factory",
  ],
  [
    "paletteCAD",
    "Speziell für Tischler & Schreiner, cloudbasiert",
    "Große Bibliothek fertiger 3D-Objekte, starke Fotorealistik, direkte CNC-Anbindung",
  ],
  [
    "PYTHA",
    "Möbeldesign, Innenausbau, Laden- und Messebau",
    "Patentierte Footprint-Technologie für Verbinder wie Dübel oder Minifix, komplett in Deutschland entwickelt",
  ],
  [
    "TopSolid'Wood",
    "Tischler, Innenausbauer, Ladenbauer, CNC-Zulieferer",
    "Baut auf dem Siemens-Parasolid-Kern auf, maschinenneutrales CAM bis 5-Achs-simultan",
  ],
  [
    "TrunCAD",
    "Möbel- und Küchenplanung",
    "Laut Anbieter über 8.000 Nutzer, integrierter Online-Konfigurator für die eigene Website",
  ],
  [
    "interiorcad",
    "Möbel- und Einrichtungsbau, seit rund 25 Jahren am Markt",
    "Baut auf Vectorworks auf, in Kombination mit der Kalkulationssoftware Corpora als durchgängige Lösung",
  ],
  [
    "SolidWorks (mit SWOOD)",
    "Schreiner, Tischler, Möbeldesigner, Innenarchitekten – vom kleinen Handwerksbetrieb bis zur Industrie",
    "SWOOD ist eine Erweiterung für SolidWorks von der französischen Firma EFICAD, seit 2009 am Markt, steuert gängige Holzbearbeitungs-CNC inklusive Kantenanleimung an",
  ],
  [
    "AutoCAD",
    "Allgemeine technische Zeichnungen, kein Branchenfokus",
    "Weit verbreitet und günstiger im Einstieg, aber ohne fertige Zuschnittlisten oder direkte CNC-Ausgabe für den Möbelbau",
  ],
];

const profiles: SoftwareProfile[] = [
  {
    name: "imos iX",
    kuerzel: "IM",
    website: "https://www.imos3d.com/",
    beschreibung:
      "imos iX ist eine modulare Planungssoftware der imos AG, die vom kleinen Betrieb bis zum Großunternehmen skaliert. Über die Cloud-Anbindung an die Homag Digital Factory lassen sich Aufträge direkt an Fertigungsmaschinen weitergeben, dazu kommen VR- und AR-Funktionen für die Kundenpräsentation.",
    geeignetFuer:
      "Betriebe, die von klein bis Großserie skalieren wollen und Wert auf Anbindung an Homag-Maschinen legen.",
    vorteile: [
      "Wächst modular mit dem Betrieb mit, von Einzelplatz bis Konzern",
      "Direkte Cloud-Anbindung an die Homag Digital Factory",
      "VR/AR-Funktionen für die Kundenpräsentation",
    ],
    nachteile: [
      "Modularer Aufbau kann bei kleinen Betrieben zu unnötigem Overhead führen",
      "Volle Stärke oft erst mit Homag-Maschinenpark spürbar",
      "Preise nicht öffentlich einsehbar, nur auf Anfrage",
    ],
  },
  {
    name: "paletteCAD",
    kuerzel: "PC",
    website: "https://www.palettecad.com/",
    beschreibung:
      "paletteCAD von der Palette CAD AG ist eine cloudbasierte 3D-Software speziell für Tischler und Schreiner mit einer großen Bibliothek fertiger 3D-Objekte und starker Fotorealistik für die Kundenpräsentation. Laut Anbieter setzen über 12.000 Handwerksbetriebe, Fachhändler und Planer auf die Software.",
    geeignetFuer:
      "Tischler und Schreiner, die schnelle, fotorealistische Kundenpräsentationen ohne große Einarbeitung wollen.",
    vorteile: [
      "Große Bibliothek fertiger 3D-Objekte spart Modellierzeit",
      "Starke Fotorealistik überzeugt bei Kundenpräsentationen",
      "Cloudbasiert, dadurch ortsunabhängig nutzbar",
    ],
    nachteile: [
      "Laufende Kosten durch Cloud-/Abomodell statt Einmalkauf",
      "Objektbibliothek deckt nicht jeden Sonderfall ab",
      "Benötigt eine stabile Internetverbindung",
    ],
  },
  {
    name: "PYTHA",
    kuerzel: "PY",
    website: "https://www.pytha.de/",
    beschreibung:
      "PYTHA ist ein universelles 3D-CAD-System, das komplett in Deutschland entwickelt wird und neben Möbeldesign auch Laden- und Messebau abdeckt. Die patentierte Footprint-Technologie erkennt beim Konstruieren automatisch passende Verbinder wie Dübel oder Minifix.",
    geeignetFuer:
      "Möbeldesign, Laden- und Messebau mit Anspruch an flexible, individuelle Konstruktionen.",
    vorteile: [
      "Footprint-Technologie erkennt passende Verbinder automatisch",
      "Deckt Möbelbau, Laden- und Messebau gleichermaßen ab",
      "Deutsche Entwicklung mit deutschsprachigem Support",
    ],
    nachteile: [
      "Umfangreiches System mit entsprechender Einarbeitungszeit",
      "Weniger stark auf Serienfertigung ausgelegt als reine ERP-CAD-Kombinationen",
      "Preise nur auf Anfrage",
    ],
  },
  {
    name: "TopSolid'Wood",
    kuerzel: "TS",
    website: "https://www.topsolid.com/en/products/topsolidwood",
    beschreibung:
      "TopSolid'Wood vom französischen Anbieter Missler Software baut auf dem Siemens-Parasolid-Kern auf und richtet sich an Tischler, Innenausbauer, Ladenbauer und CNC-Zulieferer. Bearbeitungsschritte werden schon während der 3D-Modellierung mitgedacht, das CAM-Modul steuert Maschinen maschinenneutral bis zur 5-Achs-Simultanbearbeitung an.",
    geeignetFuer:
      "CNC-Zulieferer und Betriebe mit anspruchsvoller, mehrachsiger Maschinenanbindung.",
    vorteile: [
      "Maschinenneutrales CAM bis zur 5-Achs-Simultanbearbeitung",
      "Bearbeitung wird schon während der Konstruktion mitgedacht",
      "Robuster Parasolid-Kern aus dem Siemens-Umfeld",
    ],
    nachteile: [
      "Komplexität eher auf größere, maschinennahe Betriebe ausgelegt",
      "Französischer Hersteller, Lokalisierung und Support in Deutschland über Partner",
      "Hoher Funktionsumfang erfordert längere Einarbeitung",
    ],
  },
  {
    name: "TrunCAD",
    kuerzel: "TC",
    website: "https://truncad.de/",
    beschreibung:
      "TrunCAD wird seit 2004 von der TrunCAD GmbH aus Lindau entwickelt und zielt auf schnelle, einfache Möbel- und Küchenplanung mit automatischer Stücklistenerstellung. Laut Anbieter nutzen weltweit mehr als 2.000 Betriebe die Software, zusätzlich lässt sich ein Online-Konfigurator in die eigene Website einbinden.",
    geeignetFuer:
      "Möbel- und Küchenplaner, die schnell zu einer Stückliste und einem Online-Konfigurator kommen wollen.",
    vorteile: [
      "Laut Anbieter auch für CAD-Einsteiger schnell erlernbar",
      "Automatische Stücklistenerstellung",
      "Eigener Online-Konfigurator für die Kundenwebsite einbindbar",
    ],
    nachteile: [
      "Fokus liegt stärker auf Möbel/Küche als auf komplexem Innenausbau",
      "Für sehr große Betriebe ggf. weniger Tiefe als Enterprise-Lösungen",
      "Direkte CNC-Anbindung je nach Maschine unterschiedlich ausgeprägt",
    ],
  },
  {
    name: "interiorcad",
    kuerzel: "IC",
    website: "https://www.vectorworks.de/vectorworks/interiorcad-powered-vectorworks",
    beschreibung:
      "interiorcad powered by Vectorworks wird seit 1997 von der extragroup GmbH in Münster entwickelt und nutzt als CAD-Kern die Grafiksoftware Vectorworks, die 2D- und 3D-Konstruktion auf einem Niveau verbindet. Für die Kalkulation gibt es eine direkte Schnittstelle zur Software Corpora, sodass Konstruktionsdaten nicht doppelt erfasst werden müssen.",
    geeignetFuer:
      "Betriebe, die eine etablierte 2D/3D-Grafikbasis (Vectorworks) plus Möbelbau-Erweiterung wollen.",
    vorteile: [
      "Vectorworks-Kern bietet vollwertiges 2D neben 3D",
      "Seit 1997 etabliert, entsprechend viel Branchenerfahrung",
      "Schnittstelle zur Kalkulationssoftware Corpora verfügbar",
    ],
    nachteile: [
      "Vectorworks-Lizenz als Basis zusätzlich zur interiorcad-Erweiterung nötig",
      "Umstieg von einem anderen CAD-Kern erfordert Umgewöhnung",
      "Preise nur auf Anfrage",
    ],
  },
  {
    name: "SolidWorks (mit SWOOD)",
    kuerzel: "SW",
    website: "https://swood.eficad.com/",
    beschreibung:
      "SolidWorks ist die verbreitete mechanische 3D-CAD-Plattform von Dassault Systèmes; für den Möbel- und Holzbereich wird sie erst durch die Erweiterung SWOOD interessant. SWOOD stammt vom französischen Anbieter EFICAD, ist seit 2009 am Markt und steuert gängige Holzbearbeitungs-CNC inklusive Kantenanleimung direkt aus dem 3D-Modell an.",
    geeignetFuer:
      "Betriebe, die etablierte mechanische 3D-CAD-Power mit einer dedizierten Holzbearbeitungs-Erweiterung kombinieren wollen.",
    vorteile: [
      "SolidWorks-Kern ist ein etablierter, weit verbreiteter CAD-Standard",
      "SWOOD steuert Holzbearbeitungs-CNC inklusive Kantenanleimung direkt an",
      "Skaliert vom Handwerksbetrieb bis zur Industrie",
    ],
    nachteile: [
      "Zwei Lizenzen nötig: SolidWorks-Basis plus SWOOD-Erweiterung",
      "Ursprünglich für den Maschinenbau entwickelt, kein reiner Möbelbau-Fokus",
      "Höherer Einarbeitungsaufwand als bei reinen Branchenlösungen",
    ],
  },
  {
    name: "AutoCAD",
    kuerzel: "AC",
    website: "https://www.autodesk.com/de/products/autocad/",
    beschreibung:
      "AutoCAD von Autodesk ist ein allgemeines technisches Zeichenprogramm ohne Branchenfokus auf Möbel- oder Innenausbau. Für Zuschnittlisten, Materiallisten oder eine direkte CNC-Ausgabe braucht es zusätzliche Erweiterungen – dafür ist der Einstieg oft günstiger als bei den spezialisierten Branchenlösungen.",
    geeignetFuer:
      "Betriebe, die vor allem klassische technische Zeichnungen brauchen und volle Flexibilität ohne Branchenkorsett wollen.",
    vorteile: [
      "Weit verbreiteter Standard mit vielen Anwendern und Tutorials",
      "Günstiger Einstieg im Vergleich zu Branchenlösungen",
      "Sehr flexibel für allgemeine technische Zeichnungen",
    ],
    nachteile: [
      "Keine fertigen Zuschnitt- oder Stücklisten für den Möbelbau",
      "Keine direkte CNC-Ausgabe ohne Zusatz-Plug-ins",
      "Kein branchenspezifischer Support für Schreinerarbeiten",
    ],
  },
];

const faqs = [
  {
    q: "Brauche ich CAD oder gleich CAD/CAM?",
    a: "Ein reines CAD-Programm reicht für Planung, Konstruktion und Kundenpräsentation. CAM wird erst nötig, sobald du CNC-Maschinen ansteuerst und die Zuschnitt- und Bearbeitungsdaten direkt aus der Zeichnung erzeugen willst, statt sie manuell zu übertragen.",
  },
  {
    q: "Muss die CAD-Software zur Kalkulationssoftware passen?",
    a: "Das solltest du unbedingt vorher prüfen. Manche Kombinationen sind bereits aufeinander abgestimmt – etwa TrunCAD und Corpora oder interiorcad und Corpora, beide vom selben Anbieter. Ohne passende Schnittstelle musst du Maße, Stücklisten und Preise doppelt pflegen.",
  },
  {
    q: "Lohnt sich eine Testversion?",
    a: "Ja. Mehrere Anbieter bieten kostenlose Testphasen an, oft rund zwei Wochen. Am aussagekräftigsten ist der Test an einem echten, aktuellen Projekt aus deinem eigenen Betrieb – nicht am Demo-Beispiel des Anbieters.",
  },
];

export default function CadCamSoftwarePage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">CAD/CAM-Software für Schreiner</h1>
        <p className="mt-4 text-lg text-ink-muted">
          3D-CAD-Programme übernehmen heute weit mehr als das reine Zeichnen:
          Stücklisten, Zuschnittoptimierung und die direkte Anbindung an
          CNC-Maschinen (CAM) gehören bei den meisten Branchenlösungen bereits
          dazu. Die Programme unterscheiden sich vor allem darin, wie stark
          sie auf den Möbel- und Innenausbau zugeschnitten sind und wie gut
          sie sich in die restliche Betriebssoftware einfügen.
        </p>
      </div>

      <GuideShell>
        <IndependenceNote />

        <GuideSection
          title="Software im Vergleich"
          intro="Eine Auswahl gängiger Programme in der Branche – Zielgruppe und Besonderheit auf einen Blick:"
        >
          <SpecTable
            columns={["Software", "Zielgruppe / Schwerpunkt", "Besonderheit"]}
            rows={software}
            note="Angaben ohne Gewähr, Stand der Recherche. Preise variieren stark je nach Modulumfang und Betriebsgröße – am besten direkt beim Anbieter anfragen oder eine Testversion nutzen."
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
              <strong className="text-ink">Betriebsgröße:</strong> Manche
              Systeme (z. B. imos, OSD) sind modular und wachsen mit,
              andere sind von vornherein auf kleinere Betriebe zugeschnitten.
            </li>
            <li>
              <strong className="text-ink">CNC-Anbindung:</strong> Wenn du
              eine eigene CNC-Maschine hast oder planst, achte auf eine
              direkte CAM-Schnittstelle statt eines Umwegs über
              Exportformate.
            </li>
            <li>
              <strong className="text-ink">Cloud oder lokal:</strong>{" "}
              Cloudbasierte Programme laufen ohne eigenen Server und sind
              ortsunabhängig nutzbar, lokale Installationen bieten oft mehr
              Kontrolle über die eigenen Daten.
            </li>
            <li>
              <strong className="text-ink">Anbindung an die Kalkulation:</strong>{" "}
              Prüfe, ob eine Schnittstelle zu deiner Auftrags- und
              Kalkulationssoftware besteht (siehe{" "}
              <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
                Kalkulations- und Auftragssoftware
              </Link>
              ).
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
