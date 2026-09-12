/** Single source of truth for the calculator tools under /tools. */
export interface ToolDef {
  slug: string;
  title: string;
  /** Suchintent-orientierter Titel für <title>; im UI wird `title` verwendet. */
  seoTitle: string;
  description: string;
  /** false while only a stub page exists. */
  ready: boolean;
}

export const tools: ToolDef[] = [
  {
    slug: "plattengewicht",
    seoTitle: "Plattengewicht berechnen",
    title: "Plattengewichtsrechner",
    description:
      "Gewicht einer Platte oder eines Rundstabs aus Maßen und Rohdichte des Werkstoffs berechnen – metrisch oder imperial.",
    ready: true,
  },
  {
    slug: "tuerenmass",
    seoTitle: "Türenmaß berechnen nach DIN 18101",
    title: "Türenmaß-Rechner",
    description:
      "Türblatt-, Zargen- und Wandstärkemaß aus dem Rohbaumaß der Maueröffnung nach DIN 18101 ableiten.",
    ready: true,
  },
  {
    slug: "restlaenge",
    seoTitle: "Restlänge Kantenband berechnen",
    title: "Restlängenrechner",
    description:
      "Restlänge einer Kantenbandrolle aus Außen- und Innendurchmesser sowie Banddicke berechnen.",
    ready: true,
  },
  {
    slug: "durchbiegung",
    seoTitle: "Durchbiegung Regalboden berechnen",
    title: "Durchbiegungsrechner",
    description:
      "Durchbiegung eines Regal- oder Schrankbodens unter Last aus Werkstoff, Abmessungen und Belastungsart abschätzen.",
    ready: true,
  },
  {
    slug: "stundensatz",
    seoTitle: "Stundensatz berechnen für Schreiner",
    title: "Stundensatzrechner",
    description:
      "Kostendeckenden Stundenverrechnungssatz aus Fixkosten und produktiven Stunden berechnen.",
    ready: true,
  },
  {
    slug: "quell-schwund",
    seoTitle: "Quellen und Schwinden von Holz berechnen (DIN 52184)",
    title: "Quell- und Schwundrechner",
    description:
      "Maßänderung von Massivholz aus Holzart, Jahrringlage, Abmessungen und Holzfeuchte nach DIN 52184 berechnen.",
    ready: true,
  },
  {
    slug: "falsche-gehrung",
    seoTitle: "Falsche Gehrung berechnen",
    title: "Falsche-Gehrung-Rechner",
    description:
      "Schnittwinkel, Kappsägen-Einstellwerte, Versatzmaß und Gehrungslänge für Gehrungen mit unterschiedlichen Materialstärken oder beliebigem Eckwinkel berechnen.",
    ready: true,
  },
];

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}
