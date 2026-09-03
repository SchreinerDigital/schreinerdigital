/** Real material density data, ported 1:1 from the reference calculator. Shared by the client rechner and the server-rendered guide. */

export const KG_M3_TO_LBS_IN3 = 0.0000361273;

export const MATERIALS_METRIC: Record<string, Record<string, number>> = {
  Metalle: {
    Stahl: 7850,
    Aluminium: 2700,
    "Edelstahl (V2A)": 7900,
    Messing: 8500,
    Kupfer: 8960,
  },
  Holzwerkstoffe: {
    Furniersperrholz: 550,
    Hartfaser: 900,
    Leichtbauplatte: 300,
    MDF: 750,
    "Multiplex Birke": 680,
    "Multiplex Buche": 750,
    OSB: 600,
    Spanplatte: 650,
    Tischlerplatte: 450,
  },
  Hölzer: {
    Ahorn: 650,
    Birke: 650,
    Buche: 720,
    Douglasie: 530,
    "Europäische Eiche": 720,
    Erle: 530,
    Esche: 700,
    Fichte: 470,
    Kiefer: 520,
    Kirsche: 600,
    Lärche: 590,
    Nussbaum: 650,
    Platane: 600,
    Tanne: 450,
    Teak: 650,
    "Ulme/Rüster": 640,
  },
  "Kunststoffe & Verbundwerkstoffe": {
    Acrylglas: 1180,
    GFK: 1800,
    HPL: 1400,
    Kunststoff: 1400,
    Mineralwerkstoff: 1700,
    PETG: 1270,
    WPC: 1300,
  },
  Sonstige: {
    Gipskarton: 700,
    "Glas/Spiegel": 2500,
    Kork: 240,
    Mineralwolle: 100,
    Papier: 900,
  },
};

export const DENSITIES_METRIC: Record<string, number> = Object.values(MATERIALS_METRIC).reduce(
  (acc, group) => ({ ...acc, ...group }),
  {},
);

export const DENSITIES_IMPERIAL: Record<string, number> = Object.entries(DENSITIES_METRIC).reduce(
  (acc, [key, value]) => {
    acc[key] = value * KG_M3_TO_LBS_IN3;
    return acc;
  },
  {} as Record<string, number>,
);
