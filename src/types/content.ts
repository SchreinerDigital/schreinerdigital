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
  /** Short teaser for listing pages. */
  summary: string;
  /** Broad grouping: "Laubholz" | "Nadelholz" | "Furnier" | … */
  gruppe?: string;
  /** Ordered list for the technical data table. */
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Plattenwerkstoff MDX file. */
export interface PlattenwerkstoffMeta {
  slug: string;
  title: string;
  summary: string;
  /** e.g. "Spanplatte" | "MDF" | "Sperrholz" | … */
  kategorie?: string;
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

export type ContentCollection = "holzarten" | "plattenwerkstoffe";
