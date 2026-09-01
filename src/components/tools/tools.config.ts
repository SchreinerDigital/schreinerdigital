/** Single source of truth for the calculator tools under /tools. */
export interface ToolDef {
  slug: string;
  title: string;
  description: string;
  /** false while only a stub page exists. */
  ready: boolean;
}

export const tools: ToolDef[] = [
  {
    slug: "plattengewicht",
    title: "Plattengewicht",
    description:
      "Gewicht einer Platte aus Maßen und Rohdichte des Werkstoffs berechnen.",
    ready: true,
  },
  {
    slug: "tuerenmass",
    title: "Türenmaß",
    description:
      "Blatt-, Zargen- und Bandmaße aus dem Rohbaumaß der Öffnung ableiten.",
    ready: false,
  },
  {
    slug: "restlaenge",
    title: "Restlänge",
    description:
      "Verschnitt und verbleibende Reststücke bei einem Zuschnittplan ermitteln.",
    ready: false,
  },
  {
    slug: "durchbiegung",
    title: "Durchbiegung",
    description:
      "Durchbiegung eines Regalbodens unter Last abschätzen (Balkenbiegung).",
    ready: false,
  },
  {
    slug: "stundensatz",
    title: "Stundensatz",
    description:
      "Kostendeckenden Stundenverrechnungssatz aus Fixkosten und produktiven Stunden berechnen.",
    ready: false,
  },
];

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}
