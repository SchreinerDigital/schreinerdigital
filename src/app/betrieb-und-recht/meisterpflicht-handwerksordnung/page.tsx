import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  FaqAccordion,
  GuideSection,
  GuideShell,
  SpecTable,
  StepList,
} from "@/components/tools/guide";

export const metadata: Metadata = {
  title: "Meisterpflicht & Handwerksordnung für Tischler und Schreiner",
  description:
    "Tischler ist ein zulassungspflichtiges Handwerk nach Anlage A der HwO: Welche Wege es zur Selbstständigkeit gibt, wie die Eintragung in die Handwerksrolle abläuft und was ohne sie droht.",
  alternates: { canonical: "/betrieb-und-recht/meisterpflicht-handwerksordnung" },
};

const wege = [
  [
    "Meisterbrief",
    "Du selbst",
    "Meisterprüfung im Tischlerhandwerk abgeschlossen",
  ],
  [
    "Betriebsleiterprinzip (§ 7 Abs. 1 HwO)",
    "Ein fest angestellter, technischer Betriebsleiter",
    "Der Betriebsleiter hat den Meisterbrief oder eine gleichwertige Qualifikation und ist im Betrieb tatsächlich verantwortlich tätig",
  ],
  [
    "Altgesellenregelung (§ 7b HwO)",
    "Du selbst als erfahrener Geselle",
    "Mindestens 6 Jahre Berufspraxis im Tischlerhandwerk, davon mindestens 4 Jahre in leitender Stellung",
  ],
  [
    "Gleichwertige Qualifikation (§ 7 Abs. 2 HwO)",
    "Du selbst mit vergleichbarem Abschluss",
    "Z. B. einschlägiges Ingenieur- oder Techniker-Diplom mit ausreichender praktischer Erfahrung, oder eine im EU-Ausland anerkannte Qualifikation",
  ],
  [
    "Ausnahmebewilligung (§ 8 HwO)",
    "Du selbst im Einzelfall",
    "Nachweis, dass du die zur Ausübung notwendigen Fertigkeiten und Kenntnisse auf anderem Weg erworben hast – Ermessensentscheidung der Handwerkskammer",
  ],
];

const eintragungSteps = [
  {
    title: "Zuständige Handwerkskammer ermitteln",
    body: "Zuständig ist die Handwerkskammer (HWK) am Sitz deines Betriebs. Dort bekommst du das Antragsformular für die Eintragung in die Handwerksrolle, oft auch online.",
  },
  {
    title: "Qualifikationsnachweis zusammenstellen",
    body: "Je nach gewähltem Weg: Meisterbrief, Nachweis der Altgesellenregelung (Zeugnisse, Arbeitsbescheinigungen über die leitende Tätigkeit), Diplom plus Berufserfahrung oder Ausnahmebewilligung.",
  },
  {
    title: "Antrag einreichen",
    body: "Zusammen mit Personalausweis bzw. Aufenthaltstitel, ggf. Gesellschaftsvertrag bei einer GmbH oder GbR, und dem Qualifikationsnachweis bei der Handwerkskammer einreichen.",
  },
  {
    title: "Eintragung in die Handwerksrolle",
    body: "Bei vollständigen Unterlagen ist die Eintragung meist innerhalb weniger Tage erledigt. Erst danach darfst du das zulassungspflichtige Handwerk selbstständig ausüben.",
  },
  {
    title: "Gewerbe anmelden",
    body: "Im Anschluss (oder parallel) meldest du dein Gewerbe beim Gewerbeamt an – die Handwerksrolle-Eintragung ist dafür Voraussetzung.",
  },
];

const faqs = [
  {
    q: "Ist Tischler/Schreiner wirklich meisterpflichtig?",
    a: "Ja. Tischler ist als Nr. 27 in Anlage A der Handwerksordnung gelistet und damit ein zulassungspflichtiges Handwerk – die selbstständige Ausübung setzt grundsätzlich den Meisterbrief oder einen der gleichwertigen Nachweise voraus.",
  },
  {
    q: "Reicht es, wenn ich einen Meister anstelle statt selbst einer zu sein?",
    a: "Ja, das ist das sogenannte Betriebsleiterprinzip nach § 7 Abs. 1 HwO. Der angestellte Meister muss dann tatsächlich als technischer Betriebsleiter im Betrieb tätig sein – eine reine Gefälligkeitseintragung ohne echte Mitarbeit reicht nicht aus.",
  },
  {
    q: "Ich bin seit 5 Jahren Geselle, davon 2 Jahre als Vorarbeiter. Reicht das für die Altgesellenregelung?",
    a: "Nein. § 7b HwO verlangt mindestens 6 Jahre Berufspraxis, davon mindestens 4 Jahre in leitender Stellung. Beide Werte müssen erfüllt sein, nicht nur einer davon.",
  },
  {
    q: "Darf ich als Altgeselle auch Auszubildende einstellen?",
    a: "Nicht automatisch. Die Ausübungsberechtigung nach § 7b HwO erlaubt dir die selbstständige Betriebsführung, aber nicht ohne Weiteres die Ausbildung – dafür brauchst du zusätzlich die Ausbildereignung (AEVO) oder eine gleichwertige Qualifikation.",
  },
  {
    q: "Was passiert, wenn ich ohne Eintragung ein zulassungspflichtiges Handwerk betreibe?",
    a: "Das kann als Ordnungswidrigkeit mit einem Bußgeld von bis zu 10.000 € nach § 117 HwO geahndet werden, zusätzlich kann das Gewerbeamt die Handwerksausübung untersagen. Bei Bußgeldern über 200 € erfolgt ein Eintrag ins Gewerbezentralregister, der sich bei künftigen Verstößen nachteilig auswirken kann. Je nach Fall kann zusätzlich das Schwarzarbeitsbekämpfungsgesetz greifen.",
  },
];

export default function MeisterpflichtPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Meisterpflicht & Handwerksordnung</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Tischler zählt zu den zulassungspflichtigen Handwerken – wer sich
          selbstständig machen will, kommt an der Handwerksordnung nicht
          vorbei. Der Meisterbrief ist dabei nicht der einzige Weg: Ein
          Überblick über Alternativen, den Ablauf der Eintragung und die
          Folgen, wenn sie fehlt.
        </p>
      </div>

      <GuideShell>
        <GuideSection title="Zulassungspflichtiges Handwerk: was das bedeutet">
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Die Handwerksordnung (HwO) teilt Gewerbe in drei Gruppen: Anlage
            A listet die{" "}
            <strong className="text-ink">zulassungspflichtigen Handwerke</strong>,
            deren selbstständige Ausübung eine Eintragung in die
            Handwerksrolle bei der Handwerkskammer voraussetzt. Anlage B1
            enthält{" "}
            <strong className="text-ink">zulassungsfreie Handwerke</strong>{" "}
            ohne Meisterpflicht, Anlage B2 die{" "}
            <strong className="text-ink">handwerksähnlichen Gewerbe</strong>.
            Tischler ist als Nr. 27 der Anlage A gelistet – damit
            zulassungspflichtig.
          </p>
        </GuideSection>

        <GuideSection
          title="Wege zur Selbstständigkeit"
          intro="Der Meisterbrief ist der klassische, aber nicht der einzige Nachweis, mit dem du ein zulassungspflichtiges Handwerk selbstständig führen darfst:"
        >
          <SpecTable
            columns={["Weg", "Wer die Qualifikation erfüllt", "Voraussetzung"]}
            rows={wege}
            note="Angaben ohne Gewähr, Stand der Recherche. Welcher Weg im Einzelfall greift, prüft die zuständige Handwerkskammer."
          />
        </GuideSection>

        <GuideSection
          title="So läuft die Eintragung in die Handwerksrolle ab"
          intro="Unabhängig vom gewählten Weg läuft die Eintragung bei der Handwerkskammer nach einem ähnlichen Muster ab:"
        >
          <StepList steps={eintragungSteps} />
        </GuideSection>

        <GuideSection title="Was droht ohne Eintragung">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Bußgeld:</strong> Bis zu 10.000 €
              nach § 117 HwO für die unerlaubte Ausübung eines
              zulassungspflichtigen Handwerks.
            </li>
            <li>
              <strong className="text-ink">Untersagung:</strong> Die
              Handwerkskammer meldet den Verstoß dem Gewerbeamt, das die
              weitere Ausübung untersagen kann.
            </li>
            <li>
              <strong className="text-ink">Gewerbezentralregister:</strong>{" "}
              Bußgelder über 200 € werden dort eingetragen und wirken sich
              bei künftigen Verstößen nachteilig aus.
            </li>
            <li>
              <strong className="text-ink">Schwarzarbeit:</strong> Je nach
              Fallgestaltung kann zusätzlich das
              Schwarzarbeitsbekämpfungsgesetz greifen.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Rechtsberatung im Einzelfall. Für
        eine verbindliche Auskunft zu deiner konkreten Situation wende dich
        an deine zuständige Handwerkskammer oder eine Rechtsberatung.
      </p>
    </Container>
  );
}
