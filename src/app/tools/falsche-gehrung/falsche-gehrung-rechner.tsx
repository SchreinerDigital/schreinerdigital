"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Download, Minus, Plus } from "lucide-react";
import { jsPDF } from "jspdf";

// --- TYPES & CALCULATION (unchanged from the reference calculator) --------
//
// Ported from the Drive reference "Falsche Gehrung Rechner" (utils/
// miterCalculations.ts + utils/polygons.ts). The math itself is copied
// verbatim; only the surrounding UI and PDF branding were restyled to match
// the rest of /tools.

type AngleMode = "polygon" | "custom";

interface MiterInputs {
  materialA: number;
  materialB: number;
  angle: number;
  decimals: number;
  angleMode: AngleMode;
  polygonCorners: number;
}

interface MiterCalculationResult {
  isValid: boolean;
  errorMessage?: string;
  cutAngleA: number;
  cutAngleB: number;
  sawAngleA: number;
  sawAngleB: number;
  offsetA: number;
  offsetB: number;
  miterLength: number;
  formatted: {
    cutAngleA: string;
    cutAngleB: string;
    sawAngleA: string;
    sawAngleB: string;
    offsetA: string;
    offsetB: string;
    miterLength: string;
  };
}

function createEmptyResult(errorMessage: string): MiterCalculationResult {
  return {
    isValid: false,
    errorMessage,
    cutAngleA: 0,
    cutAngleB: 0,
    sawAngleA: 0,
    sawAngleB: 0,
    offsetA: 0,
    offsetB: 0,
    miterLength: 0,
    formatted: {
      cutAngleA: "0",
      cutAngleB: "0",
      sawAngleA: "0",
      sawAngleB: "0",
      offsetA: "0",
      offsetB: "0",
      miterLength: "0",
    },
  };
}

function calculateMiter(inputs: MiterInputs): MiterCalculationResult {
  const { materialA, materialB, angle, decimals } = inputs;

  if (materialA <= 0 || materialB <= 0) {
    return createEmptyResult("Materialstärken müssen größer als 0 sein.");
  }
  if (angle <= 0 || angle >= 180) {
    return createEmptyResult("Anschlusswinkel muss zwischen 1° und 179° liegen.");
  }

  const gammaRad = (angle * Math.PI) / 180;
  const sinGamma = Math.sin(gammaRad);
  const cosGamma = Math.cos(gammaRad);

  // alpha = Schnittwinkel an Werkstück A (gemessen zur Längskante)
  const alphaRad = Math.atan2(materialA * sinGamma, materialB + materialA * cosGamma);
  const cutAngleA = (alphaRad * 180) / Math.PI;

  // beta = Schnittwinkel an Werkstück B (gemessen zur Längskante)
  const betaRad = Math.atan2(materialB * sinGamma, materialA + materialB * cosGamma);
  const cutAngleB = (betaRad * 180) / Math.PI;

  // Kappsägen-Skala: 0° = 90°-Rechtwinkelschnitt
  const sawAngleA = Math.abs(90 - cutAngleA);
  const sawAngleB = Math.abs(90 - cutAngleB);

  // Länge der Gehrungsfuge L = sA / sin(alpha) = sB / sin(beta)
  const miterLength = materialA / Math.sin(alphaRad);

  // Versatzmaß: vA = sA / tan(alpha), vB = sB / tan(beta)
  const offsetA = materialA / Math.tan(alphaRad);
  const offsetB = materialB / Math.tan(betaRad);

  const dec = Math.max(0, Math.min(4, decimals));

  return {
    isValid: true,
    cutAngleA,
    cutAngleB,
    sawAngleA,
    sawAngleB,
    offsetA,
    offsetB,
    miterLength,
    formatted: {
      cutAngleA: cutAngleA.toFixed(dec),
      cutAngleB: cutAngleB.toFixed(dec),
      sawAngleA: sawAngleA.toFixed(dec),
      sawAngleB: sawAngleB.toFixed(dec),
      offsetA: offsetA.toFixed(dec),
      offsetB: offsetB.toFixed(dec),
      miterLength: miterLength.toFixed(dec),
    },
  };
}

interface PolygonInfo {
  corners: number;
  name: string;
  shortName: string;
  angle: number;
  angleDisplay: string;
  standardSawAngle: number;
}

const POLYGON_OPTIONS: PolygonInfo[] = [
  { corners: 3, name: "Gleichseitiges Dreieck", shortName: "3-Eck", angle: 60, angleDisplay: "60°", standardSawAngle: 60 },
  { corners: 4, name: "Viereck (Rahmen / Kasten)", shortName: "4-Eck", angle: 90, angleDisplay: "90°", standardSawAngle: 45 },
  { corners: 5, name: "Fünfeck (Pentagon)", shortName: "5-Eck", angle: 108, angleDisplay: "108°", standardSawAngle: 36 },
  { corners: 6, name: "Sechseck (Hexagon)", shortName: "6-Eck", angle: 120, angleDisplay: "120°", standardSawAngle: 30 },
  { corners: 7, name: "Siebeneck (Heptagon)", shortName: "7-Eck", angle: (5 * 180) / 7, angleDisplay: "128,57°", standardSawAngle: 180 / 7 },
  { corners: 8, name: "Achteck (Oktagon)", shortName: "8-Eck", angle: 135, angleDisplay: "135°", standardSawAngle: 22.5 },
  { corners: 9, name: "Neuneck (Nonagon)", shortName: "9-Eck", angle: 140, angleDisplay: "140°", standardSawAngle: 20 },
  { corners: 10, name: "Zehneck (Dekagon)", shortName: "10-Eck", angle: 144, angleDisplay: "144°", standardSawAngle: 18 },
  { corners: 11, name: "Elfeck (Endekagon)", shortName: "11-Eck", angle: (9 * 180) / 11, angleDisplay: "147,27°", standardSawAngle: 180 / 11 },
  { corners: 12, name: "Zwölfeck (Dodekagon)", shortName: "12-Eck", angle: 150, angleDisplay: "150°", standardSawAngle: 15 },
];

function getPolygonByCorners(corners: number): PolygonInfo {
  const found = POLYGON_OPTIONS.find((p) => p.corners === corners);
  if (found) return found;
  const validCorners = Math.max(3, Math.min(36, corners));
  const angle = ((validCorners - 2) * 180) / validCorners;
  return {
    corners: validCorners,
    name: `${validCorners}-Eck`,
    shortName: `${validCorners}-Eck`,
    angle,
    angleDisplay: `${angle.toFixed(2)}°`,
    standardSawAngle: 180 / validCorners,
  };
}

// --- PDF EXPORT -------------------------------------------------------------
//
// Layout/values ported verbatim from generateMiterPdf.ts; only the wordmark
// font was changed (embedded Space Grotesk instead of Helvetica, matching
// branding.mjs / tuerenmass-rechner.tsx).

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

let brandFontBase64Cache: string | null = null;

async function registerBrandFont(doc: jsPDF) {
  if (!brandFontBase64Cache) {
    const res = await fetch("/fonts/SpaceGrotesk-Bold.ttf");
    brandFontBase64Cache = arrayBufferToBase64(await res.arrayBuffer());
  }
  doc.addFileToVFS("SpaceGrotesk-Bold.ttf", brandFontBase64Cache);
  doc.addFont("SpaceGrotesk-Bold.ttf", "SpaceGrotesk", "bold");
}

function formatMax2Dec(val: number | string): string {
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "0";
  const rounded = Math.round(num * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-7) {
    return Math.round(rounded).toString();
  }
  return rounded.toFixed(2).replace(/(\.[0-9]*[1-9])0+$|\.00$/, "$1");
}

async function generateMiterPdf(inputs: MiterInputs, results: MiterCalculationResult): Promise<void> {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  await registerBrandFont(doc);

  const { materialA, materialB, angle } = inputs;
  const { formatted } = results;

  const pageWidth = 210;
  const pageMargin = 20;
  const contentWidth = pageWidth - 2 * pageMargin;
  const rightEdge = pageMargin + contentWidth;

  // --- 1. Kopfzeile ---
  doc.setFont("SpaceGrotesk", "bold");
  doc.setFontSize(17);
  doc.setTextColor(27, 23, 18);
  const brandWidth = doc.getTextWidth("schreiner");
  const domainWidth = doc.getTextWidth(".digital");
  doc.text("schreiner", pageMargin, 20);
  doc.setTextColor(255, 122, 26);
  doc.text(".digital", pageMargin + brandWidth, 20);

  const rulerX = pageMargin + brandWidth + 0.3;
  const rulerWidth = domainWidth - 0.3;
  doc.setDrawColor(27, 23, 18);
  doc.setLineWidth(0.35);
  doc.rect(rulerX, 22, rulerWidth, 2.8, "D");
  doc.setLineWidth(0.25);
  for (let t = 0; t <= 10; t++) {
    const tickX = rulerX + (rulerWidth / 10) * t;
    let tickHeight = 0.7;
    if (t === 0 || t === 10) tickHeight = 0;
    else if (t === 5) tickHeight = 1.4;
    else if (t % 2 === 0) tickHeight = 1.0;
    if (tickHeight > 0) doc.line(tickX, 22, tickX, 22 + tickHeight);
  }

  doc.setFillColor(242, 237, 228);
  doc.setDrawColor(230, 221, 206);
  doc.roundedRect(rightEdge - 62, 14.5, 62, 10, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text("HOLZTECHNIK", rightEdge - 59, 18.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 98, 82);
  doc.text(`Datum: ${new Date().toLocaleDateString("de-DE")}`, rightEdge - 4, 18.8, { align: "right" });

  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.4);
  doc.line(pageMargin, 27.5, rightEdge, 27.5);

  // --- 2. Titel & Parameter-Badges ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(27, 23, 18);
  doc.text("ZUSCHNITTPLAN: FALSCHE GEHRUNG", pageMargin, 36);

  const paramY = 40.5;
  const badgeH = 7.5;
  const colW = (contentWidth - 6) / 3;

  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(230, 221, 206);
  doc.roundedRect(pageMargin, paramY, colW, badgeH, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(108, 98, 82);
  if (inputs.angleMode === "polygon") {
    const poly = getPolygonByCorners(inputs.polygonCorners);
    doc.text("Vieleck:", pageMargin + 3, paramY + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 23, 18);
    doc.text(`${poly.shortName} (${formatMax2Dec(poly.angle)}°)`, pageMargin + colW - 3, paramY + 5, { align: "right" });
  } else {
    doc.text("Eckwinkel:", pageMargin + 3, paramY + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 23, 18);
    doc.text(`${formatMax2Dec(angle)}°`, pageMargin + colW - 3, paramY + 5, { align: "right" });
  }

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(pageMargin + colW + 3, paramY, colW, badgeH, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "normal");
  doc.setTextColor(146, 64, 14);
  doc.text("Material A:", pageMargin + colW + 6, paramY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(`${formatMax2Dec(materialA)} mm`, pageMargin + 2 * colW, paramY + 5, { align: "right" });

  doc.setFillColor(224, 242, 254);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(pageMargin + 2 * colW + 6, paramY, colW, badgeH, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "normal");
  doc.setTextColor(3, 105, 161);
  doc.text("Material B:", pageMargin + 2 * colW + 9, paramY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(`${formatMax2Dec(materialB)} mm`, rightEdge - 3, paramY + 5, { align: "right" });

  // --- 3. Skizze ---
  const sketchBoxX = pageMargin;
  const sketchBoxY = 52;
  const sketchBoxW = contentWidth;
  const sketchBoxH = 82;

  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.4);
  doc.roundedRect(sketchBoxX, sketchBoxY, sketchBoxW, sketchBoxH, 2.5, 2.5, "FD");
  doc.setFillColor(242, 237, 228);
  doc.roundedRect(sketchBoxX + 0.2, sketchBoxY + 0.2, sketchBoxW - 0.4, 8, 2, 2, "F");
  doc.rect(sketchBoxX + 0.2, sketchBoxY + 6, sketchBoxW - 0.4, 2.2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(27, 23, 18);
  doc.text("GEOMETRIE-SKIZZE", sketchBoxX + 5, sketchBoxY + 5.5);

  doc.setFontSize(7.5);
  const legMiterText = "Gehrungsschnitt";
  const legMiterTextW = doc.getTextWidth(legMiterText);
  const legMiterRight = rightEdge - 5;
  const legMiterLineX2 = legMiterRight - legMiterTextW - 2;
  const legMiterLineX1 = legMiterLineX2 - 6;
  doc.setDrawColor(255, 122, 26);
  doc.setLineWidth(0.8);
  doc.line(legMiterLineX1, sketchBoxY + 4.5, legMiterLineX2, sketchBoxY + 4.5);
  doc.setTextColor(255, 122, 26);
  doc.text(legMiterText, legMiterRight, sketchBoxY + 5.5, { align: "right" });

  const legBText = `Teil B (${materialB} mm)`;
  const legBTextW = doc.getTextWidth(legBText);
  const legBRight = legMiterLineX1 - 5;
  const legBBoxX = legBRight - legBTextW - 4.5;
  doc.setFillColor(224, 242, 254);
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.25);
  doc.rect(legBBoxX, sketchBoxY + 3.2, 3, 3, "FD");
  doc.setTextColor(3, 105, 161);
  doc.text(legBText, legBRight, sketchBoxY + 5.5, { align: "right" });

  const legAText = `Teil A (${materialA} mm)`;
  const legATextW = doc.getTextWidth(legAText);
  const legARight = legBBoxX - 5;
  const legABoxX = legARight - legATextW - 4.5;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.25);
  doc.rect(legABoxX, sketchBoxY + 3.2, 3, 3, "FD");
  doc.setTextColor(146, 64, 14);
  doc.text(legAText, legARight, sketchBoxY + 5.5, { align: "right" });

  const gammaRad = (angle * Math.PI) / 180;
  const sinGamma = Math.sin(gammaRad);
  const cosGamma = Math.cos(gammaRad);
  const sA = materialA;
  const sB = materialB;
  const p0 = { x: 0, y: 0 };
  const xIn = (sB + sA * cosGamma) / sinGamma;
  const yIn = sA;
  const pIn = { x: xIn, y: yIn };
  const maxThick = Math.max(sA, sB);
  const ext = maxThick * 1.2 + 25;
  const pAOut = { x: Math.max(xIn, 0) + ext, y: 0 };
  const pAIn = { x: Math.max(xIn, 0) + ext, y: sA };
  const uBx = Math.cos(gammaRad);
  const uBy = Math.sin(gammaRad);
  const nBx = Math.sin(gammaRad);
  const nBy = -Math.cos(gammaRad);
  const vB = (sA + sB * cosGamma) / sinGamma;
  const tEnd = Math.max(vB, 0) + ext;
  const pBOut = { x: tEnd * uBx, y: tEnd * uBy };
  const pBIn = { x: tEnd * uBx + sB * nBx, y: tEnd * uBy + sB * nBy };

  const geoPoints = [p0, pIn, pAOut, pAIn, pBOut, pBIn];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  geoPoints.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  const pad = maxThick * 0.35 + 15;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;
  const geoWidth = Math.max(maxX - minX, 60);
  const geoHeight = Math.max(maxY - minY, 50);

  const drawAreaW = sketchBoxW - 16;
  const drawAreaH = sketchBoxH - 14;
  const scale = Math.min(drawAreaW / geoWidth, drawAreaH / geoHeight);
  const originPdfX = sketchBoxX + 8 + (drawAreaW - geoWidth * scale) / 2 - minX * scale;
  const originPdfY = sketchBoxY + 10 + (drawAreaH - geoHeight * scale) / 2 - minY * scale;
  const toPdf = (pt: { x: number; y: number }) => ({ x: originPdfX + pt.x * scale, y: originPdfY + pt.y * scale });

  const pdfP0 = toPdf(p0);
  const pdfPIn = toPdf(pIn);
  const pdfPAOut = toPdf(pAOut);
  const pdfPAIn = toPdf(pAIn);
  const pdfPBOut = toPdf(pBOut);
  const pdfPBIn = toPdf(pBIn);

  doc.setFillColor(254, 243, 199);
  doc.triangle(pdfP0.x, pdfP0.y, pdfPAOut.x, pdfPAOut.y, pdfPAIn.x, pdfPAIn.y, "F");
  doc.triangle(pdfP0.x, pdfP0.y, pdfPAIn.x, pdfPAIn.y, pdfPIn.x, pdfPIn.y, "F");
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.35);
  doc.line(pdfP0.x, pdfP0.y, pdfPAOut.x, pdfPAOut.y);
  doc.line(pdfPAOut.x, pdfPAOut.y, pdfPAIn.x, pdfPAIn.y);
  doc.line(pdfPAIn.x, pdfPAIn.y, pdfPIn.x, pdfPIn.y);

  doc.setFillColor(224, 242, 254);
  doc.triangle(pdfP0.x, pdfP0.y, pdfPBOut.x, pdfPBOut.y, pdfPBIn.x, pdfPBIn.y, "F");
  doc.triangle(pdfP0.x, pdfP0.y, pdfPBIn.x, pdfPBIn.y, pdfPIn.x, pdfPIn.y, "F");
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.35);
  doc.line(pdfP0.x, pdfP0.y, pdfPBOut.x, pdfPBOut.y);
  doc.line(pdfPBOut.x, pdfPBOut.y, pdfPBIn.x, pdfPBIn.y);
  doc.line(pdfPBIn.x, pdfPBIn.y, pdfPIn.x, pdfPIn.y);

  doc.setDrawColor(255, 122, 26);
  doc.setLineWidth(0.85);
  doc.line(pdfP0.x, pdfP0.y, pdfPIn.x, pdfPIn.y);
  doc.setFillColor(27, 23, 18);
  doc.circle(pdfP0.x, pdfP0.y, 0.9, "F");
  doc.setFillColor(255, 122, 26);
  doc.circle(pdfPIn.x, pdfPIn.y, 0.8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 23, 18);
  doc.text(`${formatMax2Dec(angle)}°`, pdfP0.x - 2, pdfP0.y - 2, { align: "right" });
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(10);
  doc.text("A", pdfPAOut.x - 10, pdfPAOut.y + (pdfPAIn.y - pdfPAOut.y) / 2 + 1);
  doc.setTextColor(3, 105, 161);
  doc.text("B", (pdfP0.x + pdfPBOut.x) / 2 - 5, (pdfP0.y + pdfPBOut.y) / 2 - 2);

  // --- 4. Ergebniskarten ---
  const resultsStartY = 144;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(27, 23, 18);
  doc.text("BERECHNUNGSERGEBNISSE & MASCHINENEINSTELLUNG", pageMargin, resultsStartY);
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.35);
  doc.line(pageMargin, resultsStartY + 3, rightEdge, resultsStartY + 3);

  const cardY = resultsStartY + 7;
  const cardW = (contentWidth - 6) / 2;
  const cardH = 68;
  const heroBoxY = cardY + 11.5;
  const detailBoxY = heroBoxY + 28.5;

  function drawCard(x: number, label: string, sawAngle: string, cutAngle: string, offset: string, palette: { soft: [number, number, number]; border: [number, number, number]; text: [number, number, number]; accent: [number, number, number] }) {
    doc.setFillColor(...palette.soft);
    doc.roundedRect(x, cardY, cardW, cardH, 2.5, 2.5, "F");
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, cardY, cardW, cardH, 2.5, 2.5, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...palette.text);
    doc.text(label, x + 5, cardY + 7.5);
    doc.setFillColor(...palette.soft);
    doc.roundedRect(x + cardW - 17, cardY + 3.2, 12, 5, 1, 1, "FD");
    doc.setFontSize(6.5);
    doc.text(label.includes("A") ? "TEIL 1" : "TEIL 2", x + cardW - 11, cardY + 6.7, { align: "center" });

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x + 4, heroBoxY, cardW - 8, 26, 1.8, 1.8, "F");
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x + 4, heroBoxY, cardW - 8, 26, 1.8, 1.8, "D");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(108, 98, 82);
    doc.text("KAPPSÄGEN-SKALA (EINSTELLWERT):", x + 7, heroBoxY + 6);
    doc.setFontSize(21);
    doc.setTextColor(...palette.accent);
    doc.text(`${sawAngle}°`, x + 7, heroBoxY + 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(146, 135, 119);
    doc.text("Winkelanschlag an der Säge auf diesen Wert drehen", x + 7, heroBoxY + 22.5);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x + 4, detailBoxY, cardW - 8, 22, 1.8, 1.8, "F");
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x + 4, detailBoxY, cardW - 8, 22, 1.8, 1.8, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(108, 98, 82);
    doc.text("Schnittwinkel am Holz:", x + 7, detailBoxY + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(27, 23, 18);
    doc.text(`${cutAngle}°`, x + cardW - 7, detailBoxY + 7, { align: "right" });
    doc.setDrawColor(242, 237, 228);
    doc.line(x + 7, detailBoxY + 11, x + cardW - 7, detailBoxY + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(108, 98, 82);
    doc.text("Versatzmaß (Anriss):", x + 7, detailBoxY + 17.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(27, 23, 18);
    doc.text(`${offset} mm`, x + cardW - 7, detailBoxY + 17.5, { align: "right" });
  }

  drawCard(pageMargin, `WERKSTÜCK A (${formatMax2Dec(materialA)} mm)`, formatted.sawAngleA, formatted.cutAngleA, formatted.offsetA, {
    soft: [254, 243, 199],
    border: [253, 230, 138],
    text: [146, 64, 14],
    accent: [255, 122, 26],
  });
  drawCard(pageMargin + cardW + 6, `WERKSTÜCK B (${formatMax2Dec(materialB)} mm)`, formatted.sawAngleB, formatted.cutAngleB, formatted.offsetB, {
    soft: [224, 242, 254],
    border: [186, 230, 253],
    text: [3, 105, 161],
    accent: [2, 132, 199],
  });

  // --- 5. Kontrollmaß --- (hell statt dunkel hinterlegt, damit es beim
  // Ausdruck nicht literweise Tinte/Toner braucht)
  const miterBoxY = cardY + cardH + 7;
  const miterBoxH = 18;
  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(255, 122, 26);
  doc.setLineWidth(0.6);
  doc.roundedRect(pageMargin, miterBoxY, contentWidth, miterBoxH, 2.5, 2.5, "FD");
  doc.setFillColor(255, 122, 26);
  doc.roundedRect(pageMargin, miterBoxY, 3.5, miterBoxH, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 122, 26);
  doc.text("LÄNGE DER GEHRUNG (SELBSTKONTROLLE)", pageMargin + 8, miterBoxY + 7.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(108, 98, 82);
  doc.text("Kontrollmaß der Schnittkante am Holz: Beide Teile müssen nach dem Schnitt exakt diese Länge haben.", pageMargin + 8, miterBoxY + 13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 122, 26);
  doc.text(`${formatted.miterLength} mm`, rightEdge - 8, miterBoxY + 11.5, { align: "right" });

  // --- 6. Fußzeile ---
  const footerY = 276;
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.35);
  doc.line(pageMargin, footerY, rightEdge, footerY);
  doc.setFont("SpaceGrotesk", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(27, 23, 18);
  doc.text("schreiner", pageMargin, footerY + 6);
  doc.setTextColor(255, 122, 26);
  doc.text(".digital", pageMargin + doc.getTextWidth("schreiner"), footerY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(108, 98, 82);
  doc.text("Rechner-Tools für den modernen Schreineralltag", pageMargin, footerY + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 23, 18);
  doc.text("www.schreiner.digital", rightEdge, footerY + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(146, 135, 119);
  doc.text("Geometrisch berechnete Fertigungsmaße. Alle Angaben ohne Gewähr.", rightEdge, footerY + 10.5, { align: "right" });

  const polyTag = inputs.angleMode === "polygon" ? `_${inputs.polygonCorners}Eck` : "";
  const fileName = `Zuschnittplan_Falsche_Gehrung_${formatMax2Dec(materialA)}x${formatMax2Dec(materialB)}mm${polyTag}_${formatMax2Dec(angle)}Grad.pdf`;
  doc.save(fileName);
}

// --- GEOMETRY SKETCH (SVG) ---------------------------------------------------

function MiterDiagram({ inputs, results }: { inputs: MiterInputs; results: MiterCalculationResult }) {
  const diagram = useMemo(() => {
    if (!results.isValid) return null;
    const { materialA, materialB, angle } = inputs;
    const gammaRad = (angle * Math.PI) / 180;
    const sinGamma = Math.sin(gammaRad);
    const cosGamma = Math.cos(gammaRad);
    const sA = materialA;
    const sB = materialB;

    const p0 = { x: 0, y: 0 };
    const xIn = (sB + sA * cosGamma) / sinGamma;
    const yIn = sA;
    const pIn = { x: xIn, y: yIn };

    const maxThick = Math.max(sA, sB);
    const ext = maxThick * 1.3 + 30;

    const pAOut = { x: Math.max(xIn, 0) + ext, y: 0 };
    const pAIn = { x: Math.max(xIn, 0) + ext, y: sA };

    const uBx = Math.cos(gammaRad);
    const uBy = Math.sin(gammaRad);
    const nBx = Math.sin(gammaRad);
    const nBy = -Math.cos(gammaRad);
    const vB = (sA + sB * cosGamma) / sinGamma;
    const tEnd = Math.max(vB, 0) + ext;
    const pBOut = { x: tEnd * uBx, y: tEnd * uBy };
    const pBIn = { x: tEnd * uBx + sB * nBx, y: tEnd * uBy + sB * nBy };

    const points = [p0, pIn, pAOut, pAIn, pBOut, pBIn];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    const pad = maxThick * 0.4 + 25;
    minX -= pad;
    minY -= pad;
    maxX += pad;
    maxY += pad;
    const width = Math.max(maxX - minX, 100);
    const height = Math.max(maxY - minY, 100);

    return { p0, pIn, pAOut, pAIn, pBOut, pBIn, viewBox: `${minX} ${minY} ${width} ${height}` };
  }, [inputs, results]);

  if (!results.isValid || !diagram) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-paper text-xs text-ink-faint">
        Ungültige Maße für die Skizze
      </div>
    );
  }

  const { p0, pIn, pAOut, pAIn, pBOut, pBIn, viewBox } = diagram;
  const polyA = `${p0.x},${p0.y} ${pAOut.x},${pAOut.y} ${pAIn.x},${pAIn.y} ${pIn.x},${pIn.y}`;
  const polyB = `${p0.x},${p0.y} ${pBOut.x},${pBOut.y} ${pBIn.x},${pBIn.y} ${pIn.x},${pIn.y}`;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2.5">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">Geometrie-Skizze</span>
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-xs border border-amber-600 bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50" />
            Teil A ({inputs.materialA} mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-xs border border-sky-600 bg-sky-100 dark:border-sky-700 dark:bg-sky-950/50" />
            Teil B ({inputs.materialB} mm)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-accent">
            <span className="inline-block h-0.5 w-3 bg-accent" />
            Gehrungsschnitt
          </span>
        </div>
      </div>
      <div className="h-56 w-full overflow-hidden rounded-lg border border-border bg-paper sm:h-64">
        <svg className="h-full w-full" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
          <polygon points={polyA} className="fill-amber-100 stroke-amber-600 dark:fill-amber-950/40 dark:stroke-amber-700" strokeWidth={2} />
          <polygon points={polyB} className="fill-sky-100 stroke-sky-600 dark:fill-sky-950/40 dark:stroke-sky-700" strokeWidth={2} />
          <line x1={p0.x} y1={p0.y} x2={pIn.x} y2={pIn.y} className="stroke-accent" strokeWidth={3} strokeLinecap="round" />
          <circle cx={p0.x} cy={p0.y} r={3.5} className="fill-ink" />
          <circle cx={pIn.x} cy={pIn.y} r={3} className="fill-accent" />
          <text x={p0.x - 7} y={p0.y - 7} className="fill-ink font-display text-[11px] font-bold" textAnchor="end">
            {Math.round(inputs.angle * 100) / 100}°
          </text>
          <text x={pAOut.x - 24} y={inputs.materialA / 2 + 4} className="fill-amber-800 font-display text-xs font-bold dark:fill-amber-500">
            A
          </text>
          <text x={pBOut.x * 0.7 + pIn.x * 0.3 - 5} y={pBOut.y * 0.7 + pIn.y * 0.3 - 2} className="fill-sky-800 font-display text-xs font-bold dark:fill-sky-400">
            B
          </text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 dark:border-amber-800 dark:bg-amber-950/30">
          <span className="block text-[11px] font-semibold text-amber-800 dark:text-amber-400">Schnittwinkel Teil A:</span>
          <span className="font-mono text-base font-bold text-amber-900 dark:text-amber-300">{results.formatted.cutAngleA}°</span>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-2.5 dark:border-sky-800 dark:bg-sky-950/30">
          <span className="block text-[11px] font-semibold text-sky-800 dark:text-sky-400">Schnittwinkel Teil B:</span>
          <span className="font-mono text-base font-bold text-sky-900 dark:text-sky-300">{results.formatted.cutAngleB}°</span>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ----------------------------------------------------------

const DEFAULT_INPUTS: MiterInputs = {
  materialA: 19,
  materialB: 38,
  angle: 90,
  decimals: 2,
  angleMode: "custom",
  polygonCorners: 4,
};

const QUICK_ANGLES = [45, 60, 90, 120, 135];

const stepperBtn =
  "flex items-center justify-center px-3.5 sm:px-4 py-2.5 bg-surface-2 hover:bg-border active:bg-border-strong text-ink font-bold transition-colors cursor-pointer select-none";

export function FalscheGehrungRechner() {
  const [inputs, setInputs] = useState<MiterInputs>(DEFAULT_INPUTS);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const results = useMemo(() => calculateMiter(inputs), [inputs]);
  const currentPolygon = useMemo(() => getPolygonByCorners(inputs.polygonCorners), [inputs.polygonCorners]);

  function changeValue(key: "materialA" | "materialB" | "angle", delta: number) {
    setInputs((prev) => {
      const next = prev[key] + delta;
      if (key === "angle") {
        return { ...prev, angle: Math.min(170, Math.max(15, Math.round(next * 10) / 10)) };
      }
      return { ...prev, [key]: Math.max(1, Math.round(next * 10) / 10) };
    });
  }

  function selectPolygon(corners: number) {
    const poly = getPolygonByCorners(corners);
    setInputs((prev) => ({ ...prev, angleMode: "polygon", polygonCorners: corners, angle: poly.angle }));
  }

  function stepPolygon(delta: number) {
    selectPolygon(Math.max(3, Math.min(12, inputs.polygonCorners + delta)));
  }

  function setAngleMode(mode: AngleMode) {
    if (mode === "polygon") {
      const poly = getPolygonByCorners(inputs.polygonCorners);
      setInputs((prev) => ({ ...prev, angleMode: "polygon", angle: poly.angle }));
    } else {
      setInputs((prev) => ({ ...prev, angleMode: "custom" }));
    }
  }

  async function handleDownloadPdf() {
    setPdfGenerating(true);
    try {
      await generateMiterPdf(inputs, results);
    } catch (err) {
      console.error("Fehler bei der PDF-Erstellung:", err);
    } finally {
      setPdfGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Materialstärken */}
      <div className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">Materialstärken</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setInputs((prev) => ({ ...prev, materialA: 19, materialB: 38 }))}
              className="cursor-pointer rounded border border-border px-2 py-0.5 text-[11px] font-medium text-ink transition-colors hover:bg-surface-2"
            >
              19 / 38 mm
            </button>
            <button
              type="button"
              onClick={() => setInputs((prev) => ({ ...prev, materialA: 19, materialB: 19 }))}
              className="cursor-pointer rounded border border-border px-2 py-0.5 text-[11px] font-medium text-ink transition-colors hover:bg-surface-2"
            >
              Gleich (19 mm)
            </button>
          </div>
        </div>

        {(["materialA", "materialB"] as const).map((key, i) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={key} className="text-xs font-bold text-ink">
                Materialstärke {i === 0 ? "A" : "B"}:
              </label>
              <span className="text-[11px] text-ink-faint">Werkstück {i + 1}</span>
            </div>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-paper focus-within:border-accent focus-within:ring-2 focus-within:ring-accent">
              <button type="button" onClick={() => changeValue(key, -1)} className={`${stepperBtn} rounded-l-xl border-r border-border`} aria-label="1 mm weniger">
                <Minus className="size-4" strokeWidth={2.5} />
              </button>
              <div className="relative flex flex-1 items-center">
                <input
                  id={key}
                  type="number"
                  min="0.1"
                  step="any"
                  value={inputs[key] === 0 ? "" : inputs[key]}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setInputs((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
                  }}
                  className="h-full w-full bg-transparent px-3 text-center font-mono text-lg font-bold text-ink outline-hidden"
                />
                <span className="pointer-events-none absolute right-3 text-xs font-semibold text-ink-faint">mm</span>
              </div>
              <button type="button" onClick={() => changeValue(key, 1)} className={`${stepperBtn} rounded-r-xl border-l border-border`} aria-label="1 mm mehr">
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setInputs((prev) => ({ ...prev, materialA: prev.materialB, materialB: prev.materialA }))}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2 hover:text-accent"
          >
            <ArrowLeftRight className="size-3.5 text-accent" />
            A ⇄ B tauschen
          </button>
        </div>
      </div>

      {/* Winkel / Geometrie */}
      <div className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div>
          <span className="mb-2 block text-xs font-bold text-ink">Geometrie / Eckwinkel-Modus:</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setAngleMode("custom")}
              className={`cursor-pointer select-none rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                inputs.angleMode === "custom" ? "bg-ink text-paper shadow-xs" : "text-ink-muted hover:text-ink"
              }`}
            >
              Freier Winkel
            </button>
            <button
              type="button"
              onClick={() => setAngleMode("polygon")}
              className={`cursor-pointer select-none rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                inputs.angleMode === "polygon" ? "bg-ink text-paper shadow-xs" : "text-ink-muted hover:text-ink"
              }`}
            >
              Vieleck (3–12 Ecken)
            </button>
          </div>
        </div>

        {inputs.angleMode === "custom" ? (
          <div className="space-y-2.5 rounded-xl border border-border bg-paper p-3">
            <div className="flex items-center justify-between">
              <label htmlFor="conn-angle" className="text-xs font-bold text-ink">
                Freier Eckwinkel:
              </label>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => changeValue("angle", -1)} className="size-6 cursor-pointer select-none rounded-md border border-border bg-surface text-xs font-bold text-ink transition-colors hover:bg-surface-2" title="1° weniger">
                  −
                </button>
                <span className="min-w-14 rounded-md border border-border bg-surface px-2.5 py-0.5 text-center font-mono text-xs font-bold text-ink">
                  {inputs.angle.toFixed(inputs.angle % 1 === 0 ? 0 : 1)}°
                </span>
                <button type="button" onClick={() => changeValue("angle", 1)} className="size-6 cursor-pointer select-none rounded-md border border-border bg-surface text-xs font-bold text-ink transition-colors hover:bg-surface-2" title="1° mehr">
                  +
                </button>
              </div>
            </div>
            <input
              id="conn-angle"
              type="range"
              min="15"
              max="165"
              step="0.5"
              value={inputs.angle}
              onChange={(e) => setInputs((prev) => ({ ...prev, angle: parseFloat(e.target.value) }))}
              className="h-2 w-full cursor-pointer rounded-lg bg-border accent-accent"
            />
            <div className="flex justify-between gap-1 pt-0.5">
              {QUICK_ANGLES.map((ang) => (
                <button
                  key={ang}
                  type="button"
                  onClick={() => setInputs((prev) => ({ ...prev, angle: ang }))}
                  className={`flex-1 cursor-pointer rounded border py-1 text-[11px] font-semibold transition-colors ${
                    Math.round(inputs.angle) === ang ? "border-ink bg-ink text-paper" : "border-border bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {ang}°
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 rounded-xl border border-border bg-paper p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink">Eckenzahl wählen:</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => stepPolygon(-1)} disabled={inputs.polygonCorners <= 3} className="size-6 cursor-pointer select-none rounded-md border border-border bg-surface text-xs font-bold text-ink transition-colors hover:bg-surface-2 disabled:opacity-40" title="1 Ecke weniger">
                  −
                </button>
                <span className="min-w-13 rounded-md border border-border bg-surface px-2 py-0.5 text-center font-mono text-xs font-bold text-ink">{inputs.polygonCorners}-Eck</span>
                <button type="button" onClick={() => stepPolygon(1)} disabled={inputs.polygonCorners >= 12} className="size-6 cursor-pointer select-none rounded-md border border-border bg-surface text-xs font-bold text-ink transition-colors hover:bg-surface-2 disabled:opacity-40" title="1 Ecke mehr">
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {POLYGON_OPTIONS.map((poly) => {
                const isSelected = inputs.polygonCorners === poly.corners;
                return (
                  <button
                    key={poly.corners}
                    type="button"
                    onClick={() => selectPolygon(poly.corners)}
                    title={`${poly.name} (${poly.angleDisplay})`}
                    className={`flex cursor-pointer select-none flex-col items-center justify-center rounded-lg border py-1.5 transition-all ${
                      isSelected ? "border-ink bg-ink text-paper shadow-xs" : "border-border bg-surface text-ink hover:border-border-strong hover:bg-surface-2"
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-tight">{poly.shortName}</span>
                    <span className={`mt-0.5 font-mono text-[9.5px] leading-tight ${isSelected ? "font-semibold text-accent" : "text-ink-faint"}`}>{poly.angleDisplay}</span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-1 rounded-lg border border-border bg-surface p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">{currentPolygon.name}</span>
                <span className="rounded border border-border bg-paper px-1.5 py-0.5 font-mono text-[11px] font-bold text-accent">γ = {currentPolygon.angleDisplay}</span>
              </div>
              <div className="text-[11px] leading-relaxed text-ink-muted">
                Sägewinkel bei gleicher Stärke: <strong className="font-mono text-ink">{currentPolygon.standardSawAngle.toFixed(2)}°</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {results.errorMessage && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400">{results.errorMessage}</p>
      )}

      {/* Skizze */}
      <MiterDiagram inputs={inputs} results={results} />

      {/* Ergebnisse */}
      <div className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">Berechnungsergebnisse</span>
          <span className="font-mono text-xs text-ink-faint">
            {inputs.angleMode === "polygon" ? `${inputs.polygonCorners}-Eck (${currentPolygon.angleDisplay})` : `Eckwinkel: ${inputs.angle.toFixed(inputs.angle % 1 === 0 ? 0 : 2)}°`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-2.5 rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-800 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Werkstück A ({inputs.materialA} mm)</span>
              <span className="rounded border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">Teil 1</span>
            </div>
            <div className="rounded-lg border border-amber-200 bg-surface p-2.5 dark:border-amber-800">
              <div className="text-[10px] font-semibold text-ink-muted">Kappsägen-Skala:</div>
              <div className="font-mono text-2xl font-bold text-accent">{results.formatted.sawAngleA}°</div>
              <div className="mt-0.5 text-[10px] text-ink-faint">
                Schnittwinkel am Holz: <strong>{results.formatted.cutAngleA}°</strong>
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-surface p-2.5 dark:border-amber-800">
              <div className="text-[10px] font-semibold text-ink-muted">Versatzmaß A:</div>
              <div className="font-mono text-lg font-bold text-ink">
                {results.formatted.offsetA} <span className="text-xs font-normal text-ink-faint">mm</span>
              </div>
              <div className="mt-0.5 text-[10px] text-ink-faint">Anrissmaß für Flächenüberstand</div>
            </div>
          </div>

          <div className="space-y-2.5 rounded-xl border border-sky-200 bg-sky-50/40 p-3.5 dark:border-sky-800 dark:bg-sky-950/20">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400">Werkstück B ({inputs.materialB} mm)</span>
              <span className="rounded border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400">Teil 2</span>
            </div>
            <div className="rounded-lg border border-sky-200 bg-surface p-2.5 dark:border-sky-800">
              <div className="text-[10px] font-semibold text-ink-muted">Kappsägen-Skala:</div>
              <div className="font-mono text-2xl font-bold text-sky-600 dark:text-sky-400">{results.formatted.sawAngleB}°</div>
              <div className="mt-0.5 text-[10px] text-ink-faint">
                Schnittwinkel am Holz: <strong>{results.formatted.cutAngleB}°</strong>
              </div>
            </div>
            <div className="rounded-lg border border-sky-200 bg-surface p-2.5 dark:border-sky-800">
              <div className="text-[10px] font-semibold text-ink-muted">Versatzmaß B:</div>
              <div className="font-mono text-lg font-bold text-ink">
                {results.formatted.offsetB} <span className="text-xs font-normal text-ink-faint">mm</span>
              </div>
              <div className="mt-0.5 text-[10px] text-ink-faint">Anrissmaß für Flächenüberstand</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-ink px-3.5 py-3 text-paper shadow-xs">
          <div>
            <div className="font-display text-xs font-bold uppercase tracking-wider text-accent">Länge der Gehrung</div>
            <div className="text-[11px] text-ink-faint">Kontrollmaß der Schnittkante am Maßband</div>
          </div>
          <div className="font-mono text-2xl font-bold text-accent">
            {results.formatted.miterLength} <span className="text-xs font-normal text-paper">mm</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfGenerating || !results.isValid}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-contrast shadow-xs transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <Download className="size-4" />
          <span>{pdfGenerating ? "Generiere PDF …" : "Zuschnittplan als PDF"}</span>
        </button>
      </div>

      <div className="rounded-lg border border-border bg-paper p-3 text-xs text-ink-muted">
        <span className="font-semibold text-ink">Kappsägen-Skala:</span> Der Skalenwert der Kappsäge entspricht dem Komplementwinkel (90° minus Schnittwinkel).
      </div>
    </div>
  );
}
