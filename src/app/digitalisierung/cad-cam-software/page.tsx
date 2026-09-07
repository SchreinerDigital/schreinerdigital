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
    "AutoCAD",
    "Allgemeine technische Zeichnungen, kein Branchenfokus",
    "Weit verbreitet und günstiger im Einstieg, aber ohne fertige Zuschnittlisten oder direkte CNC-Ausgabe für den Möbelbau",
  ],
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
