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
      "Türblatt-, Zargen- und Wandstärkemaß aus dem Rohbaumaß der Maueröffnung nach DIN 18101 ableiten.",
    ready: true,
  },
  {
    slug: "restlaenge",
    title: "Restlänge",
    description:
      "Restlänge einer Kantenbandrolle aus Außen- und Innendurchmesser sowie Banddicke berechnen.",
    ready: true,
  },
  {
    slug: "durchbiegung",
    title: "Durchbiegung",
    description:
      "Durchbiegung eines Regal- oder Schrankbodens unter Last aus Werkstoff, Abmessungen und Belastungsart abschätzen.",
    ready: true,
  },
  {
    slug: "stundensatz",
    title: "Stundensatz",
    description:
      "Kostendeckenden Stundenverrechnungssatz aus Fixkosten und produktiven Stunden berechnen.",
    ready: true,
  },
];

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}
