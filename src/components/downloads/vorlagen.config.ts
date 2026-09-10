/**
 * Datenquelle für /vorlagen.
 *
 * Verkauft wird nicht einzeln, sondern als Paket: ein Komplett-Paket mit
 * allen Vorlagen, oder ein Paket je Kategorie. Es gibt noch keine
 * Kaufabwicklung (kein Stripe) – die Seite zeigt nur den Katalog
 * (Titel/Beschreibung je Vorlage, Pakete mit Preis), ohne funktionierenden
 * Kauf-Button. Stattdessen: Anmeldung zur Benachrichtigung, sobald der Kauf
 * live geht (siehe /vorlagen und NewsletterForm source="vorlagen") –
 * genau wie beim CAD-Katalog unter /cad.
 *
 * `preis` bei den Paketen ist ein Platzhalter und lässt sich jederzeit
 * anpassen, bevor der Kauf tatsächlich freigeschaltet wird.
 */

export type VorlageKategorie =
  | "Arbeitsvorbereitung"
  | "Zeit & Ressourcenplanung"
  | "Produktionsvorbereitung"
  | "Qualitätskontrolle"
  | "Kommunikation & Verwaltung"
  | "Firmenorganisation";

export const VORLAGEN_KATEGORIEN: VorlageKategorie[] = [
  "Arbeitsvorbereitung",
  "Zeit & Ressourcenplanung",
  "Produktionsvorbereitung",
  "Qualitätskontrolle",
  "Kommunikation & Verwaltung",
  "Firmenorganisation",
];

export interface VorlageDef {
  slug: string;
  title: string;
  description: string;
  kategorie: VorlageKategorie;
  /** Format shown as a badge, e.g. "PDF + Word". */
  format: string;
  /** PDF file under public/downloads/. Unset while the file itself isn't ready yet. */
  pdfFile?: string;
  /** Editable companion file (Word/Excel) under public/downloads/. */
  editableFile?: string;
  /** Label for the editable file's download button, e.g. "Word", "Excel". */
  editableFormat?: "Word" | "Excel";
}

export const vorlagen: VorlageDef[] = [
  {
    slug: "auftragszettel",
    title: "Auftragszettel",
    description:
      "Kundendaten, Terminabsprache und Material für den ersten Werkstatt-Termin auf einen Blick festhalten.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "auftragszettel.pdf",
    editableFile: "auftragszettel.docx",
    editableFormat: "Word",
  },
  {
    slug: "angebotsvorlage",
    title: "Angebotsvorlage",
    description:
      "Vollständiges, rechtssicher formuliertes Angebot mit Positionstabelle, Summenblock und Gültigkeitshinweis.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "angebotsvorlage.pdf",
    editableFile: "angebotsvorlage.docx",
    editableFormat: "Word",
  },
  {
    slug: "abtretungserklaerung-versicherung",
    title: "Abtretungserklärung bei Versicherungsschäden",
    description:
      "Damit Kunden die Rechnung direkt über ihre Versicherung abwickeln lassen können, statt in Vorleistung zu gehen.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "abtretungserklaerung-versicherung.pdf",
    editableFile: "abtretungserklaerung-versicherung.docx",
    editableFormat: "Word",
  },
  {
    slug: "ladecheckliste",
    title: "Ladecheckliste",
    description:
      "Werkzeug und Material für Montage- und Baustelleneinsätze vollständig einladen, statt erst vor Ort etwas zu vermissen.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "ladecheckliste.pdf",
    editableFile: "ladecheckliste.docx",
    editableFormat: "Word",
  },
  {
    slug: "zeiterfassungszettel",
    title: "Zeiterfassungszettel",
    description:
      "Fertigungs- und Montagezeit je Auftrag erfassen – Grundlage für Nachkalkulation und Arbeitszeitnachweis.",
    kategorie: "Zeit & Ressourcenplanung",
    format: "PDF + Excel",
    pdfFile: "zeiterfassungszettel.pdf",
    editableFile: "zeiterfassungszettel.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "terminplan",
    title: "Terminplan",
    description:
      "Meilensteine und Termine eines Projekts im Überblick behalten – geplant versus tatsächlich, mit Verantwortlichkeit und Status.",
    kategorie: "Zeit & Ressourcenplanung",
    format: "PDF + Excel",
    pdfFile: "terminplan.pdf",
    editableFile: "terminplan.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "material-maschine-mitarbeiter",
    title: "Material · Maschine · Mitarbeiter",
    description:
      "Materialverbrauch, Maschinenzeit und Personalzeit je Auftrag dokumentieren – für die Nachkalkulation.",
    kategorie: "Zeit & Ressourcenplanung",
    format: "PDF + Excel",
    pdfFile: "material-maschine-mitarbeiter.pdf",
    editableFile: "material-maschine-mitarbeiter.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "zuschnittliste",
    title: "Zuschnittliste",
    description:
      "Bauteile für den Zuschnitt vorbereiten und den Fortschritt dokumentieren – mit Materialart, Maßen und Kantenbearbeitung je Position.",
    kategorie: "Produktionsvorbereitung",
    format: "PDF + Excel",
    pdfFile: "zuschnittliste.pdf",
    editableFile: "zuschnittliste.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "bautagebericht",
    title: "Bautagebericht",
    description:
      "Tägliche Dokumentation der Arbeiten auf der Baustelle – eingesetzte Arbeiter, erbrachte Leistungen und besondere Vorkommnisse.",
    kategorie: "Qualitätskontrolle",
    format: "PDF + Word",
    pdfFile: "bautagebericht.pdf",
    editableFile: "bautagebericht.docx",
    editableFormat: "Word",
  },
  {
    slug: "gespraechsnotiz",
    title: "Gesprächsnotiz",
    description:
      "Kundengespräche strukturiert festhalten – inklusive vereinbarter nächster Schritte mit Zuständigkeit.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "gespraechsnotiz.pdf",
    editableFile: "gespraechsnotiz.docx",
    editableFormat: "Word",
  },
  {
    slug: "email-vorlagen-kundenkommunikation",
    title: "E-Mail-Vorlagen für die Kundenkommunikation",
    description:
      "Sieben fertig formulierte E-Mail-Texte für Angebot, Nachfrage, Rechnung, Zahlungserinnerung, Mahnung und Anfragen – zum direkten Kopieren.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "email-vorlagen-kundenkommunikation.pdf",
    editableFile: "email-vorlagen-kundenkommunikation.docx",
    editableFormat: "Word",
  },
  {
    slug: "teambesprechung-protokoll",
    title: "Teambesprechung-Protokoll",
    description:
      "Ergebnisse und Aufgaben aus der Teambesprechung festhalten – inklusive Anwesenheitsliste und Zuständigkeiten.",
    kategorie: "Firmenorganisation",
    format: "PDF + Word",
    pdfFile: "teambesprechung-protokoll.pdf",
    editableFile: "teambesprechung-protokoll.docx",
    editableFormat: "Word",
  },
];

export interface VorlagenPaket {
  slug: string;
  titel: string;
  beschreibung: string;
  /** Fehlt beim Komplett-Paket (deckt dann alle Kategorien ab). */
  kategorie?: VorlageKategorie;
  /** EUR, Platzhalter – frei anpassbar, solange der Kauf noch nicht live ist. */
  preis: number | null;
  hervorgehoben?: boolean;
}

export const vorlagenPakete: VorlagenPaket[] = [
  {
    slug: "komplett-paket",
    titel: "Komplett-Paket",
    beschreibung: "Alle Vorlagen aus allen Kategorien im Gesamtpaket.",
    preis: 29.99,
    hervorgehoben: true,
  },
  {
    slug: "arbeitsvorbereitung-paket",
    titel: "Arbeitsvorbereitung",
    beschreibung: "Auftragsklärung, Angebot und Vorbereitung des Einsatzes vor Ort.",
    kategorie: "Arbeitsvorbereitung",
    preis: 14.99,
  },
  {
    slug: "zeit-ressourcenplanung-paket",
    titel: "Zeit & Ressourcenplanung",
    beschreibung: "Arbeitszeit, Termine und Ressourcenverbrauch je Auftrag im Blick.",
    kategorie: "Zeit & Ressourcenplanung",
    preis: 11.99,
  },
  {
    slug: "produktionsvorbereitung-paket",
    titel: "Produktionsvorbereitung",
    beschreibung: "Zuschnitt und Fertigungsvorbereitung sauber dokumentiert.",
    kategorie: "Produktionsvorbereitung",
    preis: 4.99,
  },
  {
    slug: "qualitaetskontrolle-paket",
    titel: "Qualitätskontrolle",
    beschreibung: "Baustellendokumentation für Nachvollziehbarkeit und Qualitätssicherung.",
    kategorie: "Qualitätskontrolle",
    preis: 4.99,
  },
  {
    slug: "kommunikation-verwaltung-paket",
    titel: "Kommunikation & Verwaltung",
    beschreibung: "Gesprächsnotizen und fertig formulierte E-Mail-Texte für den Kundenkontakt.",
    kategorie: "Kommunikation & Verwaltung",
    preis: 8.99,
  },
  {
    slug: "firmenorganisation-paket",
    titel: "Firmenorganisation",
    beschreibung: "Struktur für die interne Organisation und Teamabstimmung.",
    kategorie: "Firmenorganisation",
    preis: 4.99,
  },
];
