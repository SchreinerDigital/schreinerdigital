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
];
