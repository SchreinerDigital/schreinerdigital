import type { Metadata } from "next";
import type { ReactNode } from "react";
import { tuerenAbcAnzahlBegriffe, tuerenAbcKategorien } from "@/content/tueren-abc";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { TuerenAbcGlossar } from "./tueren-abc-glossar";
import {
  BandTeileDiagram,
  DinRichtungDiagram,
  FalzVsStumpfDiagram,
  TuerblattMasseDiagram,
} from "./tueren-diagramme";

export const metadata: Metadata = {
  title: "Türenwissen: Grundlagen, Maße und Türen-ABC",
  description:
    "Gefälzt oder stumpf, DIN links oder rechts, 2- oder 3-teiliges Band, Standardmaße nach DIN 18101 – plus ein Glossar mit 110 Fachbegriffen rund um Türen, mit Zeichnungen erklärt.",
  alternates: { canonical: "/tueren-abc" },
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Grundlage({
  title,
  children,
  diagram,
}: {
  title: string;
  children: ReactNode;
  diagram: ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-border pt-10 sm:grid-cols-[1.2fr_1fr] sm:items-center">
      <div>
        <h2 className="text-2xl">{title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
      </div>
      <div>{diagram}</div>
    </section>
  );
}

export default function TuerenAbcPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Schreinerwissen</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Türenwissen</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Aufbau, Maße und Fachbegriffe rund um Türen – von den Grundlagen bis
        zum vollständigen Türen-ABC mit {tuerenAbcAnzahlBegriffe} Begriffen.
      </p>

      <div className="mt-14 space-y-10">
        <Grundlage
          title="Gefälzt oder stumpf einschlagend?"
          diagram={<FalzVsStumpfDiagram />}
        >
          <p>
            Beim <strong className="text-ink">gefälzten Türblatt</strong> läuft
            rundum eine Falzstufe, die beim Schließen auf den Falzanschlag der
            Zarge trifft. Das ergibt einen dichten, formschlüssigen Abschluss
            – die klassische, weit verbreitete Bauform.
          </p>
          <p>
            Beim <strong className="text-ink">stumpf einschlagenden Türblatt</strong>{" "}
            fehlt dieser Falz: Das Türblatt schlägt plan in die
            Zargenöffnung ein und trifft dort auf eine durchgehend flache
            Fläche statt auf einen Anschlag. Das wirkt reduzierter, braucht
            aber eine passende, meist als Blockzarge ausgeführte Zarge –
            die beiden Systeme sind nicht mischbar.
          </p>
        </Grundlage>

        <Grundlage title="DIN links oder DIN rechts?" diagram={<DinRichtungDiagram />}>
          <p>
            Die Faustregel: Stell dich auf die Seite, zu der die Tür
            aufschwingt – dort, wo du die Bänder siehst, wenn die Tür offen
            steht. Sitzen die Bänder von dort aus gesehen{" "}
            <strong className="text-ink">links</strong>, ist es DIN links.
            Sitzen sie <strong className="text-ink">rechts</strong>, ist es
            DIN rechts.
          </p>
          <p>
            Von der gegenüberliegenden Seite aus lässt sich die Richtung
            nicht zuverlässig bestimmen, da die Bänder dort nicht sichtbar
            sind. Die DIN-Richtung entscheidet zusammen mit der
            Anschlagrichtung (nach innen oder außen), welche Zarge, welches
            Türblatt und welche Beschläge bestellt werden müssen.
          </p>
        </Grundlage>

        <Grundlage
          title="Zweiteiliges oder dreiteiliges Band?"
          diagram={<BandTeileDiagram />}
        >
          <p>
            Ein <strong className="text-ink">zweiteiliges Band</strong>{" "}
            besteht aus Bandoberteil (ein Gewinde, am Türblatt) und
            Bandunterteil (zwei Gewinde, an der Zarge) – fest verbunden,
            ohne Nachjustierung. Es ist die Standardausführung für die
            meisten Zimmertüren.
          </p>
          <p>
            Ein <strong className="text-ink">dreiteiliges Band</strong> hat
            zusätzlich ein Mittelteil in der Zarge, über das sich die Tür
            nachträglich in mehreren Achsen (Höhe, Seite, Anpressdruck)
            justieren lässt. Es trägt mehr Gewicht und wird bei
            Wohnungseingangstüren, stärker beanspruchten Türen (z. B.
            Kinderzimmer) sowie schweren Massivholz- oder
            Übergrößen-Türblättern eingesetzt. Zwei- und dreiteilige Bänder
            lassen sich wegen unterschiedlicher Bohrbilder nicht ohne
            Umrüstsatz gegeneinander tauschen.
          </p>
        </Grundlage>

        <section className="border-t border-border pt-10">
          <h2 className="text-2xl">Bandbezugslinie &amp; Standardmaße</h2>
          <div className="mt-6">
            <TuerblattMasseDiagram />
          </div>
        </section>

        <div className="rounded-[var(--radius)] border border-accent/30 bg-accent-soft p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink">
                Willst du wissen, ob dein Türblatt ein Standardmaß ist – oder
                gleich das passende Rohbaumaß berechnen?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                Der Türenmaß-Rechner leitet Türblatt-, Zargen- und
                Wandstärkemaß aus dem Rohbaumaß der Maueröffnung nach DIN
                18101 ab – kostenlos und ohne Anmeldung.
              </p>
            </div>
            <ButtonLink href="/tools/tuerenmass" size="lg" className="shrink-0 gap-2">
              Türenmaß-Rechner öffnen
              <ArrowIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl">Türen-ABC: Glossar von A–Z</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {tuerenAbcAnzahlBegriffe} Fachbegriffe in {tuerenAbcKategorien.length}{" "}
          Kategorien – von Zargenarten über Brandschutzklassen bis zur
          Mehrfachverriegelung. Zum Nachschlagen im Kundengespräch, beim Lesen
          von Leistungsverzeichnissen oder um die eigene Fachsprache
          aufzufrischen.
        </p>
        <div className="mt-8">
          <TuerenAbcGlossar kategorien={tuerenAbcKategorien} />
        </div>
      </div>
    </Container>
  );
}
