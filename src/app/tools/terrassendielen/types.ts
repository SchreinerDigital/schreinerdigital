// Ported from the Drive reference's types.ts (Terrassendielen-Rechner AI Studio export).

export type Orientation = "lengthwise" | "crosswise";

export interface TerraceInputs {
  length: number; // m (Terrassenlänge)
  width: number; // m (Terrassenbreite)
  boardWidth: number; // mm (Sichtbare Dielenbreite)
  boardLength: number; // m (Dielenlänge)
  gap: number; // mm (Fuge zwischen Dielen)
  orientation: Orientation; // 'lengthwise' (parallel zu Länge) | 'crosswise' (parallel zu Breite)
  reservePercent: number; // % (Zusätzliche Reserve für Verschnitt & Sortierung)
  minOffcutLength: number; // m (Mindestlänge für Reststück-Nutzung, z.B. 0.30 m)
  joistSpacing: number; // cm (Balkenabstand Unterkonstruktion, z.B. 45 cm)
  screwsPerIntersection: number; // Stück Schrauben pro Dielen-Auflagepunkt (z.B. 2)
  pricePerLinearMeter: number; // € pro lfdm Diele (optional)
  joistPricePerMeter: number; // € pro lfdm UK (optional)
}

export interface BoardPiece {
  id: string;
  length: number; // in meters
  startX: number; // in meters
  isOffcut: boolean; // wurde als Reststück wiederverwendet
  pieceIndex: number;
}

export interface SimulatedRow {
  rowIndex: number;
  pieces: BoardPiece[];
  offcutLeftover: number; // m
  offcutUsed: number; // m
}

export interface ModeCalculation {
  totalBoards: number; // Reine Dielen Stückzahl
  totalLinearMeters: number; // lfdm
  scrapMeters: number; // Verschnitt in lfdm
  scrapPercent: number; // Verschnitt in %
  purchaseBoardsWithReserve: number; // Dielen inkl. Reserve
  purchaseLinearMetersWithReserve: number; // lfdm inkl. Reserve
  totalCostWithReserve: number; // € gesamt
}

export interface CalculationResults {
  // Geometrie
  terraceArea: number; // m²
  runLength: number; // m (Länge der Dielenreihe)
  crossSpan: number; // m (Breite, über die Dielen verlegt werden)
  rowsCount: number; // Anzahl Dielenreihen
  effectiveWidthCovered: number; // m (Tatsächlich von Dielen + Fugen abgedeckte Breite)
  lastBoardTrimNeeded: boolean; // ob letzte Diele längs geschnitten werden muss
  lastBoardCutWidth: number; // mm (Breite der letzten Diele)
  netDeckLinearMeters: number; // m² / Dielenbreite = theoretische Netto-Laufmeter

  // Berechnung ohne Reststück-Nutzung
  withoutScrap: ModeCalculation & {
    boardsPerRow: number;
    wastedMetersPerRow: number;
    simulatedRows: SimulatedRow[];
  };

  // Berechnung mit Reststück-Nutzung (Wilder Verband)
  withScrap: ModeCalculation & {
    simulatedRows: SimulatedRow[];
    savingsBoards: number;
    savingsLinearMeters: number;
    savingsPercent: number;
    savingsCost: number;
  };

  // Unterkonstruktion (UK)
  substructure: {
    joistCount: number; // Anzahl Balken
    joistLength: number; // Länge eines Balkens (m)
    totalJoistMeters: number; // Gesamtlaufmeter UK
    joistOrientation: string; // Beschreibung
    spacingCm: number;
    padCount: number; // Gummigranulatpads
    totalJoistCost: number;
  };

  // Befestigung & Zubehör
  fastening: {
    intersections: number; // Kreuzungspunkte UK x Dielen
    screwCount: number; // Anzahl Schrauben
    screwPackages: number; // Pakete à 200 Stk
    spacerCount: number; // Fugenkreuze / Abstandhalter
    estimatedFastenerCost: number;
  };
}

export interface WoodPreset {
  id: string;
  name: string;
  subtitle: string;
  boardWidth: number; // mm
  thickness: number; // mm
  boardLength: number; // m
  gap: number; // mm
  recommendedJoistSpacing: number; // cm
  defaultPricePerMeter: number; // €
  description: string;
}
