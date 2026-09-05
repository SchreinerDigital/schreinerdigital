/**
 * Datenquelle für /cad – extrahiert aus der Alt-Website (WordPress/WooCommerce,
 * https://schreinerdigital.de/downloads-2/cad/) und mit dem Nutzer abgestimmt.
 *
 * Es gibt noch keine Kaufabwicklung (kein Stripe) und keine echten DWG-Dateien –
 * die Seite zeigt nur den Katalog (Titel/Beschreibung), ohne funktionierende
 * Kauf-Buttons. Stattdessen: Anmeldung zur Benachrichtigung, sobald der Kauf
 * live geht (siehe /cad und NewsletterForm source="cad").
 *
 * `preis` ist echt und bleibt hier hinterlegt, wird auf /cad aktuell aber
 * bewusst nicht angezeigt, solange kein Kauf möglich ist.
 */

export interface CadProdukt {
  slug: string;
  titel: string;
  kategorie: "Einbauschrank" | "Moebelbau" | "Innenausbau";
  beschreibung: string;
  /** EUR, null = Preis noch offen (auf der Alt-Seite nur 0,00-€-Platzhalter). */
  preis: number | null;
  istPaketAngebot?: boolean;
  /** true = auf der Alt-Seite ohne Inhalt, noch nicht veröffentlichen. */
  draft?: boolean;
}

export interface CadPaket {
  slug: string;
  titel: string;
  beschreibung: string;
  /** Klartext-Liste für die Karte. */
  enthaelt: string[];
  updateMonate: 12 | 24;
  preis: number | null;
  hervorgehoben?: boolean;
}

export const CATEGORY_LABELS: Record<CadProdukt["kategorie"], string> = {
  Einbauschrank: "Einbauschrank",
  Moebelbau: "Möbelbau",
  Innenausbau: "Innenausbau",
};

export const cadPakete: CadPaket[] = [
  {
    slug: "premium-paket",
    titel: "Premium-Paket",
    beschreibung: "Alle Vorlagen im Komplettpack.",
    enthaelt: [
      "Alle Inhalte des Möbelbau-Pakets",
      "Alle Inhalte des Innenausbau-Pakets",
    ],
    updateMonate: 24,
    preis: null,
    hervorgehoben: true,
  },
  {
    slug: "moebelbau-paket",
    titel: "Möbelbau-Paket",
    beschreibung: "Nützliche Vorlagen für deine DIN-Zeichnung im Möbelbau!",
    enthaelt: [
      "Vorlagedatei",
      "Bauweisen",
      "Beschläge",
      "Schrauben",
      "Schubladen",
      "Türvarianten",
      "Verbindungen",
      "Verbindungsmittel",
      "Einbauschrank-Paket",
    ],
    updateMonate: 12,
    preis: null,
  },
  {
    slug: "innenausbau-paket",
    titel: "Innenausbau-Paket",
    beschreibung: "Nützliche Vorlagen für deine DIN-Zeichnung im Innenausbau!",
    enthaelt: [
      "Vorlagedatei",
      "Deckenverkleidung",
      "Fenster",
      "Innentüren",
      "Haustüren",
      "Wandverkleidungen",
      "Wandaufbauten",
    ],
    updateMonate: 12,
    preis: null,
  },
];

export const cadProdukte: CadProdukt[] = [
  // Einbauschrank
  {
    slug: "einbauschrank-komplett-paket",
    titel: "Komplett-Paket Einbauschrank",
    kategorie: "Einbauschrank",
    beschreibung: "Türanschläge, Anschlüsse, Rückwände, Korpusseiten, etc.",
    preis: 12.99,
    istPaketAngebot: true,
  },
  {
    slug: "einbauschrank-rueckwaende",
    titel: "Einbauschrank Rückwände",
    kategorie: "Einbauschrank",
    beschreibung: "Verschiedene Arten der Rückwandeinbauarten.",
    preis: 4.99,
  },
  {
    slug: "einbauschrank-korpusseiten",
    titel: "Einbauschrank Korpusseiten",
    kategorie: "Einbauschrank",
    beschreibung: "Korpusseiten im System 32.",
    preis: 2.49,
  },
  {
    slug: "einbauschrank-tueranschlag",
    titel: "Einbauschrank Türanschlag",
    kategorie: "Einbauschrank",
    beschreibung: "Einschlagend, aufschlagend, überfälzt.",
    preis: 4.99,
  },
  {
    slug: "einbauschrank-anschluesse",
    titel: "Einbauschrank Anschlüsse",
    kategorie: "Einbauschrank",
    beschreibung: "Sockel, Wandanschluss, Deckenanschluss.",
    preis: 4.99,
  },
  // Möbelbau
  {
    slug: "moebelbau-vorlagedatei",
    titel: "Vorlagedatei",
    kategorie: "Moebelbau",
    beschreibung: "Vorbereitete Layer, Bemaßungen, Schriftfelder, Papierbereich.",
    preis: 14.99,
  },
  {
    slug: "moebelbau-bauweisen",
    titel: "Bauweisen",
    kategorie: "Moebelbau",
    beschreibung: "Brettbauweise, Rahmenbauweise, Stollenbauweise, Plattenbauweise.",
    preis: 4.99,
  },
  {
    slug: "moebelbau-beschlaege",
    titel: "Beschläge",
    kategorie: "Moebelbau",
    beschreibung: "Bänder, Scharniere, Schlösser, Möbelverbinder, etc.",
    preis: 4.99,
  },
  {
    slug: "moebelbau-schrauben",
    titel: "Schrauben",
    kategorie: "Moebelbau",
    beschreibung: "Senkkopf, Panhead, Linsenkopf, verschiedene Längen und Dicken.",
    preis: 2.49,
  },
  {
    slug: "moebelbau-schubladen",
    titel: "Schubladen",
    kategorie: "Moebelbau",
    beschreibung: "Klassische u. mechanische Führung, Boden, Seiten, Vorder- u. Hinterstück, etc.",
    preis: 9.99,
  },
  {
    slug: "moebelbau-tuervarianten",
    titel: "Türvarianten",
    kategorie: "Moebelbau",
    beschreibung: "DIN links, DIN rechts, verschiedene Anschläge, etc.",
    preis: 4.99,
  },
  {
    slug: "moebelbau-verbindungen",
    titel: "Verbindungen",
    kategorie: "Moebelbau",
    beschreibung: "Gratleisten, Vollholzverbindungen, Plattenverbindungen, etc.",
    preis: 2.49,
  },
  {
    slug: "moebelbau-verbindungsmittel",
    titel: "Verbindungsmittel",
    kategorie: "Moebelbau",
    beschreibung: "Dübel, Lamellos, Leimfugen, Keku, Winkelfedern, Ziernägel.",
    preis: 4.99,
  },
  // Innenausbau – nur die Vorlagedatei hatte auf der Alt-Seite echten Inhalt,
  // die übrigen 7 waren dort leere Platzhalter (draft, siehe Bauplan Abschnitt 4.4).
  {
    slug: "innenausbau-vorlagedatei",
    titel: "Vorlagedatei",
    kategorie: "Innenausbau",
    beschreibung: "Vorbereitete Layer, Bemaßungen, Schriftfelder, Papierbereich.",
    preis: 14.99,
  },
  {
    slug: "innenausbau-deckenverkleidungen",
    titel: "Deckenverkleidungen",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-dichtungen",
    titel: "Dichtungen",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-fenster",
    titel: "Fenster",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-haustueren",
    titel: "Haustüren",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-innentueren",
    titel: "Innentüren",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-wandaufbauten",
    titel: "Wandaufbauten",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
  {
    slug: "innenausbau-wandverkleidungen",
    titel: "Wandverkleidungen",
    kategorie: "Innenausbau",
    beschreibung: "",
    preis: null,
    draft: true,
  },
];

export const cadVorteile = [
  {
    titel: "Sofortiger Download",
    text: "Direkt nach dem Kauf verfügbar – kein Warten, sofort loslegen.",
  },
  {
    titel: "Unbegrenzte Nutzung",
    text: "Einmal zahlen, unbegrenzt verwenden – keine laufenden Kosten.",
  },
  {
    titel: "Individuell anpassbar",
    text: "Alle Vorlagen lassen sich leicht auf dein Unternehmen zuschneiden (DWG-Format, frei bearbeitbar).",
  },
];

export const cadFaq = [
  {
    q: "Kann ich die Vorlagen bearbeiten?",
    a: "Ja, alle Vorlagen sind im DWG-Format erstellt und können frei angepasst werden.",
  },
  {
    q: "Bekomme ich Updates?",
    a: "Ja, beim Möbelbau- sowie beim Innenausbau-Paket gibt es 12 Monate kostenlose Updates. Beim Premium-Paket sind es 24 Monate kostenlose Updates.",
  },
  {
    q: "Wie erhalte ich die Dateien?",
    a: "Nach dem Kauf stehen die Vorlagen sofort als Download zur Verfügung.",
  },
];
