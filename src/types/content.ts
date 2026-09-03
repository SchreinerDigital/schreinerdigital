/** Shared content types for the material knowledge base. */

export interface TechnicalDatum {
  /** e.g. "Rohdichte (r12–15)" */
  label: string;
  /** e.g. "0,65–0,75 g/cm³" */
  value: string;
}

/** Frontmatter-style metadata exported from each Holzart MDX file as `export const meta`. */
export interface HolzartMeta {
  slug: string;
  title: string;
  /** Botanical name, e.g. "Quercus robur" */
  botanical?: string;
  /** Alternative / trade names. */
  synonyms?: string[];
  /** Short teaser for listing pages. */
  summary: string;
  /** Broad grouping: "Laubholz" | "Nadelholz" | "Furnier" | … */
  gruppe?: string;
  /** Workshop hardness class as used on the old site: "Hartholz" | "Weichholz". */
  klasse?: string;
  /** DIN 4076 short symbol, e.g. "QCXE". */
  dinCode?: string;
  /** Hero image in /public, e.g. "/holzarten/eiche.jpg". */
  bild?: string;
  /** Ordered list for the technical data table. */
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Plattenwerkstoff MDX file. */
export interface PlattenwerkstoffMeta {
  slug: string;
  title: string;
  /** Short code / abbreviation, e.g. "MDF", "MPX", "OSB/3". */
  kurzname?: string;
  /** Hauptgruppe: "Spanwerkstoff" | "Faserwerkstoff" | "Lagenwerkstoff" | "Verbundwerkstoff" | "Schichtstoffplatte". */
  kategorie?: string;
  /** Alternative / trade names. */
  synonyms?: string[];
  /** Relevant product standard, e.g. "EN 312", "EN 622-5". */
  norm?: string;
  /** Short teaser for listing pages. */
  summary: string;
  /** Hero image in /public, e.g. "/plattenwerkstoffe/spanwerkstoffe.jpg". */
  bild?: string;
  /** Ordered list for the technical data table. */
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

export type ContentCollection = "holzarten" | "plattenwerkstoffe";
