// Ported from the Drive reference's types.ts (Schwalbenschwanz-Rechner AI Studio export).

export type UnitSystem = "mm" | "inch";
export type JointType = "through" | "half_blind"; // Offen vs. Halbverdeckt

export interface AnglePreset {
  label: string;
  ratio: string;
  degrees: number;
  woodType: string;
  description: string;
}

export interface DovetailParams {
  unit: UnitSystem;
  boardWidth: number;
  boardThickness: number;
  /** Thickness of the mating board (for half-blind, the pin board's material thickness). */
  pinBoardThickness: number;
  jointType: JointType;
  /** Lip/lap thickness remaining on the half-blind pin board. */
  halfBlindLap: number;
  /** e.g. 7.125 (1:8), 9.46 (1:6), 14.0 (1:4). */
  angleDegrees: number;
  autoTailCount: boolean;
  tailCount: number;
  /** Ratio of tail width to pin width (e.g. 1.8 to 2.5). */
  tailToPinRatio: number;
  /** Ratio of half-pin to full pin (e.g. 0.5 to 0.75). */
  halfPinRatio: number;
  /** Graduated tails (tails widen towards the bottom, cabinetmaker style). */
  graduated: boolean;
  /** 0 to 0.5 – strength of the graduation. */
  graduationAmount: number;
  minPinWidth: number;
}

export interface JointElement {
  id: string;
  type: "half_pin" | "tail" | "pin";
  index: number;
  label: string;
  baseWidth: number;
  tipWidth: number;
  centerline: number;
  leftBase: number;
  rightBase: number;
  leftTip: number;
  rightTip: number;
  isWasteOnTailBoard: boolean;
  isWasteOnPinBoard: boolean;
}

export interface MarkingCoordinate {
  id: string;
  label: string;
  type: "edge" | "cut" | "center";
  board: "both" | "tail" | "pin";
  posBaseline: number;
  posTip: number;
  angleDirection: "/" | "\\" | "|";
  wasteSide: "left" | "right" | "both" | "none";
  notes?: string;
}

export interface CalculationSummary {
  boardWidth: number;
  boardThickness: number;
  angleDegrees: number;
  ratioString: string;
  tailCount: number;
  pinCount: number;
  halfPinCount: number;
  halfPinWidthBase: number;
  halfPinWidthTip: number;
  avgTailWidthBase: number;
  avgTailWidthTip: number;
  avgPinWidthBase: number;
  avgPinWidthTip: number;
  minPinTipWidth: number;
  /** Effective depth of cut (accounts for the half-blind lap). */
  gaugeDepth: number;
  elements: JointElement[];
  markingCoordinates: MarkingCoordinate[];
  warnings: string[];
}
