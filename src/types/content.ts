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
  /** Trade / secondary names, e.g. ["Weißeiche", "Roteiche"] */
  synonyms?: string[];
  /** Short teaser for listing pages. */
  summary: string;
  /** Broad grouping: "Laubholz" | "Nadelholz" | "Furnier" | … */
  gruppe?: string;
  /** Old-site classification: "Hartholz" | "Weichholz" */
  klasse?: string;
  /** DIN 4076 short code */
  dinCode?: string;
  /** Path to the hero image under /public, e.g. "/holzarten/eiche.jpg" */
  bild?: string;
  /** Attribution text for licensed hero images, e.g. "Das Ohr, Wikimedia Commons, CC BY-SA 3.0" */
  bildCredit?: string;
  /** Link target for bildCredit, e.g. the license URL */
  bildCreditHref?: string;
  /** Ordered list for the technical data table. */
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Plattenwerkstoff MDX file. */
export interface PlattenwerkstoffMeta {
  slug: string;
  title: string;
  /** Short code, e.g. "MDF", "OSB/3" */
  kurzname?: string;
  summary: string;
  /** e.g. "Spanwerkstoff" | "Faserwerkstoff" | "Lagenwerkstoff" | … */
  kategorie?: string;
  /** Trade / secondary names */
  synonyms?: string[];
  /** Relevant product standard, e.g. "EN 312" */
  norm?: string;
  /** Path to the hero image under /public, e.g. "/plattenwerkstoffe/spanwerkstoffe.jpg" */
  bild?: string;
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Verbindungstechnik MDX file. */
export interface VerbindungMeta {
  slug: string;
  title: string;
  /** Short/trade name, e.g. "Riffeldübel", "Lamello", "Konfirmat" */
  kurzname?: string;
  summary: string;
  /** e.g. "Traditionelle Holzverbindung" | "Dübeltechnik" | "Beschlagverbindung" | "Schraub- und Klebeverbindung" */
  kategorie?: string;
  /** Trade / secondary names */
  synonyms?: string[];
  /** Relevant standard, e.g. "DIN 68150" */
  norm?: string;
  /** Path to the hero image under /public, e.g. "/verbindungstechnik/duebeltechnik.jpg" */
  bild?: string;
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Beschlag MDX file. */
export interface BeschlagMeta {
  slug: string;
  title: string;
  /** Short/trade name, e.g. "Topfscharnier", "Tandembox", "Tip-On" */
  kurzname?: string;
  summary: string;
  /** e.g. "Scharniere" | "Auszüge" | "Griffe und Bedienelemente" | "Funktionsbeschläge" */
  kategorie?: string;
  /** Trade / secondary names */
  synonyms?: string[];
  /** Relevant standard, e.g. "EN 15570" */
  norm?: string;
  /** Path to the hero image under /public, e.g. "/beschlaege/scharniere.jpg" */
  bild?: string;
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

/** Frontmatter-style metadata exported from each Oberfläche MDX file. */
export interface OberflaecheMeta {
  slug: string;
  title: string;
  /** Short/trade name, e.g. "DD-Lack", "Hartwachsöl" */
  kurzname?: string;
  summary: string;
  /** e.g. "Öle und Wachse" | "Lacke" | "Beizen und Lasuren" */
  kategorie?: string;
  /** Trade / secondary names */
  synonyms?: string[];
  /** Relevant standard, e.g. "DIN EN 204" */
  norm?: string;
  /** Path to the hero image under /public, e.g. "/oberflaechen/lacke.jpg" */
  bild?: string;
  kennwerte?: TechnicalDatum[];
  draft?: boolean;
}

export type ContentCollection =
  | "holzarten"
  | "plattenwerkstoffe"
  | "verbindungstechnik"
  | "beschlaege"
  | "oberflaechen";
