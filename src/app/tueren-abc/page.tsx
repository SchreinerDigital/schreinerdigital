import type { Metadata } from "next";
import { tuerenAbcAnzahlBegriffe, tuerenAbcKategorien } from "@/content/tueren-abc";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Accordion, GuideSection, GuideShell } from "@/components/tools/guide";
import { TuerenAbcGlossar } from "./tueren-abc-glossar";

export const metadata: Metadata = {
  title: "Türen-ABC – Glossar für Zargen, Beschläge und Türnormen",
  description:
    "Über 110 Fachbegriffe rund um Türen: Zargenarten, DIN 18101, Brand- und Schallschutzklassen, Türblattaufbau, Beschläge und Dichtungen – verständlich erklärt.",
  alternates: { canonical: "/tueren-abc" },
};

const praxistipps = [
  {
    title: "Welche Zarge passt zu meiner Wandstärke?",
    content: (
      <p className="text-sm leading-relaxed text-ink-muted">
        Bei einer klassischen Umfassungszarge lässt sich die Zierbekleidung
        innerhalb des Verstellbereichs verschieben – üblicherweise ca. −5 bis
        +15 mm gegenüber der Standard-Futterbreite. Liegt die tatsächliche
        Wandstärke außerhalb dieses Bereichs, braucht es entweder eine Zarge
        mit abweichender Futterbreite oder einen Blendrahmen statt der
        Umfassungszarge.
      </p>
    ),
  },
  {
    title: "DIN links oder rechts – so misst du richtig",
    content: (
      <p className="text-sm leading-relaxed text-ink-muted">
        Die DIN-Richtung wird immer von der Bandseite aus bei geöffneter Tür
        beurteilt: Stell dich so vor die Tür, dass die Bänder auf deiner
        linken Seite sitzen und die Tür von dir weg aufschwingt – das ist DIN
        links. Sitzen die Bänder rechts, ist es DIN rechts. Zusammen mit der
        Drehrichtung (nach innen oder außen) ergibt das die vollständige
        Anschlagrichtung für die Bestellung.
      </p>
    ),
  },
  {
    title: "T30 oder RS – was brauche ich wirklich?",
    content: (
      <p className="text-sm leading-relaxed text-ink-muted">
        T30 bezeichnet den Feuerwiderstand (30 Minuten feuerhemmend) einer
        Brandschutztür, RS steht für Rauchschutz nach DIN 18095 – zwei
        unterschiedliche Prüfungen, die häufig kombiniert werden (T30-RS).
        Ob überhaupt eine Anforderung besteht und welche, schreibt in der
        Regel die Bauordnung oder das Brandschutzkonzept vor – etwa bei
        Garagenverbindungstüren oder in notwendigen Treppenräumen. Im
        Zweifel entscheidet nicht der Wunsch des Kunden, sondern die
        Genehmigungsplanung.
      </p>
    ),
  },
  {
    title: "Warum passt die bestellte Tür nicht einfach ins Rohbaumaß?",
    content: (
      <p className="text-sm leading-relaxed text-ink-muted">
        Das Rohbaumaß ist die lichte Maueröffnung vor dem Einbau der Zarge.
        Bestellt wird aber das Bestellmaß (Falzmaß) des Türblatts bzw. der
        Zarge – eine kleinere Größe, die sich über das Baurichtmaß nach DIN
        18101 aus dem Rohbaumaß abzüglich Putz, Ausbau und umlaufender
        Montagefuge (Bauanschlussfuge) ergibt. Wer diese drei Maße
        verwechselt, bestellt am Ende ein Türelement, das entweder zu groß
        oder mit unschön breiter Fuge sitzt.
      </p>
    ),
  },
];

export default function TuerenAbcPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Türen-ABC</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        {tuerenAbcAnzahlBegriffe} Fachbegriffe in {tuerenAbcKategorien.length}{" "}
        Kategorien – von Zargenarten und Bandbezugslinie bis zu
        Brandschutzklassen und Mehrfachverriegelung.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Ob Angebot vom Türenhersteller, Ausschreibungstext oder Gespräch auf
        der Baustelle: Rund um Türen hat sich ein eigenes Vokabular aus
        Bauteilbezeichnungen, DIN-Normen und Prüfklassen entwickelt. Dieses
        Türen-ABC sammelt die wichtigsten Begriffe an einem Ort – zum
        Nachschlagen im Kundengespräch, beim Lesen von Leistungsverzeichnissen
        oder einfach, um die eigene Fachsprache aufzufrischen.
      </p>

      <div className="mt-12">
        <TuerenAbcGlossar kategorien={tuerenAbcKategorien} />
      </div>

      <GuideShell>
        <GuideSection
          title="Praxistipps"
          intro="Vier Fragen aus dem Alltag, bei denen die Begriffe aus dem Türen-ABC direkt weiterhelfen:"
        >
          <Accordion items={praxistipps} />
        </GuideSection>

        <GuideSection
          title="Fazit"
          intro="Die wenigsten Kundinnen und Kunden kennen den Unterschied zwischen Futterbrett und Falzbekleidung – müssen sie auch nicht. Für die eigene Kalkulation, die Kommunikation mit Türenherstellern und das sichere Lesen von Normen und Prüfzeichen lohnt sich die genaue Begriffskenntnis aber doppelt: Sie verhindert Bestellfehler und macht im Gespräch mit Architekten und Bauleitung den Unterschied zwischen Rückfragen und einer souveränen Auskunft."
        />
      </GuideShell>
    </Container>
  );
}
