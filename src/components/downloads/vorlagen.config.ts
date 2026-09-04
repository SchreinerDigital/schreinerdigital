/** Single source of truth for the downloadable templates under /vorlagen. */
export interface VorlageDef {
  slug: string;
  title: string;
  description: string;
  /** Format shown as a badge, e.g. "PDF", "XLSX". */
  format: string;
  /** File under public/downloads/. Unset while the file itself isn't ready yet. */
  file?: string;
}

// Noch keine echten Vorlagen hinterlegt – Einträge hier ergänzen, sobald
// die jeweilige Datei unter public/downloads/ liegt.
export const vorlagen: VorlageDef[] = [];
