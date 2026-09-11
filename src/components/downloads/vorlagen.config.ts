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
  {
    slug: "aufmassblatt",
    title: "Aufmaßblatt",
    description:
      "Maße und Rahmenbedingungen direkt beim Kundentermin strukturiert festhalten – als Grundlage für Angebot und Fertigung.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "aufmassblatt.pdf",
    editableFile: "aufmassblatt.docx",
    editableFormat: "Word",
  },
  {
    slug: "kundendatenblatt",
    title: "Kundendatenblatt",
    description:
      "Erstkontakt strukturiert erfassen – Kontaktdaten, Projektart und gewünschter Besichtigungstermin auf einen Blick.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "kundendatenblatt.pdf",
    editableFile: "kundendatenblatt.docx",
    editableFormat: "Word",
  },
  {
    slug: "projektuebersicht-kapazitaetsplaner",
    title: "Projektübersicht / Kapazitätsplaner",
    description:
      "Alle laufenden Projekte auf einen Blick – Zeitraum, Verantwortlichkeit und Status je Auftrag, kategorienübergreifend.",
    kategorie: "Zeit & Ressourcenplanung",
    format: "PDF + Excel",
    pdfFile: "projektuebersicht-kapazitaetsplaner.pdf",
    editableFile: "projektuebersicht-kapazitaetsplaner.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "urlaubsplaner",
    title: "Urlaubs- und Abwesenheitsplaner",
    description:
      "Abwesenheiten im Team frühzeitig abstimmen und Kapazitäten für das ganze Jahr im Blick behalten.",
    kategorie: "Zeit & Ressourcenplanung",
    format: "PDF + Excel",
    pdfFile: "urlaubsplaner.pdf",
    editableFile: "urlaubsplaner.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "materialbestellliste",
    title: "Materialbestellliste",
    description:
      "Benötigtes Material für ein Projekt sammeln und beim Lieferanten bestellen – mit Bestell- und Liefertermin.",
    kategorie: "Produktionsvorbereitung",
    format: "PDF + Excel",
    pdfFile: "materialbestellliste.pdf",
    editableFile: "materialbestellliste.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "beschlagsliste",
    title: "Beschlagsliste",
    description: "Benötigte Beschläge je Bauteil erfassen – für Bestellung und Montage.",
    kategorie: "Produktionsvorbereitung",
    format: "PDF + Excel",
    pdfFile: "beschlagsliste.pdf",
    editableFile: "beschlagsliste.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "oberflaechenauftrag",
    title: "Oberflächenauftrag",
    description:
      "Vorgaben zur Oberflächenbehandlung je Bauteil festhalten, bevor es in die Lackiererei geht.",
    kategorie: "Produktionsvorbereitung",
    format: "PDF + Word",
    pdfFile: "oberflaechenauftrag.pdf",
    editableFile: "oberflaechenauftrag.docx",
    editableFormat: "Word",
  },
  {
    slug: "lieferschein",
    title: "Lieferschein",
    description:
      "Gelieferte Ware nachvollziehbar dokumentieren – inklusive Empfangsbestätigung durch den Kunden.",
    kategorie: "Produktionsvorbereitung",
    format: "PDF + Word",
    pdfFile: "lieferschein.pdf",
    editableFile: "lieferschein.docx",
    editableFormat: "Word",
  },
  {
    slug: "abnahmeprotokoll",
    title: "Abnahmeprotokoll",
    description:
      "Fertigstellung der Arbeiten gemeinsam mit dem Kunden dokumentieren – inklusive Mängelfeststellung (§ 640 BGB, § 12 VOB/B).",
    kategorie: "Qualitätskontrolle",
    format: "PDF + Word",
    pdfFile: "abnahmeprotokoll.pdf",
    editableFile: "abnahmeprotokoll.docx",
    editableFormat: "Word",
  },
  {
    slug: "maengelliste",
    title: "Mängelliste",
    description:
      "Festgestellte Mängel über den gesamten Projektverlauf nachvollziehbar dokumentieren – mit Frist und Status.",
    kategorie: "Qualitätskontrolle",
    format: "PDF + Excel",
    pdfFile: "maengelliste.pdf",
    editableFile: "maengelliste.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "endkontrolle-checkliste",
    title: "Endkontrolle vor Auslieferung",
    description: "Qualität und Vollständigkeit prüfen, bevor ein Werkstück die Werkstatt verlässt.",
    kategorie: "Qualitätskontrolle",
    format: "PDF + Word",
    pdfFile: "endkontrolle-checkliste.pdf",
    editableFile: "endkontrolle-checkliste.docx",
    editableFormat: "Word",
  },
  {
    slug: "reklamationsprotokoll",
    title: "Reklamationsprotokoll",
    description: "Kundenreklamationen strukturiert aufnehmen und bis zur Lösung nachverfolgen.",
    kategorie: "Qualitätskontrolle",
    format: "PDF + Word",
    pdfFile: "reklamationsprotokoll.pdf",
    editableFile: "reklamationsprotokoll.docx",
    editableFormat: "Word",
  },
  {
    slug: "rechnungsvorlage",
    title: "Rechnungsvorlage",
    description: "Rechnung für erbrachte Leistungen – mit den Pflichtangaben nach § 14 UStG.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "rechnungsvorlage.pdf",
    editableFile: "rechnungsvorlage.docx",
    editableFormat: "Word",
  },
  {
    slug: "abwesenheitsnotiz-vorlagen",
    title: "Abwesenheitsnotiz-Vorlagen",
    description:
      "Drei fertig formulierte Auto-Antworten für Urlaub, Betriebsurlaub und Feiertage – zum direkten Kopieren.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "abwesenheitsnotiz-vorlagen.pdf",
    editableFile: "abwesenheitsnotiz-vorlagen.docx",
    editableFormat: "Word",
  },
  {
    slug: "retourenschein",
    title: "Rücksendung / Retourenschein",
    description: "Rücksendung nicht benötigter Ware gegenüber dem Kunden nachvollziehbar begleiten.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "retourenschein.pdf",
    editableFile: "retourenschein.docx",
    editableFormat: "Word",
  },
  {
    slug: "email-vorlagen-kundenkommunikation-teil2",
    title: "E-Mail-Vorlagen für die Kundenkommunikation – Teil 2",
    description:
      "Sechs weitere fertig formulierte E-Mail-Texte für Kostenschätzung, Akonto-Rechnung, Kapazitätsabsagen und Bewerbungen.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "email-vorlagen-kundenkommunikation-teil2.pdf",
    editableFile: "email-vorlagen-kundenkommunikation-teil2.docx",
    editableFormat: "Word",
  },
  {
    slug: "projektordner-register",
    title: "Projektordner-Register",
    description: "Einheitliche Struktur für den Papier- oder Cloud-Ordner je Kundenprojekt.",
    kategorie: "Firmenorganisation",
    format: "PDF + Word",
    pdfFile: "projektordner-register.pdf",
    editableFile: "projektordner-register.docx",
    editableFormat: "Word",
  },
  {
    slug: "ablagesystem-buchhaltung",
    title: "Ablagesystem für Buchhaltungsunterlagen",
    description:
      "Eine einheitliche Ordnerstruktur erleichtert die Zusammenarbeit mit Steuerberatung und Buchhaltung.",
    kategorie: "Firmenorganisation",
    format: "PDF + Word",
    pdfFile: "ablagesystem-buchhaltung.pdf",
    editableFile: "ablagesystem-buchhaltung.docx",
    editableFormat: "Word",
  },
  {
    slug: "bestaetigung-elternzeit",
    title: "Bestätigung der Elternzeit",
    description: "Schriftliche Bestätigung der Elternzeit gegenüber Mitarbeitenden (§ 16, § 17 BEEG).",
    kategorie: "Firmenorganisation",
    format: "PDF + Word",
    pdfFile: "bestaetigung-elternzeit.pdf",
    editableFile: "bestaetigung-elternzeit.docx",
    editableFormat: "Word",
  },
  {
    slug: "einarbeitungsplan",
    title: "Einarbeitungsplan für neue Mitarbeiter",
    description: "Neue Kolleginnen und Kollegen strukturiert einarbeiten – von Tag 1 bis zur ersten Woche.",
    kategorie: "Firmenorganisation",
    format: "PDF + Word",
    pdfFile: "einarbeitungsplan.pdf",
    editableFile: "einarbeitungsplan.docx",
    editableFormat: "Word",
  },
  {
    slug: "auftragsbestaetigung",
    title: "Auftragsbestätigung",
    description:
      "Auftragserteilung des Kunden schriftlich bestätigen – der Vertrag kommt damit verbindlich zustande.",
    kategorie: "Arbeitsvorbereitung",
    format: "PDF + Word",
    pdfFile: "auftragsbestaetigung.pdf",
    editableFile: "auftragsbestaetigung.docx",
    editableFormat: "Word",
  },
  {
    slug: "anzahlungsrechnung",
    title: "Anzahlungsrechnung",
    description:
      "Abschlagsrechnung (Akontorechnung) für eine vereinbarte Anzahlung vor Projektbeginn.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "anzahlungsrechnung.pdf",
    editableFile: "anzahlungsrechnung.docx",
    editableFormat: "Word",
  },
  {
    slug: "zahlungserinnerung-brief",
    title: "Zahlungserinnerung",
    description: "Freundliche erste Erinnerung an eine ausstehende Zahlung – vor der förmlichen Mahnung.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "zahlungserinnerung-brief.pdf",
    editableFile: "zahlungserinnerung-brief.docx",
    editableFormat: "Word",
  },
  {
    slug: "mahnung-1",
    title: "1. Mahnung",
    description: "Erste förmliche Mahnung nach erfolgloser Zahlungserinnerung.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "mahnung-1.pdf",
    editableFile: "mahnung-1.docx",
    editableFormat: "Word",
  },
  {
    slug: "mahnung-2",
    title: "2. Mahnung",
    description: "Letzte Mahnung vor Einleitung weiterer rechtlicher Schritte.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "mahnung-2.pdf",
    editableFile: "mahnung-2.docx",
    editableFormat: "Word",
  },
  {
    slug: "storno-rechnung",
    title: "Stornorechnung",
    description: "Vollständige Stornierung einer fehlerhaft ausgestellten Rechnung.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "storno-rechnung.pdf",
    editableFile: "storno-rechnung.docx",
    editableFormat: "Word",
  },
  {
    slug: "gutschrift",
    title: "Gutschrift",
    description:
      "Teilweise oder vollständige Gutschrift zu einer bereits gestellten Rechnung – z. B. bei Reklamation oder Rücksendung.",
    kategorie: "Kommunikation & Verwaltung",
    format: "PDF + Word",
    pdfFile: "gutschrift.pdf",
    editableFile: "gutschrift.docx",
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
