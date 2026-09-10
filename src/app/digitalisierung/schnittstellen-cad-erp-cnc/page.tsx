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
  title: "Schnittstellen zwischen CAD, ERP und CNC",
  description:
    "Warum Konstruktions-, Kalkulations- und Maschinensoftware oft nicht von selbst zusammenarbeiten – und worauf bei der Auswahl kompatibler Programme zu achten ist.",
  alternates: { canonical: "/digitalisierung/schnittstellen-cad-erp-cnc" },
};

const systeme = [
  ["CAD/CAM", "Konstruktion, 3D-Modell, Werkzeugwege", "DXF, DWG, herstellerspezifisches CNC-Format"],
  ["ERP/Auftragssoftware", "Kalkulation, Angebote, Rechnungen, Kundendaten", "CSV, XML, teils direkte Schnittstellen zu CAD-Anbietern"],
  ["CNC-Maschine", "Maschinensteuerung, Fertigung", "Herstellerspezifisches Programmformat (z. B. WOP, MPR)"],
];

const faqs = [
  {
    q: "Warum sprechen CAD-Software und Kalkulationssoftware nicht automatisch dieselbe Sprache?",
    a: "Beide Softwarekategorien kommen oft von unterschiedlichen Herstellern mit eigenen Datenmodellen. Eine Schnittstelle muss explizit programmiert und gepflegt werden – sie existiert nur, wenn beide Hersteller sie anbieten oder ein neutrales Austauschformat (z. B. CSV) beide Seiten unterstützen.",
  },
  {
    q: "Was bedeutet eine 'native' Schnittstelle gegenüber einem CSV-Export?",
    a: "Eine native Schnittstelle überträgt Daten direkt und meist strukturiert (inklusive Sonderzeichen, Formeln, Verknüpfungen) zwischen zwei Programmen. Ein CSV-Export ist universeller einsetzbar, überträgt aber meist nur einfache Tabellendaten und erfordert oft manuelle Nacharbeit bei komplexeren Strukturen.",
  },
  {
    q: "Worauf sollte ich vor dem Kauf neuer Software achten, wenn ich bereits ein anderes System nutze?",
    a: "Explizit beim Anbieter nachfragen, ob eine Schnittstelle zum bereits vorhandenen System existiert, und sich das im besten Fall an einem konkreten Testfall mit eigenen Daten zeigen lassen – allgemeine Kompatibilitätsaussagen in Prospekten sind dafür oft zu unspezifisch.",
  },
];

export default function SchnittstellenPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/digitalisierung"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Digitalisierung
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Schnittstellen zwischen CAD, ERP und CNC</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Drei Softwarewelten prägen den digitalen Werkstattalltag –
          Konstruktion, Auftragsverwaltung und Maschinensteuerung. Nur wenn
          sie miteinander sprechen, entfällt das doppelte Eintippen
          derselben Daten.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Drei Systemwelten im Überblick"
          intro="Jede der drei Softwarekategorien verwaltet eigene Daten in eigenen Formaten:"
        >
          <SpecTable columns={["System", "Verwaltet", "Typische Formate"]} rows={systeme} />
        </GuideSection>

        <GuideSection title="Wo Schnittstellen den größten Unterschied machen">
          <p className="text-sm leading-relaxed text-ink-muted">
            Der größte Zeitgewinn entsteht, wenn eine im CAD konstruierte
            Stückliste direkt in die Kalkulationssoftware übernommen wird,
            statt Maße und Materialangaben ein zweites Mal von Hand
            einzutragen. Ebenso spart eine direkte CAM-zu-Maschinen-Anbindung
            die manuelle Programmierung an der CNC-Steuerung. Fehlt eine
            Schnittstelle, bleibt oft nur der Umweg über einen manuell
            gepflegten CSV- oder Excel-Export – funktionsfähig, aber mit
            zusätzlichem Pflegeaufwand und Fehlerpotenzial bei jeder
            Übertragung.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>

        <GuideSection title="Weiterführend">
          <p className="text-sm leading-relaxed text-ink-muted">
            Wie Stücklisten und CNC-Programme aus dem CAD-Modell entstehen,
            zeigt{" "}
            <Link href="/digitalisierung/stuecklisten-cnc-ausgabe" className="text-accent hover:underline">
              Stücklisten &amp; CNC-Ausgabe
            </Link>
            , einen Softwarevergleich mit Blick auf Schnittstellen bieten die
            Übersichten zu{" "}
            <Link href="/digitalisierung/cad-cam-software" className="text-accent hover:underline">
              CAD/CAM-Software
            </Link>{" "}
            und{" "}
            <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
              Kalkulationssoftware
            </Link>
            .
          </p>
        </GuideSection>
      </GuideShell>
    </Container>
  );
}
