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
    "Bosch Toolbox",
    "Bosch",
    "Bündelt mehrere digitale Werkzeuge, unter anderem eine Messkamera zur Vermessung vor Ort",
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

        <GuideSection title="Aufmaß direkt in der Auftragssoftware">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Statt einer separaten App bringen einige Kalkulations- und
            Auftragsprogramme das digitale Aufmaß bereits mit und verbinden
            sich direkt mit dem Lasermessgerät. So landen die Werte ohne
            Umweg in der Kalkulation. Beispiele sind Plancraft, HERO und
            STREIT – mehr dazu unter{" "}
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
