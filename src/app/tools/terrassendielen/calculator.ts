// Ported from the Drive reference's calculator.ts (Terrassendielen-Rechner AI Studio export).

import { TerraceInputs, CalculationResults, SimulatedRow, BoardPiece } from "./types";

export function calculateTerrace(inputs: TerraceInputs): CalculationResults {
  const {
    length,
    width,
    boardWidth,
    boardLength,
    gap,
    orientation,
    reservePercent,
    minOffcutLength = 0.3,
    joistSpacing = 45,
    screwsPerIntersection = 2,
    pricePerLinearMeter = 0,
    joistPricePerMeter = 3.5,
  } = inputs;

  // Safe positive fallbacks
  const safeLength = Math.max(0.5, length || 5);
  const safeWidth = Math.max(0.5, width || 4);
  const safeBoardWidth = Math.max(50, boardWidth || 145);
  const safeBoardLength = Math.max(1, boardLength || 4);
  const safeGap = Math.max(0, gap || 5);
  const safeReserve = Math.max(0, reservePercent || 10);
  const safeMinOffcut = Math.max(0.1, minOffcutLength || 0.3);
  const safeJoistSpacingM = Math.max(0.2, (joistSpacing || 45) / 100);

  const terraceArea = safeLength * safeWidth;

  // Determine run length (along boards) and cross span (across boards)
  const isLengthwise = orientation === "lengthwise";
  const runLength = isLengthwise ? safeLength : safeWidth;
  const crossSpan = isLengthwise ? safeWidth : safeLength;

  // Pitch per row in mm
  const pitchMm = safeBoardWidth + safeGap;
  const crossSpanMm = crossSpan * 1000;

  // Number of rows: N * boardWidth + (N - 1) * gap >= crossSpanMm
  // => N * (boardWidth + gap) - gap >= crossSpanMm
  // => N >= (crossSpanMm + gap) / (boardWidth + gap)
  const rowsCount = Math.max(1, Math.ceil((crossSpanMm + safeGap) / pitchMm));

  // Full covered width without cutting the last board
  const fullCoveredMm = rowsCount * safeBoardWidth + (rowsCount - 1) * safeGap;
  const effectiveWidthCovered = fullCoveredMm / 1000;

  // Check if last board needs trimming to fit exact terrace boundary
  const overhangMm = fullCoveredMm - crossSpanMm;
  const lastBoardTrimNeeded = overhangMm > 2; // > 2mm difference
  const lastBoardCutWidth = lastBoardTrimNeeded
    ? Math.max(20, Math.round(safeBoardWidth - overhangMm))
    : safeBoardWidth;

  // Theoretical net linear meters
  const netDeckLinearMeters = rowsCount * runLength;

  // --------------------------------------------------------------------------
  // 1. BERECHNUNG OHNE RESTSTÜCK-NUTZUNG (Jeder Stoß = neue Diele)
  // --------------------------------------------------------------------------
  const boardsPerRowRaw = Math.max(1, Math.ceil(runLength / safeBoardLength));
  const wastedMetersPerRow = boardsPerRowRaw * safeBoardLength - runLength;

  const totalBoardsWithoutScrap = rowsCount * boardsPerRowRaw;
  const totalLinearMetersWithoutScrap = totalBoardsWithoutScrap * safeBoardLength;
  const scrapMetersWithoutScrap = totalLinearMetersWithoutScrap - netDeckLinearMeters;
  const scrapPercentWithoutScrap = totalLinearMetersWithoutScrap > 0
    ? (scrapMetersWithoutScrap / totalLinearMetersWithoutScrap) * 100
    : 0;

  const purchaseBoardsWithoutReserve = Math.ceil(
    totalBoardsWithoutScrap * (1 + safeReserve / 100)
  );
  const purchaseLinearMetersWithoutReserve = purchaseBoardsWithoutReserve * safeBoardLength;
  const costWithoutScrap = purchaseLinearMetersWithoutReserve * pricePerLinearMeter;

  // Erzeuge simulierte Reihen für die visuelle Darstellung ohne Restewervertung
  const simulatedRowsWithoutScrap: SimulatedRow[] = [];
  for (let r = 0; r < rowsCount; r++) {
    let remainingDistance = runLength;
    const pieces: BoardPiece[] = [];
    let currentX = 0;
    let pieceIdx = 0;

    while (remainingDistance > 0.001) {
      if (remainingDistance >= safeBoardLength) {
        pieces.push({
          id: `no-r${r}-p${pieceIdx++}`,
          length: Number(safeBoardLength.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: false,
          pieceIndex: pieceIdx,
        });
        currentX += safeBoardLength;
        remainingDistance -= safeBoardLength;
      } else {
        pieces.push({
          id: `no-r${r}-p${pieceIdx++}`,
          length: Number(remainingDistance.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: false,
          pieceIndex: pieceIdx,
        });
        remainingDistance = 0;
      }
    }

    simulatedRowsWithoutScrap.push({
      rowIndex: r,
      pieces,
      offcutLeftover: Number(wastedMetersPerRow.toFixed(3)),
      offcutUsed: 0,
    });
  }

  // --------------------------------------------------------------------------
  // 2. BERECHNUNG MIT RESTSTÜCK-NUTZUNG (Wilder Verband Simulation)
  // --------------------------------------------------------------------------
  const simulatedRows: SimulatedRow[] = [];
  let currentOffcut = 0; // In metern
  let totalNewBoardsUsed = 0;

  for (let r = 0; r < rowsCount; r++) {
    let remainingDistance = runLength;
    const pieces: BoardPiece[] = [];
    let currentX = 0;
    let pieceIdx = 0;
    let offcutUsedInRow = 0;

    // Check if we can reuse the offcut from the previous row
    if (currentOffcut >= safeMinOffcut) {
      if (currentOffcut >= remainingDistance) {
        // Offcut covers the rest of the row completely
        const usedPieceLength = remainingDistance;
        pieces.push({
          id: `r${r}-p${pieceIdx++}`,
          length: Number(usedPieceLength.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: true,
          pieceIndex: pieceIdx,
        });
        currentOffcut = currentOffcut - usedPieceLength;
        offcutUsedInRow = usedPieceLength;
        remainingDistance = 0;
      } else {
        // Offcut is used as the starting piece of this row
        const usedPieceLength = currentOffcut;
        pieces.push({
          id: `r${r}-p${pieceIdx++}`,
          length: Number(usedPieceLength.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: true,
          pieceIndex: pieceIdx,
        });
        currentX += usedPieceLength;
        remainingDistance -= usedPieceLength;
        offcutUsedInRow = usedPieceLength;
        currentOffcut = 0;
      }
    } else {
      // Offcut is too short to safely bridge joists, discard as scrap
      currentOffcut = 0;
    }

    // Fill the rest of the row with new boards
    while (remainingDistance > 0.001) {
      if (remainingDistance >= safeBoardLength) {
        // Full board fits
        pieces.push({
          id: `r${r}-p${pieceIdx++}`,
          length: Number(safeBoardLength.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: false,
          pieceIndex: pieceIdx,
        });
        currentX += safeBoardLength;
        remainingDistance -= safeBoardLength;
        totalNewBoardsUsed += 1;
      } else {
        // Need to cut a new board
        totalNewBoardsUsed += 1;
        const pieceNeeded = remainingDistance;
        const leftover = safeBoardLength - pieceNeeded;

        pieces.push({
          id: `r${r}-p${pieceIdx++}`,
          length: Number(pieceNeeded.toFixed(3)),
          startX: Number(currentX.toFixed(3)),
          isOffcut: false,
          pieceIndex: pieceIdx,
        });

        currentOffcut = leftover;
        remainingDistance = 0;
      }
    }

    simulatedRows.push({
      rowIndex: r,
      pieces,
      offcutLeftover: Number(currentOffcut.toFixed(3)),
      offcutUsed: Number(offcutUsedInRow.toFixed(3)),
    });
  }

  const totalBoardsWithScrap = totalNewBoardsUsed;
  const totalLinearMetersWithScrap = totalBoardsWithScrap * safeBoardLength;
  const scrapMetersWithScrap = Math.max(0, totalLinearMetersWithScrap - netDeckLinearMeters);
  const scrapPercentWithScrap = totalLinearMetersWithScrap > 0
    ? (scrapMetersWithScrap / totalLinearMetersWithScrap) * 100
    : 0;

  const purchaseBoardsWithScrapReserve = Math.ceil(
    totalBoardsWithScrap * (1 + safeReserve / 100)
  );
  const purchaseLinearMetersWithScrapReserve = purchaseBoardsWithScrapReserve * safeBoardLength;
  const costWithScrap = purchaseLinearMetersWithScrapReserve * pricePerLinearMeter;

  // Savings comparison
  const savingsBoards = Math.max(0, purchaseBoardsWithoutReserve - purchaseBoardsWithScrapReserve);
  const savingsLinearMeters = Math.max(0, purchaseLinearMetersWithoutReserve - purchaseLinearMetersWithScrapReserve);
  const savingsPercent = purchaseBoardsWithoutReserve > 0
    ? (savingsBoards / purchaseBoardsWithoutReserve) * 100
    : 0;
  const savingsCost = savingsLinearMeters * pricePerLinearMeter;

  // --------------------------------------------------------------------------
  // 3. UNTERKONSTRUKTION (UK) BERECHNUNG
  // --------------------------------------------------------------------------
  // Joists run perpendicular to decking boards
  // If boards run lengthwise (length), joists run crosswise (width)
  // Distance to cover with joists is along runLength
  const joistCount = Math.ceil(runLength / safeJoistSpacingM) + 1;
  const joistLength = crossSpan;
  const totalJoistMeters = joistCount * joistLength;
  const joistOrientation = isLengthwise
    ? "Quer zur Terrassenlänge (parallel zur Breite)"
    : "Längs zur Terrassenlänge (parallel zur Länge)";

  // Granulatpads: Every 50 cm along joists
  const padsPerJoist = Math.ceil(joistLength / 0.5) + 1;
  const padCount = joistCount * padsPerJoist;
  const totalJoistCost = totalJoistMeters * joistPricePerMeter;

  // --------------------------------------------------------------------------
  // 4. BEFESTIGUNG & SCHRAUBEN
  // --------------------------------------------------------------------------
  // Each intersection between a row and a joist has screwsPerIntersection screws
  const intersections = rowsCount * joistCount;
  const screwCount = intersections * screwsPerIntersection;
  const screwPackages = Math.ceil(screwCount / 200); // 200er Packungen
  const estimatedFastenerCost = screwPackages * 24.5; // ca. 24,50 € pro 200 Stk Edelstahlschrauben A2

  // Spacers / Fugenkreuze: approx. 4 per m²
  const spacerCount = Math.max(20, Math.ceil(terraceArea * 4));

  return {
    terraceArea: Number(terraceArea.toFixed(2)),
    runLength: Number(runLength.toFixed(2)),
    crossSpan: Number(crossSpan.toFixed(2)),
    rowsCount,
    effectiveWidthCovered: Number(effectiveWidthCovered.toFixed(3)),
    lastBoardTrimNeeded,
    lastBoardCutWidth,
    netDeckLinearMeters: Number(netDeckLinearMeters.toFixed(2)),

    withoutScrap: {
      boardsPerRow: boardsPerRowRaw,
      wastedMetersPerRow: Number(wastedMetersPerRow.toFixed(2)),
      simulatedRows: simulatedRowsWithoutScrap,
      totalBoards: totalBoardsWithoutScrap,
      totalLinearMeters: Number(totalLinearMetersWithoutScrap.toFixed(2)),
      scrapMeters: Number(scrapMetersWithoutScrap.toFixed(2)),
      scrapPercent: Number(scrapPercentWithoutScrap.toFixed(1)),
      purchaseBoardsWithReserve: purchaseBoardsWithoutReserve,
      purchaseLinearMetersWithReserve: Number(purchaseLinearMetersWithoutReserve.toFixed(2)),
      totalCostWithReserve: Number(costWithoutScrap.toFixed(2)),
    },

    withScrap: {
      simulatedRows,
      totalBoards: totalBoardsWithScrap,
      totalLinearMeters: Number(totalLinearMetersWithScrap.toFixed(2)),
      scrapMeters: Number(scrapMetersWithScrap.toFixed(2)),
      scrapPercent: Number(scrapPercentWithScrap.toFixed(1)),
      purchaseBoardsWithReserve: purchaseBoardsWithScrapReserve,
      purchaseLinearMetersWithReserve: Number(purchaseLinearMetersWithScrapReserve.toFixed(2)),
      totalCostWithReserve: Number(costWithScrap.toFixed(2)),
      savingsBoards,
      savingsLinearMeters: Number(savingsLinearMeters.toFixed(2)),
      savingsPercent: Number(savingsPercent.toFixed(1)),
      savingsCost: Number(savingsCost.toFixed(2)),
    },

    substructure: {
      joistCount,
      joistLength: Number(joistLength.toFixed(2)),
      totalJoistMeters: Number(totalJoistMeters.toFixed(2)),
      joistOrientation,
      spacingCm: Math.round(safeJoistSpacingM * 100),
      padCount,
      totalJoistCost: Number(totalJoistCost.toFixed(2)),
    },

    fastening: {
      intersections,
      screwCount,
      screwPackages,
      spacerCount,
      estimatedFastenerCost: Number(estimatedFastenerCost.toFixed(2)),
    },
  };
}
