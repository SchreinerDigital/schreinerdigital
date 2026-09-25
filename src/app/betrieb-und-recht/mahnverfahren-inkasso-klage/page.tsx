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
  title: "Mahnverfahren, Inkasso oder Klage: der richtige Weg nach der Mahnung",
  description:
    "Auch die zweite Mahnung war erfolglos? Gerichtliches Mahnverfahren, Inkassounternehmen oder Klage im Vergleich – Ablauf, Kosten und wann welcher Weg passt.",
  alternates: { canonical: "/betrieb-und-recht/mahnverfahren-inkasso-klage" },
};

const wege = [
  [
    "Gerichtliches Mahnverfahren",
    "Forderung ist unstrittig – der Kunde reagiert einfach nicht",
    "Ab 38 € Gerichtsgebühr, meist vom Schuldner zu erstatten",
  ],
  [
    "Inkassounternehmen",
    "Du willst den Einzug abgeben, Forderung ist unstrittig oder unklar",
    "Provision/Gebühr, bei Erfolg meist als Verzugsschaden erstattungsfähig",
  ],
  [
    "Klage",
    "Der Kunde bestreitet die Forderung (Mangel, Höhe, Ausführung)",
    "Gerichts- und Anwaltskosten, trägt die unterliegende Partei",
  ],
];

const mahnverfahrenSteps = [
  {
    title: "Mahnbescheid beantragen",
    body: "Der Antrag geht online an das zentrale Mahngericht deines Bundeslands – nicht an das normale Amtsgericht am Wohnort des Kunden. Die Gerichtsgebühr liegt ab 38 € (0,5-fache Gebühr nach GKG, gestaffelt nach Forderungshöhe) und wird bei Erfolg der Forderung hinzugerechnet.",
  },
  {
    title: "14 Tage Frist für den Kunden",
    body: "Der Kunde kann jetzt zahlen oder Widerspruch gegen den Mahnbescheid einlegen. Reagiert er gar nicht, war die Sache offenbar tatsächlich unstrittig.",
  },
  {
    title: "Kein Widerspruch: Vollstreckungsbescheid beantragen",
    body: "Ohne fristgerechten Widerspruch kannst du den Vollstreckungsbescheid beantragen – ohne zusätzliche Gerichtsgebühr. Wichtig: Der Antrag muss innerhalb von 6 Monaten nach Zustellung des Mahnbescheids gestellt werden, sonst verfällt er.",
  },
  {
    title: "Wieder 14 Tage Frist, dann vollstreckbarer Titel",
    body: "Legt der Kunde auch gegen den Vollstreckungsbescheid keinen Einspruch ein, hältst du einen vollstreckbaren Titel in der Hand – Grundlage für die Zwangsvollstreckung durch den Gerichtsvollzieher, etwa per Konto- oder Lohnpfändung.",
  },
  {
    title: "Widerspruch: ab ins streitige Verfahren",
    body: "Legt der Kunde zu irgendeinem Zeitpunkt Widerspruch oder Einspruch ein, endet das Mahnverfahren an dieser Stelle. Nur auf gesonderten Antrag (§ 696 ZPO) – und erst nach Vorschuss der weiteren Gerichtskosten – geht der Fall ins normale, streitige Verfahren über. Bei einer von vornherein bestrittenen Forderung ist dieser Umweg meist überflüssig.",
  },
];

const faqs = [
  {
    q: "Kann ich das Mahnverfahren nutzen, wenn der Kunde die Rechnung inhaltlich bestreitet?",
    a: "Besser nicht. Das gerichtliche Mahnverfahren ist für unstrittige Forderungen gemacht. Legt der Kunde Widerspruch ein, endet es sofort – eine Fortsetzung ist nur auf Antrag und gegen Vorschuss weiterer Gerichtskosten möglich. Ist schon vorher klar, dass der Kunde widerspricht (z. B. weil er einen Mangel behauptet), sparst du dir den Umweg und gehst direkt den Klageweg.",
  },
  {
    q: "Brauche ich für das gerichtliche Mahnverfahren einen Anwalt?",
    a: "Nein. Vor dem Mahngericht besteht kein Anwaltszwang, das Verfahren ist bewusst niedrigschwellig und läuft online ab. Anwaltszwang gilt erst, wenn der Fall – etwa nach einem Widerspruch – vor dem Landgericht landet.",
  },
  {
    q: "Wie viel darf ein Inkassounternehmen berechnen?",
    a: "Für außergerichtliches Inkasso höchstens so viel, wie ein Rechtsanwalt nach dem RVG berechnen dürfte (§ 4 Abs. 5 RDGEG). Diese Kosten sind bei berechtigten Forderungen nach der Rechtsprechung des BGH in der Regel vom säumigen Kunden als Verzugsschaden zu erstatten – mit Ausnahmen etwa bei konzerninternen Inkassounternehmen, wo die Erstattungsfähigkeit umstrittener und Gegenstand mehrerer BGH-Verfahren war.",
  },
  {
    q: "Was bringt mir ein Titel, wenn der Kunde gerade kein Geld hat?",
    a: "Eine titulierte Forderung verjährt erst nach 30 Jahren (§ 197 Abs. 1 BGB) statt der regulären 3 Jahre. Du kannst die Zwangsvollstreckung also auch Jahre später erneut versuchen, sobald der Kunde wieder pfändbares Einkommen oder Vermögen hat. Nur für die Zinsen gilt weiterhin die kurze, gesonderte 3-Jahres-Frist.",
  },
  {
    q: "Amtsgericht oder Landgericht – wer ist bei einer Klage zuständig?",
    a: "Bis einschließlich 5.000 € Streitwert ist das Amtsgericht zuständig, ohne Anwaltszwang. Darüber ist das Landgericht zuständig, dort musst du dich anwaltlich vertreten lassen.",
  },
];

export default function MahnverfahrenInkassoKlagePage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/betrieb-und-recht"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Betrieb & Recht
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">Mahnverfahren, Inkasso oder Klage?</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Auch die zweite Mahnung war erfolglos. Jetzt hast du im Kern drei
          Wege, deine Forderung durchzusetzen – und welcher passt, hängt vor
          allem davon ab, ob die Forderung unstrittig ist oder dein Kunde sie
          bestreitet.
        </p>
      </div>

      <GuideShell>
        <GuideSection
          title="Drei Wege im Überblick"
          intro="Alle drei Wege können am Ende zu deinem Geld führen – aber nicht jeder passt zu jeder Situation:"
        >
          <SpecTable
            columns={["Weg", "Passt, wenn ...", "Kosten (grob)"]}
            rows={wege}
            note="Der entscheidende Unterschied: Das Mahnverfahren funktioniert nur, solange der Kunde nicht widerspricht. Bestreitet er die Forderung inhaltlich, bringt nur die Klage eine echte Klärung."
          />
        </GuideSection>

        <GuideSection
          title="Das gerichtliche Mahnverfahren Schritt für Schritt"
          intro="Der günstigste und schnellste Weg zu einem vollstreckbaren Titel – solange die Forderung unstrittig bleibt:"
        >
          <StepList steps={mahnverfahrenSteps} />
        </GuideSection>

        <GuideSection
          title="Ein Inkassounternehmen beauftragen"
          intro="Statt selbst weiter zu mahnen, kannst du den Einzug an ein Inkassounternehmen abgeben:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              Das Inkassounternehmen übernimmt Kommunikation und Einzug gegen
              eine Provision oder eine Grundgebühr plus Provision.
            </li>
            <li>
              Die Kosten sind nach gefestigter BGH-Rechtsprechung grundsätzlich
              als Verzugsschaden vom Kunden erstattungsfähig – begrenzt auf
              das, was ein Rechtsanwalt nach RVG berechnet hätte
              (§ 4 Abs. 5 RDGEG, Schadensminderungspflicht nach § 254 BGB).
            </li>
            <li>
              Vorsicht bei konzerninternen oder verbundenen
              Inkassounternehmen: Hier ist die Erstattungsfähigkeit
              eingeschränkter und war mehrfach Gegenstand höchstrichterlicher
              Verfahren.
            </li>
            <li>
              Ein Inkassounternehmen erwirkt selbst keinen vollstreckbaren
              Titel. Bleibt der Kunde uneinsichtig, landet der Fall am Ende
              oft doch beim Mahnverfahren oder bei der Klage.
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Wann nur die Klage weiterhilft"
          intro="Bestreitet der Kunde die Forderung – etwa mit einem behaupteten Mangel, einer abweichenden Auftragslage oder einer Gegenforderung –, stoppt ein einfacher Widerspruch das Mahnverfahren sofort. Hier bringt nur eine Klage eine belastbare gerichtliche Klärung:"
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-ink">Zuständigkeit:</strong> Bis
              einschließlich 5.000 € Streitwert das Amtsgericht, darüber das
              Landgericht – dort gilt Anwaltszwang.
            </li>
            <li>
              <strong className="text-ink">Prozesskostenrisiko:</strong> Die
              unterliegende Partei trägt grundsätzlich die Gerichts- und
              Anwaltskosten beider Seiten, gestaffelt nach dem Streitwert.
            </li>
          </ul>
        </GuideSection>

        <GuideSection
          title="Warum sich ein Titel überhaupt lohnt"
          intro="Ob Vollstreckungsbescheid oder Urteil: Am Ende zählt der vollstreckbare Titel."
        >
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              Eine titulierte Forderung verjährt erst nach 30 Jahren
              (§ 197 Abs. 1 BGB) – statt der sonst üblichen 3 Jahre.
            </li>
            <li>
              Aus dem Titel kann der Gerichtsvollzieher die Zwangsvollstreckung
              betreiben, zum Beispiel per Konto- oder Lohnpfändung – auch
              noch Jahre später, sobald der Kunde wieder pfändbar ist.
            </li>
            <li>
              Eine Ausnahme gilt für die Zinsen selbst: Sie verjähren
              weiterhin gesondert nach der regulären 3-Jahres-Frist.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Praxistipps für den Betrieb">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>
              Bei kleineren, zweifelsfrei unstrittigen Forderungen ist das
              gerichtliche Mahnverfahren meist der günstigste und schnellste
              Weg zu einem Titel.
            </li>
            <li>
              Ein Inkassounternehmen lohnt sich vor allem, wenn dir selbst die
              Zeit für das Mahnwesen fehlt oder du den direkten Kontakt zum
              säumigen Kunden abgeben willst.
            </li>
            <li>
              Widerspricht der Kunde inhaltlich, nicht auf Zeit spielen: Das
              Mahnverfahren bringt hier nichts mehr – nur die Klage schafft
              Klarheit.
            </li>
            <li>
              Dokumentiere von Anfang an lückenlos: Auftrag, Abnahme und alle
              Mahnungen sind die Grundlage für jeden der drei Wege.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Häufig gestellte Fragen (FAQ)">
          <FaqAccordion items={faqs} />
        </GuideSection>
      </GuideShell>

      <p className="mt-12 max-w-2xl border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr und keine Rechtsberatung im Einzelfall. Für
        eine verbindliche Einschätzung zu deinem Betrieb oder einer konkreten
        Forderung wende dich an eine Rechtsanwältin oder einen Rechtsanwalt
        für Forderungsmanagement oder Zivilrecht.
      </p>
    </Container>
  );
}
