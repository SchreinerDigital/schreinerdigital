// Ported from the Drive reference's utils/dovetailCalculator.ts. The core geometry
// math is unchanged; `gaugeDepth` was added to the returned summary so every consumer
// (visualizer, marking table, print template) reads one correct value instead of each
// recomputing the half-blind depth-of-cut itself (see AGENTS notes in the PR/commit).

import type { AnglePreset, CalculationSummary, DovetailParams, JointElement, MarkingCoordinate } from "./types";

export const ANGLE_PRESETS: AnglePreset[] = [
  {
    label: "1:8 (~7.1°)",
    ratio: "1:8",
    degrees: 7.125,
    woodType: "Hartholz",
    description:
      "Traditionell für Eiche, Buche, Nussbaum, Ahorn & Kirsche. Bietet höchste Festigkeit ohne Ausbrechen der Holzfasern.",
  },
  {
    label: "1:7 (~8.1°)",
    ratio: "1:7",
    degrees: 8.13,
    woodType: "Universal",
    description: "Ausgewogener Kompromiss für gemischte Holzarten und handgesägte Möbelverbindungen.",
  },
  {
    label: "1:6 (~9.5°)",
    ratio: "1:6",
    degrees: 9.46,
    woodType: "Weichholz",
    description: "Empfohlen für Nadelholz (Kiefer, Fichte, Tanne). Steilerer Winkel gleicht weichere Holzfasern aus.",
  },
  {
    label: "1:4 (14.0°)",
    ratio: "1:4",
    degrees: 14.0,
    woodType: "Frässchablone",
    description: "Standard-Winkel für viele Oberfräsen-Zinkenfräser (z.B. Festool, Leigh, Porter-Cable).",
  },
];

export function angleToRatio(degrees: number): string {
  const tan = Math.tan((degrees * Math.PI) / 180);
  if (tan <= 0.001) return "0:1";
  const r = 1 / tan;
  return `1:${r.toFixed(1)}`;
}

export function ratioToAngle(ratioNum: number): number {
  if (ratioNum <= 0) return 7.125;
  const rad = Math.atan(1 / ratioNum);
  return (rad * 180) / Math.PI;
}

export function calculateAutoTailCount(width: number, thickness: number, unit: "mm" | "inch"): number {
  const widthMm = unit === "inch" ? width * 25.4 : width;
  const thickMm = unit === "inch" ? thickness * 25.4 : thickness;
  // Guideline: typical spacing is around 25-35mm or roughly 1.5x thickness.
  const pitch = Math.max(22, thickMm * 1.4);
  return Math.max(1, Math.round(widthMm / pitch));
}

export function calculateDovetail(params: DovetailParams): CalculationSummary {
  const {
    boardWidth,
    boardThickness,
    pinBoardThickness,
    jointType,
    halfBlindLap,
    angleDegrees,
    tailCount: requestedTailCount,
    tailToPinRatio,
    halfPinRatio,
    graduated,
    graduationAmount,
    unit,
  } = params;

  const warnings: string[] = [];
  const W = Math.max(10, boardWidth);
  const gaugeDepth = jointType === "half_blind" ? Math.max(1, pinBoardThickness - halfBlindLap) : pinBoardThickness;

  const N = Math.max(1, requestedTailCount);
  const angleRad = (angleDegrees * Math.PI) / 180;
  const slope = Math.tan(angleRad);
  const delta = gaugeDepth * slope;

  const denominator = 2 * halfPinRatio + (N - 1) + N * tailToPinRatio;
  const basePinMid = W / denominator;
  const baseHalfPinMid = halfPinRatio * basePinMid;
  const baseTailMid = tailToPinRatio * basePinMid;

  const tailMids: number[] = [];
  if (graduated && N > 1) {
    const g = Math.min(0.6, Math.max(0.05, graduationAmount));
    let sumGrad = 0;
    for (let i = 0; i < N; i++) {
      const factor = 1 + g * ((2 * i - (N - 1)) / (N - 1));
      tailMids.push(baseTailMid * factor);
      sumGrad += baseTailMid * factor;
    }
    const expectedSum = N * baseTailMid;
    const correction = expectedSum / sumGrad;
    for (let i = 0; i < N; i++) tailMids[i] *= correction;
  } else {
    for (let i = 0; i < N; i++) tailMids.push(baseTailMid);
  }

  // At midline, an element has width tailMids[i]/basePinMid.
  // At the shoulder (baseline) it is delta narrower; at the board tip it is delta wider.
  const halfPinTip = baseHalfPinMid - delta / 2;
  const halfPinBase = baseHalfPinMid + delta / 2;
  const pinTip = basePinMid - delta;
  const pinBase = basePinMid + delta;

  const unitLabel = unit === "mm" ? "mm" : "in";
  const minAllowedPin = unit === "mm" ? 2.5 : 0.1;

  if (pinTip < minAllowedPin && N > 1) {
    warnings.push(
      `Die Zinken sind an der schmalsten Stelle sehr fein (${pinTip.toFixed(1)} ${unitLabel}). Reduzieren Sie die Zinkenanzahl, verringern Sie das Schwalbe/Zinken-Verhältnis oder wählen Sie einen flacheren Winkel.`,
    );
  }
  if (halfPinTip < minAllowedPin) {
    warnings.push(
      `Die Halbzinken an den Außenkanten sind sehr schmal (${halfPinTip.toFixed(1)} ${unitLabel}). Erhöhen Sie das Halbzinken-Verhältnis.`,
    );
  }
  if (delta > baseTailMid * 0.8) {
    warnings.push(
      `Der Fräserwinkel (${angleDegrees.toFixed(1)}°) ist für diese Materialstärke relativ steil. Es besteht Ausbruchgefahr an den Schwalbenhälsen.`,
    );
  }

  const elements: JointElement[] = [];
  let currentBaseX = 0;
  let currentTipX = 0;

  elements.push({
    id: "half_pin_left",
    type: "half_pin",
    index: 0,
    label: "Halbzinke links",
    baseWidth: halfPinBase,
    tipWidth: halfPinTip,
    centerline: (halfPinBase + halfPinTip) / 4,
    leftBase: 0,
    rightBase: halfPinBase,
    leftTip: 0,
    rightTip: halfPinTip,
    isWasteOnTailBoard: true,
    isWasteOnPinBoard: false,
  });
  currentBaseX += halfPinBase;
  currentTipX += halfPinTip;

  for (let i = 0; i < N; i++) {
    const tailMid = tailMids[i];
    const tailBase = tailMid - delta;
    const tailTip = tailMid + delta;

    const tLeftBase = currentBaseX;
    const tRightBase = currentBaseX + tailBase;
    const tLeftTip = currentTipX;
    const tRightTip = currentTipX + tailTip;

    elements.push({
      id: `tail_${i}`,
      type: "tail",
      index: i,
      label: `Schwalbe ${i + 1}`,
      baseWidth: tailBase,
      tipWidth: tailTip,
      centerline: (tLeftBase + tRightBase + tLeftTip + tRightTip) / 4,
      leftBase: tLeftBase,
      rightBase: tRightBase,
      leftTip: tLeftTip,
      rightTip: tRightTip,
      isWasteOnTailBoard: false,
      isWasteOnPinBoard: true,
    });
    currentBaseX += tailBase;
    currentTipX += tailTip;

    if (i < N - 1) {
      const pLeftBase = currentBaseX;
      const pRightBase = currentBaseX + pinBase;
      const pLeftTip = currentTipX;
      const pRightTip = currentTipX + pinTip;

      elements.push({
        id: `pin_${i}`,
        type: "pin",
        index: i,
        label: `Zinke ${i + 1}`,
        baseWidth: pinBase,
        tipWidth: pinTip,
        centerline: (pLeftBase + pRightBase + pLeftTip + pRightTip) / 4,
        leftBase: pLeftBase,
        rightBase: pRightBase,
        leftTip: pLeftTip,
        rightTip: pRightTip,
        isWasteOnTailBoard: true,
        isWasteOnPinBoard: false,
      });
      currentBaseX += pinBase;
      currentTipX += pinTip;
    }
  }

  elements.push({
    id: "half_pin_right",
    type: "half_pin",
    index: 1,
    label: "Halbzinke rechts",
    baseWidth: halfPinBase,
    tipWidth: halfPinTip,
    centerline: (currentBaseX + W + currentTipX + W) / 4,
    leftBase: currentBaseX,
    rightBase: W,
    leftTip: currentTipX,
    rightTip: W,
    isWasteOnTailBoard: true,
    isWasteOnPinBoard: false,
  });

  const markingCoordinates: MarkingCoordinate[] = [
    {
      id: "edge_left",
      label: "Linke Bezugskante (Nullpunkt)",
      type: "edge",
      board: "both",
      posBaseline: 0,
      posTip: 0,
      angleDirection: "|",
      wasteSide: "none",
      notes: "Anschlagkante für Streichmaß und Winkel",
    },
  ];

  for (let i = 0; i < elements.length - 1; i++) {
    const elCurrent = elements[i];
    const elNext = elements[i + 1];
    const cutXBase = elCurrent.rightBase;
    const cutXTip = elCurrent.rightTip;

    const angleDirection: "/" | "\\" | "|" =
      Math.abs(cutXTip - cutXBase) < 0.05 ? "|" : cutXTip > cutXBase ? "\\" : "/";

    const isCurrentWasteTail = elCurrent.isWasteOnTailBoard;

    markingCoordinates.push({
      id: `cut_${i}`,
      label: `Schnittlinie zw. ${elCurrent.label} & ${elNext.label}`,
      type: "cut",
      board: "both",
      posBaseline: cutXBase,
      posTip: cutXTip,
      angleDirection,
      wasteSide: isCurrentWasteTail ? "left" : "right",
      notes: isCurrentWasteTail
        ? "Abfall links (Schwalbenbrett) / stehen lassen (Zinkenbrett)"
        : "Abfall rechts (Schwalbenbrett) / stehen lassen (Zinkenbrett)",
    });
  }

  markingCoordinates.push({
    id: "edge_right",
    label: "Rechte Außenkante",
    type: "edge",
    board: "both",
    posBaseline: W,
    posTip: W,
    angleDirection: "|",
    wasteSide: "none",
    notes: "Gesamtbreite des Werkstücks",
  });

  const avgTailWidthBase = tailMids.reduce((acc, v) => acc + (v - delta), 0) / N;
  const avgTailWidthTip = tailMids.reduce((acc, v) => acc + (v + delta), 0) / N;

  return {
    boardWidth: W,
    boardThickness: Math.max(2, boardThickness),
    angleDegrees,
    ratioString: angleToRatio(angleDegrees),
    tailCount: N,
    pinCount: N - 1,
    halfPinCount: 2,
    halfPinWidthBase: halfPinBase,
    halfPinWidthTip: halfPinTip,
    avgTailWidthBase,
    avgTailWidthTip,
    avgPinWidthBase: pinBase,
    avgPinWidthTip: pinTip,
    minPinTipWidth: pinTip,
    gaugeDepth,
    elements,
    markingCoordinates,
    warnings,
  };
}
