import type { WoodSpecies } from "./wood-species";
import { WOOD_SPECIES } from "./wood-species";

/** Ported 1:1 from the reference calculator (calculation logic unchanged). */

export type GrainCutType = "flat" | "quarter" | "rift" | "custom";

export interface CalculationInput {
  speciesId: string;
  width: number; // in mm
  thickness: number; // in mm
  length: number; // in mm
  grainCut: GrainCutType;
  customAngle?: number; // 0 bis 90 Grad
  initialMC: number; // in %
  finalMC: number; // in %
  unit: "mm" | "cm" | "inch";
}

export interface CalculationResult {
  species: WoodSpecies;
  initialWidth: number;
  finalWidth: number;
  deltaWidth: number;
  percentWidthChange: number;

  initialThickness: number;
  finalThickness: number;
  deltaThickness: number;
  percentThicknessChange: number;

  initialLength: number;
  finalLength: number;
  deltaLength: number;

  isSwelling: boolean;
  deltaMC: number;
  effectiveDeltaMC: number;
  effectiveCutAngle: number;
  effectiveWidthCoef: number;
  effectiveThicknessCoef: number;

  exceedsFSP: boolean;
  fspWarning?: string;
  recommendedExpansionGap: number; // in mm
}

/** Berechnet die Maßänderung aus differentiellem Schwundmaß, Jahrringlage und Feuchteänderung. */
export function calculateWoodMovement(input: CalculationInput): CalculationResult {
  const species = WOOD_SPECIES.find((s) => s.id === input.speciesId) || WOOD_SPECIES[0];

  // Schnittwinkel der Jahresringe in Grad bestimmen
  let cutAngleDeg = 0;
  if (input.grainCut === "flat") {
    cutAngleDeg = 0; // rein tangential über die Breite (Flachschnitt)
  } else if (input.grainCut === "quarter") {
    cutAngleDeg = 90; // rein radial über die Breite (Riftschnitt)
  } else if (input.grainCut === "rift") {
    cutAngleDeg = 45; // gemischt/diagonal
  } else if (input.grainCut === "custom") {
    cutAngleDeg = Math.max(0, Math.min(90, input.customAngle ?? 45));
  }

  const rad = (cutAngleDeg * Math.PI) / 180;
  const cosAngleSq = Math.pow(Math.cos(rad), 2);
  const sinAngleSq = Math.pow(Math.sin(rad), 2);

  // Wirksamer Schwundbeiwert für die Breite:
  // bei 0° (Flachschnitt) rein tangential, bei 90° (Riftschnitt) rein radial.
  const effectiveWidthCoef = species.tangentialCoef * cosAngleSq + species.radialCoef * sinAngleSq;

  // Wirksamer Schwundbeiwert für die Dicke (senkrecht zur Breite):
  // bei 0° Breite (tangential) ist die Dicke radial.
  const effectiveThicknessCoef = species.tangentialCoef * sinAngleSq + species.radialCoef * cosAngleSq;

  const fsp = species.fsp || 30;
  const exceedsFSP = input.initialMC > fsp || input.finalMC > fsp;

  // Gekappte Holzfeuchten: Maßänderung findet nur unterhalb des Fasersättigungspunktes statt
  const clampedInitial = Math.min(input.initialMC, fsp);
  const clampedFinal = Math.min(input.finalMC, fsp);

  const deltaMC = input.finalMC - input.initialMC;
  const effectiveDeltaMC = clampedFinal - clampedInitial;

  // Änderungsformel: ΔW = W * (Beiwert / 100) * ΔFeuchte
  const deltaWidth = input.width * (effectiveWidthCoef / 100) * effectiveDeltaMC;
  const finalWidth = input.width + deltaWidth;
  const percentWidthChange = (deltaWidth / input.width) * 100;

  const deltaThickness = input.thickness * (effectiveThicknessCoef / 100) * effectiveDeltaMC;
  const finalThickness = input.thickness + deltaThickness;
  const percentThicknessChange = (deltaThickness / input.thickness) * 100;

  const deltaLength = input.length * (species.longitudinalCoef / 100) * effectiveDeltaMC;
  const finalLength = input.length + deltaLength;

  const isSwelling = effectiveDeltaMC > 0;

  let fspWarning: string | undefined;
  if (exceedsFSP) {
    fspWarning = `Hinweis: Oberhalb des Fasersättigungspunktes (${fsp}% bei ${species.nameDe}) befindet sich freies Wasser im Zellhohlraum, das kein weiteres Quellen oder Schwinden bewirkt. Die Berechnung berücksichtigt nur die hygroskopische Feuchteänderung unterhalb von ${fsp}%.`;
  }

  // Empfohlene Dehnungsfuge: bei Quellung die Quellmenge plus 20–30 % Sicherheitsaufschlag (min. 2 mm)
  const absDeltaW = Math.abs(deltaWidth);
  const recommendedExpansionGap = Number(Math.max(2, absDeltaW * 1.3).toFixed(1));

  return {
    species,
    initialWidth: input.width,
    finalWidth: Number(finalWidth.toFixed(2)),
    deltaWidth: Number(deltaWidth.toFixed(2)),
    percentWidthChange: Number(percentWidthChange.toFixed(2)),

    initialThickness: input.thickness,
    finalThickness: Number(finalThickness.toFixed(2)),
    deltaThickness: Number(deltaThickness.toFixed(2)),
    percentThicknessChange: Number(percentThicknessChange.toFixed(2)),

    initialLength: input.length,
    finalLength: Number(finalLength.toFixed(2)),
    deltaLength: Number(deltaLength.toFixed(2)),

    isSwelling,
    deltaMC: Number(deltaMC.toFixed(1)),
    effectiveDeltaMC: Number(effectiveDeltaMC.toFixed(1)),
    effectiveCutAngle: cutAngleDeg,
    effectiveWidthCoef: Number(effectiveWidthCoef.toFixed(3)),
    effectiveThicknessCoef: Number(effectiveThicknessCoef.toFixed(3)),

    exceedsFSP,
    fspWarning,
    recommendedExpansionGap,
  };
}

/** Rechnet Millimeter in die Zieleinheit (cm, Zoll, mm) um. */
export function formatDimension(mm: number, unit: "mm" | "cm" | "inch"): string {
  if (unit === "cm") {
    return (mm / 10).toFixed(2) + " cm";
  }
  if (unit === "inch") {
    return (mm / 25.4).toFixed(3) + ' "';
  }
  return mm.toFixed(1) + " mm";
}
