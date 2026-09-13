"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { InfoTooltip } from "@/components/tools/info-tooltip";
import { cn } from "@/lib/cn";

// --- DATA & TYPES ---

type FitStatus = "red" | "yellow" | "green" | "info";

interface DimensionDetail {
  label: string;
  input: number;
  norm: number | string;
  status: FitStatus;
  info: string;
  advice: string;
}

interface CalculationResult {
  orderWidth: number | string;
  orderHeight: number | string;
  orderThickness: number | string;
  details: {
    width: DimensionDetail;
    height: DimensionDetail;
    thickness: DimensionDetail;
  };
  hasError: boolean;
  overallStatus: FitStatus;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

function tone(status: FitStatus) {
  switch (status) {
    case "green":
      return {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-400",
      };
    case "yellow":
      return {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-400",
      };
    case "red":
      return {
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
      };
    default:
      return {
        border: "border-sky-500/30",
        bg: "bg-sky-500/10",
        text: "text-sky-700 dark:text-sky-400",
      };
  }
}

// --- PDF GENERATOR --- (unchanged from the reference calculator: pure jsPDF drawing)

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

// jsPDF only ships Helvetica/Times/Courier; the real wordmark font (site
// header, next/font/google Space_Grotesk) is fetched from a public static
// asset and embedded here so the exported PDF's logo matches the actual
// brand instead of silently falling back to Helvetica.
async function registerBrandFont(doc: jsPDF) {
  if (!brandFontBase64Cache) {
    const res = await fetch("/fonts/SpaceGrotesk-Bold.ttf");
    brandFontBase64Cache = arrayBufferToBase64(await res.arrayBuffer());
  }
  doc.addFileToVFS("SpaceGrotesk-Bold.ttf", brandFontBase64Cache);
  doc.addFont("SpaceGrotesk-Bold.ttf", "SpaceGrotesk", "bold");
}

// Status-Palette (deckt sich mit tone() oben: emerald/amber/red), als RGB-
// Tripel für jsPDF – dieselbe Statusfarbe wie im Web-UI, nur fürs PDF.
const STATUS_PALETTE: Record<FitStatus, { soft: [number, number, number]; border: [number, number, number]; text: [number, number, number] }> = {
  green: { soft: [220, 252, 231], border: [167, 243, 208], text: [4, 120, 87] },
  yellow: { soft: [254, 243, 199], border: [253, 230, 138], text: [146, 64, 14] },
  red: { soft: [254, 226, 226], border: [252, 165, 165], text: [185, 28, 28] },
  info: { soft: [224, 242, 254], border: [186, 230, 253], text: [3, 105, 161] },
};

const statusLabel = (status: FitStatus) =>
  status === "green" ? "Optimal" : status === "red" ? "Sondermass" : "Grenzbereich";

const generatePDF = async (
  results: CalculationResult,
  wallWidth: string,
  wallHeight: string,
  wallThickness: string,
  dinSide: string,
) => {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  await registerBrandFont(doc);

  // Helper to replace "ß" and "ẞ" to avoid character encoding bugs in standard pdf fonts
  const cleanText = (text: string): string => {
    if (!text) return "";
    return text.replace(/ß/g, "ss").replace(/ẞ/g, "SS");
  };

  const pageMargin = 20;
  const contentWidth = 170;
  const rightEdge = 190;

  // --- 1. Kopfzeile (identisch zu den anderen Rechner-PDFs) ---
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
  doc.text("TÜRENTECHNIK", rightEdge - 59, 18.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 98, 82);
  doc.text(`Datum: ${new Date().toLocaleDateString("de-DE")}`, rightEdge - 4, 18.8, { align: "right" });

  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.4);
  doc.line(pageMargin, 27.5, rightEdge, 27.5);

  // --- 2. Titel & Metadaten ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(27, 23, 18);
  doc.text("AUFMASSBLATT & BESTELLEMPFEHLUNG", pageMargin, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(108, 98, 82);
  doc.text("Geprüfte Bestell- und Aufmaßdaten für Innentüren und Zargen nach DIN 18101", pageMargin, 41);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 98, 82);
  doc.text("Anschlagrichtung:", pageMargin, 48);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(27, 23, 18);
  doc.text(`DIN ${dinSide}`, pageMargin + 27, 48);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(108, 98, 82);
  doc.text("Berechnungstyp:", pageMargin + 60, 48);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(27, 23, 18);
  doc.text("Innentüren nach DIN 18101 (Normabgleich)", pageMargin + 85, 48);

  // --- 3. "BESTELLDATEN FÜR DEN FACHHANDEL" Karte ---
  const cardX = pageMargin;
  const cardY = 53;
  const cardW = contentWidth;
  const cardH = 36;

  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 2.5, 2.5, "FD");
  doc.setFillColor(242, 237, 228);
  doc.roundedRect(cardX + 0.2, cardY + 0.2, cardW - 0.4, 8, 2, 2, "F");
  doc.rect(cardX + 0.2, cardY + 6, cardW - 0.4, 2.2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(27, 23, 18);
  doc.text("BESTELLDATEN FÜR DEN FACHHANDEL / BAUMARKT", cardX + 6, cardY + 5.8);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(108, 98, 82);
  doc.text("Legen Sie diese geprüften Bestellmaße direkt dem Verkaufsberater vor.", cardX + 6, cardY + 15.5);

  const colWidth = cardW / 4;
  const cols = [
    {
      label: "Türblatt-Breite",
      value: results.orderWidth === "SONDER" ? "SONDERMASS" : `${results.orderWidth} mm`,
      subtitle: results.orderWidth === "SONDER" ? "Sondermass-Bedarf" : "DIN-Standard",
      isSonder: results.orderWidth === "SONDER",
    },
    {
      label: "Türblatt-Höhe",
      value: results.orderHeight === "SONDER" ? "SONDERMASS" : `${results.orderHeight} mm`,
      subtitle: results.orderHeight === "SONDER" ? "Sondermass-Bedarf" : "DIN-Standard",
      isSonder: results.orderHeight === "SONDER",
    },
    {
      label: "Zargen-Wandstärke",
      value: results.orderThickness === "SONDER" ? "SONDERMASS" : `${results.orderThickness} mm`,
      subtitle: results.orderThickness === "SONDER" ? "Sondermass-Bedarf" : "Standard-Zarge",
      isSonder: results.orderThickness === "SONDER",
    },
    { label: "Anschlagrichtung", value: `DIN ${dinSide}`, subtitle: "Einbauseite", isSonder: false },
  ];

  cols.forEach((col, i) => {
    const colX = cardX + i * colWidth + colWidth / 2;
    const textY = cardY + 20.5;

    if (i < 3) {
      doc.setDrawColor(230, 221, 206);
      doc.setLineWidth(0.25);
      doc.line(cardX + (i + 1) * colWidth, cardY + 15, cardX + (i + 1) * colWidth, cardY + 31);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(108, 98, 82);
    doc.text(col.label, colX, textY, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const valueColor: [number, number, number] = col.isSonder ? STATUS_PALETTE.red.text : [255, 122, 26];
    doc.setTextColor(...valueColor);
    doc.text(col.value, colX, textY + 6.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(146, 135, 119);
    doc.text(col.subtitle, colX, textY + 11, { align: "center" });
  });

  // --- 4. Rohbau-Istmaße & Toleranzprüfung ---
  const tableTitleY = cardY + cardH + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(27, 23, 18);
  doc.text("ROHBAU-ISTMASSE & TOLERANZPRÜFUNG (Messergebnisse)", pageMargin, tableTitleY);
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.35);
  doc.line(pageMargin, tableTitleY + 3, rightEdge, tableTitleY + 3);

  const headerY = tableTitleY + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(108, 98, 82);
  doc.text("Mass-Typ / Dimension", pageMargin + 4, headerY);
  doc.text("Messwert (Ist-Mass)", pageMargin + 50, headerY);
  doc.text("Toleranz-Status", pageMargin + 90, headerY);
  doc.text("Norm-Mass (Soll)", pageMargin + 135, headerY);

  const rows = [
    { label: "Breite der Maueröffnung", measured: `${wallWidth} mm`, detail: results.details.width },
    { label: "Höhe (ab Fertigfußboden)", measured: `${wallHeight} mm`, detail: results.details.height },
    { label: "Wandstärke (Mauerstärke)", measured: `${wallThickness} mm`, detail: results.details.thickness },
  ];

  let rowY = headerY + 4;
  const rowH = 10.5;
  rows.forEach((row) => {
    const palette = STATUS_PALETTE[row.detail.status];
    doc.setFillColor(...palette.soft);
    doc.roundedRect(pageMargin, rowY, contentWidth, rowH, 1.5, 1.5, "F");
    doc.setFillColor(...palette.text);
    doc.rect(pageMargin, rowY, 1.4, rowH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(27, 23, 18);
    doc.text(row.label, pageMargin + 4, rowY + rowH / 2 + 1);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(108, 98, 82);
    doc.text(row.measured, pageMargin + 50, rowY + rowH / 2 + 1);

    doc.setFillColor(255, 255, 255);
    const badgeText = statusLabel(row.detail.status);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    const badgeW = doc.getTextWidth(badgeText) + 6;
    doc.roundedRect(pageMargin + 90, rowY + rowH / 2 - 3, badgeW, 6, 3, 3, "F");
    doc.setTextColor(...palette.text);
    doc.text(badgeText, pageMargin + 90 + badgeW / 2, rowY + rowH / 2 + 1.2, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(27, 23, 18);
    const normVal = row.detail.norm === "SONDER" ? "Sondermass" : `${row.detail.norm} mm`;
    doc.text(normVal, pageMargin + 135, rowY + rowH / 2 + 1);

    rowY += rowH + 2;
  });

  // --- 5. Montagehinweise & Auswertung ---
  let currentY = rowY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(27, 23, 18);
  doc.text("MONTAGEHINWEISE & AUSWERTUNG", pageMargin, currentY);
  doc.setDrawColor(230, 221, 206);
  doc.setLineWidth(0.35);
  doc.line(pageMargin, currentY + 3, rightEdge, currentY + 3);

  currentY += 8;

  const advices = [
    { title: "Breitenmessung:", text: results.details.width.advice, status: results.details.width.status },
    { title: "Höhenmessung:", text: results.details.height.advice, status: results.details.height.status },
    { title: "Wandstärkenmessung:", text: results.details.thickness.advice, status: results.details.thickness.status },
  ];

  advices.forEach((adv) => {
    const palette = STATUS_PALETTE[adv.status];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    const adviceLines = doc.splitTextToSize(cleanText(adv.text), contentWidth - 14);
    const textBlockH = adviceLines.length * 3.4;
    const boxH = 4 + 4.2 + textBlockH + 3;

    doc.setFillColor(...palette.soft);
    doc.roundedRect(pageMargin, currentY, contentWidth, boxH, 2, 2, "F");
    doc.setFillColor(...palette.text);
    doc.roundedRect(pageMargin, currentY, 1.4, boxH, 0.7, 0.7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...palette.text);
    doc.text(adv.title, pageMargin + 5, currentY + 5.3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(27, 23, 18);
    doc.text(adviceLines, pageMargin + 5, currentY + 9.5);

    currentY += boxH + 3.5;
  });

  // --- 6. Fußzeile ---
  const footerY = 266;
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
  doc.setFontSize(8);
  doc.setTextColor(27, 23, 18);
  doc.text("www.schreiner.digital", rightEdge, footerY + 6, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(146, 135, 119);
  const disclaimerText =
    "Diese Empfehlung basiert auf der DIN 18101 Normung. Alle Maße sind bauseits vor der Bestellung zu prüfen. Einbaufehler, lotrechte Abweichungen und bauseitige Gegebenheiten können die Passform beeinflussen. Berechnungen erfolgen ohne Gewähr.";
  const wrappedDisclaimer = doc.splitTextToSize(cleanText(disclaimerText), 90);
  doc.text(wrappedDisclaimer, rightEdge, footerY + 10.5, { align: "right" });

  // Download PDF
  const filename = `Aufmassblatt_DIN18101_${wallWidth}x${wallHeight}.pdf`;
  doc.save(filename);
};

// --- APP COMPONENT ---

export function TuerenmassRechner() {
  const [wallWidth, setWallWidth] = useState<string>("");
  const [wallHeight, setWallHeight] = useState<string>("");
  const [wallThickness, setWallThickness] = useState<string>("");
  const [dinSide, setDinSide] = useState<string>("Links");

  // Custom states for copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Derived live from the current inputs (no click needed) - reset to null whenever a field is empty.
  const results = useMemo<CalculationResult | null>(() => {
    if (!wallWidth || !wallHeight || !wallThickness) return null;

    const ww = parseFloat(wallWidth);
    const wh = parseFloat(wallHeight);
    const wt = parseFloat(wallThickness);

    if (isNaN(ww) || isNaN(wh) || isNaN(wt)) return null;

    // 1. Logik Breite
    let bestW: number | string = "SONDER";
    let wStatus: FitStatus = "red";
    let wAdvice = "";

    if (ww < 500) {
      wAdvice = "Breite unzureichend. Die Maueröffnung muss verbreitert werden.";
    } else if (ww <= 624) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 634) {
      wStatus = "yellow";
      bestW = 610;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 664) {
      wStatus = "green";
      bestW = 610;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 699) {
      wStatus = "yellow";
      bestW = 610;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else if (ww <= 749) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 759) {
      wStatus = "yellow";
      bestW = 735;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 789) {
      wStatus = "green";
      bestW = 735;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 824) {
      wStatus = "yellow";
      bestW = 735;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else if (ww <= 874) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 884) {
      wStatus = "yellow";
      bestW = 860;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 914) {
      wStatus = "green";
      bestW = 860;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 949) {
      wStatus = "yellow";
      bestW = 860;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else if (ww <= 999) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 1009) {
      wStatus = "yellow";
      bestW = 985;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 1034) {
      wStatus = "green";
      bestW = 985;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 1074) {
      wStatus = "yellow";
      bestW = 985;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else if (ww <= 1124) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 1134) {
      wStatus = "yellow";
      bestW = 1110;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 1159) {
      wStatus = "green";
      bestW = 1110;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 1199) {
      wStatus = "yellow";
      bestW = 1110;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else if (ww <= 1249) {
      wAdvice =
        "Standardbreite nicht passend. Da die Breite der Öffnung außerhalb der Toleranzgrenzen liegt, kann kein Standardelement verbaut werden. Wir empfehlen die Bestellung auf Maß.";
    } else if (ww <= 1259) {
      wStatus = "yellow";
      bestW = 1235;
      wAdvice =
        "Breite sehr knapp – Sondermaß empfohlen! Die Öffnung liegt am untersten Limit. Damit die Zarge passt, muss die Leibung exakt lotrecht sein; zudem ist das Einstemmen der Bandtaschen erforderlich. Vorsicht bei Funktionstüren: Da hier kaum Raum für Montageschaum und Abdichtung bleibt, sollte für WE-Türen zwingend ein Sondermaß gewählt werden, um spätere Reklamationen (Schall/Zugluft) zu vermeiden.";
    } else if (ww <= 1284) {
      wStatus = "green";
      bestW = 1235;
      wAdvice = "Passt perfekt! Die Breite liegt im Idealbereich.";
    } else if (ww <= 1324) {
      wStatus = "yellow";
      bestW = 1235;
      wAdvice =
        "Breite grenzwertig – Bekleidung deckt noch ab. Die Maueröffnung ist sehr groß für ein Standardelement. Bei breiten Türen ist es ratsam, die Leibung auf der Schlossseite bauseits zu unterfüttern (Holz/Styrodur). Vorsicht: Handelt es sich um eine Funktionstür (z. B. WE-Tür), wählen Sie bitte ein Sondermaß. Der große Hohlraum verhindert eine korrekte Abdichtung, was zu Einbußen bei Schallschutz und Dichtheit führt.";
    } else {
      wAdvice =
        "Breite außerhalb der Normtoleranz. Für diese Öffnung ist leider kein passendes Standard-Türelement verfügbar. Die sicherste und sauberste Lösung ist hier eine individuelle Sonderanfertigung evtl. auch 2-flügelig.";
    }

    // 2. Logik Höhe
    let bestH: number | string = "SONDER";
    let hStatus: FitStatus = "yellow";
    let hAdvice = "";

    if (wh < 1500) {
      hStatus = "red";
      hAdvice = "Für dieses Maß kann keine sturzhohe Tür gefertigt werden.";
    } else if (wh <= 1974) {
      hStatus = "red";
      hAdvice = "Für die Höhe der Maueröffnung benötigen Sie ein Sondermaß.";
    } else if (wh <= 1999) {
      hStatus = "yellow";
      hAdvice =
        "Die Höhe der Maueröffnung ist zu niedrig. Nehmen Sie entweder ein Sondermaß oder schneiden die Standardmaßtür unten ab! (max. 30mm)";
      bestH = 1985;
    } else if (wh <= 2009) {
      hStatus = "yellow";
      hAdvice = "Grenzbereich! Für einfache Innentüren ist die Höhe akzeptabel. Achtung bei Funktionstüren: Sondermaß bestellen!";
      bestH = 1985;
    } else if (wh <= 2049) {
      hStatus = "green";
      hAdvice = "Passt perfekt! Die Höhe liegt im Idealbereich.";
      bestH = 1985;
    } else if (wh <= 2099) {
      hStatus = "yellow";
      hAdvice = "Die Öffnung ist zu hoch für eine Standardtür. Lösung: Sturzbereich bauseits aufdoppeln/abhängen oder Sonderhöhe bestellen.";
      bestH = 1985;
    } else if (wh <= 2124) {
      hStatus = "yellow";
      hAdvice =
        "Die Höhe der Maueröffnung ist zu niedrig. Nehmen Sie entweder ein Sondermaß oder schneiden die Standardmaßtür unten ab! (max. 30mm)";
      bestH = 2110;
    } else if (wh <= 2134) {
      hStatus = "yellow";
      hAdvice = "Grenzbereich! Für einfache Innentüren ist die Höhe akzeptabel. Achtung bei Funktionstüren: Sondermaß bestellen!";
      bestH = 2110;
    } else if (wh <= 2169) {
      hStatus = "green";
      hAdvice = "Passt perfekt! Die Höhe liegt im Idealbereich.";
      bestH = 2110;
    } else if (wh <= 2224) {
      hStatus = "yellow";
      hAdvice = "Die Öffnung ist zu hoch für eine Standardtür. Lösung: Sturzbereich bauseits aufdoppeln/abhängen oder Sonderhöhe bestellen.";
      bestH = 2110;
    } else if (wh <= 2249) {
      hStatus = "yellow";
      hAdvice =
        "Die Höhe der Maueröffnung ist zu niedrig. Nehmen Sie entweder ein Sondermaß oder schneiden die Standardmaßtür unten ab! (max. 30mm)";
      bestH = 2235;
    } else if (wh <= 2259) {
      hStatus = "yellow";
      hAdvice = "Grenzbereich! Für einfache Innentüren ist die Höhe akzeptabel. Achtung bei Funktionstüren: Sondermaß bestellen!";
      bestH = 2235;
    } else if (wh <= 2294) {
      hStatus = "green";
      hAdvice = "Passt perfekt! Die Höhe liegt im Idealbereich.";
      bestH = 2235;
    } else {
      hStatus = "yellow";
      hAdvice = "Die Öffnung ist zu hoch für eine Standardtür. Lösung: Sturzbereich bauseits aufdoppeln/abhängen oder Sonderhöhe bestellen.";
    }

    // 3. Logik Wandstärke
    let tStatus: FitStatus = "yellow";
    let tAdvice = "";
    let orderT: number | string = "SONDER";

    if (wt < 75) {
      tStatus = "red";
      tAdvice = "Wandstärke zu klein für Futtertüren! Bitte Konstruktion ändern: Weiche auf einen Blend- oder Blockrahmen aus.";
    } else if (wt > 340) {
      tStatus = "red";
      tAdvice = "Sondermaß-Bereich erreicht! Für diese Wandstärke ist keine Lagerware verfügbar. Prüfen Sie bauliche Anpassungen.";
    } else {
      const n = Math.floor((wt - 75) / 20);
      const targetZarge = 80 + n * 20;
      orderT = targetZarge;

      if (wt >= targetZarge - 5 && wt <= targetZarge + 10) {
        tStatus = "green";
        tAdvice = "Passt perfekt! Die Wandstärke liegt im Idealbereich.";
      } else if (wt >= targetZarge + 11 && wt <= targetZarge + 14) {
        tStatus = "yellow";
        tAdvice = "Achtung: Wandstärke am Limit! Eine Montage ist nur bei perfekt lotrechten Wänden möglich. Im Zweifelsfall nächstgrößere Wandstärke wählen.";
      }
    }

    const hasError = wStatus === "red" || hStatus === "red" || tStatus === "red";

    const overall = [wStatus, hStatus, tStatus].includes("red")
      ? "red"
      : [wStatus, hStatus, tStatus].includes("yellow")
        ? "yellow"
        : "green";

    return {
      orderWidth: wStatus === "red" ? "SONDER" : bestW,
      orderHeight: bestH,
      orderThickness: orderT,
      details: {
        width: {
          label: "Rohbaubreite",
          input: ww,
          norm: bestW,
          status: wStatus,
          info: wStatus === "green" ? "Optimal" : wStatus === "red" ? "Sondermaß" : "Grenzbereich",
          advice: wAdvice,
        },
        height: {
          label: "Rohbauhöhe",
          input: wh,
          norm: bestH,
          status: hStatus,
          info: hStatus === "green" ? "Optimal" : hStatus === "red" ? "Sondermaß" : "Grenzbereich",
          advice: hAdvice,
        },
        thickness: {
          label: "Wandstärke",
          input: wt,
          norm: orderT,
          status: tStatus,
          info: tStatus === "green" ? "Optimal" : tStatus === "red" ? "Sondermaß" : "Grenzbereich",
          advice: tAdvice,
        },
      },
      hasError: hasError,
      overallStatus: overall,
    };
  }, [wallWidth, wallHeight, wallThickness]);

  const copySummary = () => {
    if (!results) return;
    const summaryText = `Türenmaß-Berechnung | www.schreinerdigital.de
-------------------------------------------
Anschlagrichtung: DIN ${dinSide}

Gemessene Rohbaumaße der Maueröffnung:
- Breite: ${wallWidth} mm
- Höhe: ${wallHeight} mm
- Wandstärke: ${wallThickness} mm

Empfohlenes Bestellmaß (Standardmaß nach DIN 18101):
- Türblatt-Breite: ${results.orderWidth === "SONDER" ? "Sondermaß" : `${results.orderWidth} mm`}
- Türblatt-Höhe: ${results.orderHeight === "SONDER" ? "Sondermaß" : `${results.orderHeight} mm`}
- Zargen-Wandstärke: ${results.orderThickness === "SONDER" ? "Sondermaß" : `${results.orderThickness} mm`}

Einzelauswertung & Toleranzen:
- Breite: ${results.details.width.info} | ${results.details.width.advice}
- Höhe: ${results.details.height.info} | ${results.details.height.advice}
- Wandstärke: ${results.details.thickness.info} | ${results.details.thickness.advice}

Fachhinweis zur Montage:
${
  results.hasError
    ? "Achtung: Sondermaß-Bedarf ermittelt. Maueröffnung anpassen oder Zarge/Türblatt auf Maß anfertigen lassen."
    : "Perfekt: Die Maße liegen im DIN-Standardbereich. Ein Standard-Türelement nach DIN 18101 passt."
}

-------------------------------------------
Berechnet mit dem Online-Türenmaß-Rechner auf www.schreinerdigital.de`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    if (results) {
      generatePDF(results, wallWidth, wallHeight, wallThickness, dinSide).catch((err: unknown) => {
        console.error("PDF-Erstellung fehlgeschlagen:", err);
      });
    }
  };

  const pillBase = "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors";

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <p className="text-sm text-ink-muted">
          Geben Sie hier Ihre gemessenen lichten Maueröffnungsmaße in Millimetern (mm) ein. Das
          Ergebnis wird sofort live berechnet.
        </p>

        <label htmlFor="wall-width" className="block">
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Rohbaubreite (Breite der Maueröffnung)
            <InfoTooltip text="Messen Sie die lichte Breite an mindestens 3 Stellen (oben, mitte, unten) und tragen Sie das schmalste gemessene Maß in mm ein." />
          </span>
          <div className="relative">
            <input
              id="wall-width"
              type="number"
              min="300"
              max="3000"
              value={wallWidth}
              onChange={(e) => setWallWidth(e.target.value)}
              placeholder="z.B. 885"
              className={fieldClass}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
              mm
            </span>
          </div>
        </label>

        <label htmlFor="wall-height" className="block">
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Rohbauhöhe (Höhe der Maueröffnung)
            <InfoTooltip text="Messen Sie die lichte Höhe ab Oberkante Fertigfußboden (OFF) bis zur Sturzunterkante links & rechts. Tragen Sie das kürzere Maß ein." />
          </span>
          <div className="relative">
            <input
              id="wall-height"
              type="number"
              min="1000"
              max="3000"
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
              placeholder="z.B. 2010"
              className={fieldClass}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
              mm
            </span>
          </div>
        </label>

        <label htmlFor="wall-thickness" className="block">
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Wandstärke (Mauerstärke inkl. Putz/Fliesen)
            <InfoTooltip text="Messen Sie die Wanddicke an mehreren Stellen inkl. Putz, Fliesen oder Trockenbau. Tragen Sie die dickste Stelle in mm ein." />
          </span>
          <div className="relative">
            <input
              id="wall-thickness"
              type="number"
              min="50"
              max="600"
              value={wallThickness}
              onChange={(e) => setWallThickness(e.target.value)}
              placeholder="z.B. 145"
              className={fieldClass}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
              mm
            </span>
          </div>
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">
            Anschlagrichtung (DIN-Richtung)
          </span>
          <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
            <button
              type="button"
              onClick={() => setDinSide("Links")}
              className={cn(
                pillBase,
                dinSide === "Links" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
              )}
            >
              DIN Links
            </button>
            <button
              type="button"
              onClick={() => setDinSide("Rechts")}
              className={cn(
                pillBase,
                dinSide === "Rechts" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
              )}
            >
              DIN Rechts
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-md border border-border bg-paper px-3 py-2 text-xs text-ink-faint">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Echtzeit-Analyse aktiv: Ergebnisse passen sich sofort an.
        </div>
      </div>

      {results ? (
        <div className="space-y-5">
          <div
            className={cn(
              "rounded-[var(--radius)] border p-5 text-center",
              tone(results.overallStatus).border,
              tone(results.overallStatus).bg,
            )}
          >
            <div className="font-mono text-xs uppercase tracking-wider text-ink-faint">
              Empfohlenes Bestellmaß
            </div>
            <div className={cn("mt-1.5 font-mono text-2xl font-bold", tone(results.overallStatus).text)}>
              {results.orderWidth} x {results.orderHeight} x {results.orderThickness}{" "}
              <span className="text-base font-normal text-ink-faint">mm</span>
            </div>
            <div className="mt-1 text-xs text-ink-faint">DIN {dinSide} (Anschlag)</div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={copySummary}
              title="Kopiert die gesamte Auswertung als Text in Ihre Zwischenablage"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-accent" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Ergebnis kopieren
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              title="Erzeugt ein professionell formatiertes Aufmaßblatt als direkten PDF-Download"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <Download size={16} />
              Aufmaßblatt als PDF
            </button>
          </div>

          <div className="space-y-3">
            {[results.details.width, results.details.height, results.details.thickness].map(
              (d, i) => {
                const t = tone(d.status);
                return (
                  <div key={i} className={cn("rounded-[var(--radius)] border p-4", t.border, t.bg)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-medium text-ink">{d.label}</span>
                        <span className="ml-2 text-xs text-ink-faint">({d.input} mm gemessen)</span>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wide",
                          t.text,
                        )}
                      >
                        {d.info}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.advice}</p>
                  </div>
                );
              },
            )}
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
            <strong className="text-ink">💡 Profi-Tipp für die Bestellung:</strong>{" "}
            {results.hasError
              ? "Da mindestens ein Wert außerhalb der DIN-Standardnorm liegt, sollten Sie die Maueröffnung anpassen oder das Türelement gezielt auf Maß fertigen lassen. Vermeiden Sie Improvisationen auf der Baustelle."
              : "Alle Ihre gemessenen Werte liegen im optimalen Bereich. Sie können bedenkenlos ein Standard-Türelement nach DIN 18101 im Baumarkt oder Fachhandel erwerben. Achten Sie bei der Montage darauf, dass die Zargen exakt lotrecht eingebaut werden."}
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-center">
          <div className="text-3xl" aria-hidden>
            📐
          </div>
          <h3 className="mt-3 text-lg">Maße ausstehend</h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Tragen Sie oben die Breite, Höhe und Wandstärke der Maueröffnung ein.
          </p>
          <div className="mt-4 flex flex-col items-center gap-1 text-xs text-ink-faint">
            <span>✓ Live-Berechnung ohne Klicks</span>
            <span>✓ Inklusive Toleranz- und Einbauprüfung</span>
            <span>✓ Offizieller DIN 18101 Normen-Abgleich</span>
          </div>
        </div>
      )}
    </div>
  );
}
