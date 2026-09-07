import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Datenschutz (DSGVO) im Handwerksbetrieb",
  description:
    "Verzeichnis von Verarbeitungstätigkeiten, Datenschutzbeauftragter, Auftragsverarbeitungsvertrag bei Cloud-Software und Projektfotos: DSGVO-Pflichten für Schreinereien und Tischlereien.",
  alternates: { canonical: "/betrieb-und-recht/datenschutz-dsgvo" },
};

const faqs = [
  {
    q: "Muss ich als kleiner Betrieb wirklich ein Verzeichnis führen, obwohl ich unter 250 Mitarbeitende habe?",
    a: "In den meisten Fällen ja. Die Ausnahme nach Art. 30 Abs. 5 DSGVO greift nur, wenn die Datenverarbeitung nicht nur gelegentlich erfolgt, keine besonderen Datenkategorien betrifft und kein Risiko für die Rechte der betroffenen Personen birgt. Da praktisch jeder Betrieb regelmäßig Kunden-, Angebots- und Rechnungsdaten verarbeitet, entfällt die Ausnahme in der Praxis für die meisten Schreinereien – ein einfaches Verzeichnis lohnt sich also fast immer.",
  },
  {
    q: "Ab wann brauche ich einen Datenschutzbeauftragten?",
    a: "Grundsätzlich erst, wenn in der Regel mindestens 20 Personen ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigt sind (§ 38 BDSG). Ein Betrieb mit bis zu 15 Beschäftigten liegt damit in aller Regel darunter – unabhängig von der Mitarbeiterzahl kann eine Pflicht aber ausnahmsweise bestehen, etwa bei einer Datenschutz-Folgenabschätzung nach Art. 35 DSGVO oder bei geschäftsmäßiger Datenübermittlung, was für die meisten Handwerksbetriebe aber untypisch ist.",
  },
  {
    q: "Brauche ich für jede Cloud-Software einen eigenen Vertrag?",
    a: "Ja. Sobald ein externer Anbieter (Kalkulationssoftware, CAD-Cloud, Buchhaltungstool) personenbezogene Daten in deinem Auftrag verarbeitet, brauchst du mit diesem Anbieter einen Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO. Seriöse Anbieter stellen einen solchen Vertrag standardmäßig zum Abschluss bereit, oft direkt beim Onboarding.",
  },
  {
    q: "Darf ich Fotos von fertigen Projekten einfach auf meiner Website zeigen?",
    a: "Reine Möbel- oder Raumfotos ohne erkennbare Personen sind meist unproblematisch, solange keine identifizierenden Details wie Hausnummern oder Namensschilder zu sehen sind und keine urheberrechtlich geschützten Elemente Dritter verletzt werden. Sind Personen erkennbar abgebildet, brauchst du grundsätzlich deren ausdrückliche, dokumentierte Einwilligung, bevor du das Bild veröffentlichst.",
  },
  {
    q: "Wie lange darf ich Kundendaten nach Projektabschluss speichern?",
    a: "Das hängt vom Zweck ab: Für Rechnungen und Buchungsbelege gelten die gesetzlichen Aufbewahrungspflichten (aktuell 8 Jahre), die Vorrang vor einer sofortigen Löschung nach der DSGVO haben. Daten, die du nur zu anderen Zwecken gespeichert hast (z. B. für Marketing) und die keiner gesetzlichen Aufbewahrungspflicht unterliegen, solltest du löschen, sobald der Zweck entfällt.",
  },
];

export default function DatenschutzPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Datenschutz (DSGVO) im Handwerksbetrieb</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Auch ein kleiner Schreinereibetrieb verarbeitet ständig
          personenbezogene Daten – von der Kundenanfrage über das Angebot
          bis zum Projektfoto auf der eigenen Website. Die wichtigsten
          DSGVO-Pflichten für Betriebe bis rund 15 Beschäftigte im
          Überblick.
        </p>
      </div>

      <GuideShell>
        <GuideSection title="Verzeichnis von Verarbeitungstätigkeiten">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Art. 30 DSGVO verlangt grundsätzlich von jedem Verantwortlichen
            ein Verzeichnis von Verarbeitungstätigkeiten (VVT) – eine
            Übersicht, welche Kategorien personenbezogener Daten du zu
            welchem Zweck verarbeitest, wie lange und mit welchen
            technischen und organisatorischen Maßnahmen sie geschützt sind.
            Zwar sind Unternehmen mit weniger als 250 Mitarbeitenden nach
            Art. 30 Abs. 5 DSGVO von dieser Pflicht ausgenommen – die
            Ausnahme entfällt aber, sobald die Verarbeitung nicht nur
            gelegentlich erfolgt, ein Risiko für die Rechte der Betroffenen
            birgt oder besondere Datenkategorien (z. B. Gesundheitsdaten)
            betrifft. Da ein Handwerksbetrieb Kunden- und Auftragsdaten
            regelmäßig verarbeitet, greift die Ausnahme in der Praxis kaum
            – ein einfaches Verzeichnis in Tabellenform ist mit
            überschaubarem Aufwand erstellt und schützt im Zweifel vor
            Bußgeldern.
          </p>
        </GuideSection>

        <GuideSection title="Datenschutzbeauftragter: ab wann verpflichtend?">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Nach § 38 BDSG muss ein Datenschutzbeauftragter benannt werden,
            wenn in der Regel mindestens 20 Personen ständig mit der
            automatisierten Verarbeitung personenbezogener Daten beschäftigt
            sind. Für einen Betrieb mit bis zu rund 15 Mitarbeitenden greift
            diese Pflicht damit in aller Regel nicht. Unabhängig von der
            Mitarbeiterzahl besteht die Pflicht ausnahmsweise, wenn eine
            Datenschutz-Folgenabschätzung nach Art. 35 DSGVO erforderlich
            ist oder personenbezogene Daten geschäftsmäßig zur Übermittlung
            oder für Markt- und Meinungsforschung verarbeitet werden – beides
            ist für die klassische Schreinerei untypisch.
          </p>
        </GuideSection>

        <GuideSection title="Cloud-Software: Auftragsverarbeitungsvertrag nicht vergessen">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Viele der cloudbasierten Programme aus{" "}
            <Link href="/digitalisierung/kalkulationssoftware" className="text-accent hover:underline">
              Kalkulations- und Auftragssoftware
            </Link>{" "}
            oder{" "}
            <Link href="/digitalisierung/cad-cam-software" className="text-accent hover:underline">
              CAD/CAM-Software
            </Link>{" "}
            verarbeiten Kundendaten auf Servern des Anbieters. Sobald ein
            externer Dienstleister personenbezogene Daten in deinem Auftrag
            verarbeitet, schreibt Art. 28 DSGVO einen
            Auftragsverarbeitungsvertrag (AVV) vor, der unter anderem Zweck,
            Umfang, Sicherheitsmaßnahmen und Löschpflichten regelt. Seriöse
            Anbieter stellen den AVV standardmäßig zur Verfügung – prüfe vor
            der Nutzung, ob er vorliegt und unterschrieben wurde. Ein
            fehlender oder unvollständiger AVV kann unabhängig von einem
            tatsächlichen Datenschutzvorfall bebußt werden.
          </p>
        </GuideSection>

        <GuideSection title="Projektfotos veröffentlichen">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Für Fotos von fertigen Projekten gelten zwei Regelwerke
            nebeneinander: das Kunsturhebergesetz (Recht am eigenen Bild)
            und die DSGVO. Reine Möbel- oder Raumaufnahmen ohne erkennbare
            Personen sind in der Regel unproblematisch. Sind Personen zu
            erkennen, brauchst du grundsätzlich deren ausdrückliche
            Einwilligung, bevor du das Bild veröffentlichst – am besten
            schriftlich dokumentiert, da eine Einwilligung jederzeit
            widerrufen werden kann. Prüfe vor der Veröffentlichung
            zusätzlich, ob identifizierende Details wie Hausnummern oder
            Namensschilder im Bild zu sehen sind.
          </p>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Rechtsberatung im Einzelfall. Für
        eine verbindliche Einschätzung zu deinem Betrieb wende dich an eine
        auf Datenschutzrecht spezialisierte Rechtsberatung oder einen
        externen Datenschutzbeauftragten.
      </p>
    </Container>
  );
}
