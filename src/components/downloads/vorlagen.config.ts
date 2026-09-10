/** Single source of truth for the downloadable templates under /vorlagen. */
export interface VorlageDef {
  slug: string;
  title: string;
  description: string;
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
    format: "PDF + Word",
    pdfFile: "auftragszettel.pdf",
    editableFile: "auftragszettel.docx",
    editableFormat: "Word",
  },
  {
    slug: "zeiterfassungszettel",
    title: "Zeiterfassungszettel",
    description:
      "Fertigungs- und Montagezeit je Auftrag erfassen – Grundlage für Nachkalkulation und Arbeitszeitnachweis.",
    format: "PDF + Excel",
    pdfFile: "zeiterfassungszettel.pdf",
    editableFile: "zeiterfassungszettel.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "angebotsvorlage",
    title: "Angebotsvorlage",
    description:
      "Vollständiges, rechtssicher formuliertes Angebot mit Positionstabelle, Summenblock und Gültigkeitshinweis.",
    format: "PDF + Word",
    pdfFile: "angebotsvorlage.pdf",
    editableFile: "angebotsvorlage.docx",
    editableFormat: "Word",
  },
  {
    slug: "gespraechsnotiz",
    title: "Gesprächsnotiz",
    description:
      "Kundengespräche strukturiert festhalten – inklusive vereinbarter nächster Schritte mit Zuständigkeit.",
    format: "PDF + Word",
    pdfFile: "gespraechsnotiz.pdf",
    editableFile: "gespraechsnotiz.docx",
    editableFormat: "Word",
  },
  {
    slug: "material-maschine-mitarbeiter",
    title: "Material · Maschine · Mitarbeiter",
    description:
      "Materialverbrauch, Maschinenzeit und Personalzeit je Auftrag dokumentieren – für die Nachkalkulation.",
    format: "PDF + Excel",
    pdfFile: "material-maschine-mitarbeiter.pdf",
    editableFile: "material-maschine-mitarbeiter.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "abtretungserklaerung-versicherung",
    title: "Abtretungserklärung bei Versicherungsschäden",
    description:
      "Damit Kunden die Rechnung direkt über ihre Versicherung abwickeln lassen können, statt in Vorleistung zu gehen.",
    format: "PDF + Word",
    pdfFile: "abtretungserklaerung-versicherung.pdf",
    editableFile: "abtretungserklaerung-versicherung.docx",
    editableFormat: "Word",
  },
  {
    slug: "zuschnittliste",
    title: "Zuschnittliste",
    description:
      "Bauteile für den Zuschnitt vorbereiten und den Fortschritt dokumentieren – mit Materialart, Maßen und Kantenbearbeitung je Position.",
    format: "PDF + Excel",
    pdfFile: "zuschnittliste.pdf",
    editableFile: "zuschnittliste.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "terminplan",
    title: "Terminplan",
    description:
      "Meilensteine und Termine eines Projekts im Überblick behalten – geplant versus tatsächlich, mit Verantwortlichkeit und Status.",
    format: "PDF + Excel",
    pdfFile: "terminplan.pdf",
    editableFile: "terminplan.xlsx",
    editableFormat: "Excel",
  },
  {
    slug: "bautagebericht",
    title: "Bautagebericht",
    description:
      "Tägliche Dokumentation der Arbeiten auf der Baustelle – eingesetzte Arbeiter, erbrachte Leistungen und besondere Vorkommnisse.",
    format: "PDF + Word",
    pdfFile: "bautagebericht.pdf",
    editableFile: "bautagebericht.docx",
    editableFormat: "Word",
  },
  {
    slug: "ladecheckliste",
    title: "Ladecheckliste",
    description:
      "Werkzeug und Material für Montage- und Baustelleneinsätze vollständig einladen, statt erst vor Ort etwas zu vermissen.",
    format: "PDF + Word",
    pdfFile: "ladecheckliste.pdf",
    editableFile: "ladecheckliste.docx",
    editableFormat: "Word",
  },
  {
    slug: "teambesprechung-protokoll",
    title: "Teambesprechung-Protokoll",
    description:
      "Ergebnisse und Aufgaben aus der Teambesprechung festhalten – inklusive Anwesenheitsliste und Zuständigkeiten.",
    format: "PDF + Word",
    pdfFile: "teambesprechung-protokoll.pdf",
    editableFile: "teambesprechung-protokoll.docx",
    editableFormat: "Word",
  },
  {
    slug: "email-vorlagen-kundenkommunikation",
    title: "E-Mail-Vorlagen für die Kundenkommunikation",
    description:
      "Sieben fertig formulierte E-Mail-Texte für Angebot, Nachfrage, Rechnung, Zahlungserinnerung, Mahnung und Anfragen – zum direkten Kopieren.",
    format: "PDF + Word",
    pdfFile: "email-vorlagen-kundenkommunikation.pdf",
    editableFile: "email-vorlagen-kundenkommunikation.docx",
    editableFormat: "Word",
  },
];
