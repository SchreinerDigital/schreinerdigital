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

const generatePDF = (
  results: CalculationResult,
  wallWidth: string,
  wallHeight: string,
  wallThickness: string,
  dinSide: string,
) => {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  // Helper to replace "ß" and "ẞ" to avoid character encoding bugs in standard pdf fonts
  const cleanText = (text: string): string => {
    if (!text) return "";
    return text.replace(/ß/g, "ss").replace(/ẞ/g, "SS");
  };

  // 1. Header Section - Dynamic Vector Logo (schreiner.digital + ruler)
  const textPrefix = "schreiner";
  const textSuffix = ".digital";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(17, 24, 39); // deep charcoal

  const prefixWidth = doc.getTextWidth(textPrefix);
  const suffixWidth = doc.getTextWidth(textSuffix);

  // Draw Logo text
  const logoBaselineY = 19;
  doc.text(textPrefix, 20, logoBaselineY);
  doc.text(textSuffix, 20 + prefixWidth, logoBaselineY);

  // Draw Ruler precisely underneath ".digital"
  const rulerX = 20 + prefixWidth + 0.4;
  const rulerY = 21.0;
  const rulerWidth = suffixWidth - 0.4;
  const rulerHeight = 3.2;

  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.35);
  doc.rect(rulerX, rulerY, rulerWidth, rulerHeight, "D");

  const ticksCount = 10;
  doc.setLineWidth(0.25);
  for (let i = 0; i <= ticksCount; i++) {
    const tickX = rulerX + i * (rulerWidth / ticksCount);
    let tickLength = 0.9; // standard tick
    if (i === 0 || i === ticksCount) {
      tickLength = 0; // border takes care of it
    } else if (i === 5) {
      tickLength = 1.6; // middle tick
    } else if (i % 2 === 0) {
      tickLength = 1.2; // half ticks
    }
    if (tickLength > 0) {
      doc.line(tickX, rulerY, tickX, rulerY + tickLength);
    }
  }

  // Right-aligned header info - only date as requested
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Datum: ${new Date().toLocaleDateString("de-DE")}`, 190, 19, { align: "right" });

  // Thin separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(20, 26, 190, 26);

  // 2. Document Title & Subtitle (ß corrected to SS/ss, with generous spacing)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("AUFMASSBLATT & BESTELLEMPFEHLUNG", 20, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Geprüfte Bestell- und Aufmaßdaten für Innentüren und Zargen nach DIN 18101", 20, 44.5);

  // 3. Metadata details (compact & elegant, with breathable vertical spacing)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Anschlagrichtung:", 20, 52.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`DIN ${dinSide}`, 47, 52.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Berechnungstyp:", 80, 52.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text("Innentüren nach DIN 18101 (Normabgleich)", 105, 52.5);

  // 4. "BESTELLDATEN FÜR DEN FACHHANDEL" Card - Highly Prominent
  const cardX = 20;
  const cardY = 60;
  const cardW = 170;
  const cardH = 36;

  // Background for the coupon card (clean slate-50)
  doc.setFillColor(248, 250, 252);
  doc.rect(cardX, cardY, cardW, cardH, "F");

  // Solid dark slate border for ultimate structure
  doc.setDrawColor(30, 41, 59); // slate-800
  doc.setLineWidth(0.45);
  doc.rect(cardX, cardY, cardW, cardH, "D");

  // Title inside the shopping card
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // deep slate-900
  doc.text("BESTELLDATEN FÜR DEN FACHHANDEL / BAUMARKT", cardX + 6, cardY + 6.5);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Legen Sie diese geprüften Bestellmaße direkt dem Verkaufsberater vor.", cardX + 6, cardY + 10.5);

  // Subtle separator line below header in the card
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(cardX + 6, cardY + 12.5, cardX + cardW - 6, cardY + 12.5);

  // Layout the 4 columns for: Breite, Höhe, Wandstärke, Anschlag
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
    const textY = cardY + 19;

    // Draw item separator line (except the last one)
    if (i < 3) {
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.25);
      doc.line(cardX + (i + 1) * colWidth, cardY + 15.5, cardX + (i + 1) * colWidth, cardY + 32);
    }

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(col.label, colX, textY, { align: "center" });

    // Value (Enlarged to stand out significantly!)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    if (col.isSonder) {
      doc.setTextColor(185, 28, 28); // clean red for Sondermass
    } else {
      doc.setTextColor(15, 23, 42); // slate-900
    }
    doc.text(col.value, colX, textY + 6.5, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(col.subtitle, colX, textY + 11, { align: "center" });
  });

  // 5. Rohbau-Istmaße & Toleranzprüfung Table (Secondary layout)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // slate-600 for softer presence
  doc.text("ROHBAU-ISTMASSE & TOLERANZPRÜFUNG (Messergebnisse)", 20, 104);

  // Table header line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.line(20, 107, 190, 107);

  // Header texts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // soft slate
  doc.text("Mass-Typ / Dimension", 24, 111);
  doc.text("Messwert (Ist-Mass)", 70, 111);
  doc.text("Toleranz-Status", 110, 111);
  doc.text("Norm-Mass (Soll)", 155, 111);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.15);
  doc.line(20, 113, 190, 113);

  const rows = [
    { label: "Breite der Maueröffnung", measured: `${wallWidth} mm`, detail: results.details.width },
    { label: "Höhe (ab Fertigfußboden)", measured: `${wallHeight} mm`, detail: results.details.height },
    { label: "Wandstärke (Mauerstärke)", measured: `${wallThickness} mm`, detail: results.details.thickness },
  ];

  let rowY = 114;
  rows.forEach((row, i) => {
    // Subtle background for alternating rows
    if (i % 2 === 1) {
      doc.setFillColor(250, 251, 252);
      doc.rect(20, rowY, 170, 8.0, "F");
    }

    // Row texts (Slightly smaller, secondary)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(row.label, 24, rowY + 5.2);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(row.measured, 70, rowY + 5.2);

    // Clean text status with color, e.g. "Optimal", "Grenzbereich", "Sondermass"
    let statusText = "Optimal";
    let r = 21,
      g = 128,
      b = 61; // Optimal green
    if (row.detail.status === "yellow") {
      statusText = "Grenzbereich";
      r = 180;
      g = 83;
      b = 9; // Grenzbereich amber
    } else if (row.detail.status === "red") {
      statusText = "Sondermass";
      r = 185;
      g = 28;
      b = 28; // Sondermass red
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text(statusText, 110, rowY + 5.2);

    // Nennmaß/Norm-Maß
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    const normVal = row.detail.norm === "SONDER" ? "Sondermass" : `${row.detail.norm} mm`;
    doc.text(normVal, 155, rowY + 5.2);

    // Divider line between rows
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.12);
    doc.line(20, rowY + 8.0, 190, rowY + 8.0);

    rowY += 8.0;
  });

  // Solid line closing the table
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(20, rowY, 190, rowY);

  // 6. Detailed Advice Section (Secondary appearance)
  let currentY = rowY + 9;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // softer presence
  doc.text("MONTAGEHINWEISE & AUSWERTUNG", 20, currentY);

  // Draw a subtle line underneath the header
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(20, currentY + 2.5, 190, currentY + 2.5);

  currentY += 7.5;

  const advices = [
    { title: "Breitenmessung:", text: results.details.width.advice, color: results.details.width.status },
    { title: "Höhenmessung:", text: results.details.height.advice, color: results.details.height.status },
    { title: "Wandstärkenmessung:", text: results.details.thickness.advice, color: results.details.thickness.status },
  ];

  advices.forEach((adv) => {
    // Left marker line
    let r = 100,
      g = 116,
      b = 139; // slate-400
    if (adv.color === "yellow") {
      r = 217;
      g = 119;
      b = 6; // amber
    } else if (adv.color === "red") {
      r = 220;
      g = 38;
      b = 38; // red
    } else if (adv.color === "green") {
      r = 34;
      g = 197;
      b = 94; // green
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(adv.title, 23, currentY + 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5); // slightly smaller advice text
    doc.setTextColor(71, 85, 105); // softer gray text

    const adviceLines = doc.splitTextToSize(cleanText(adv.text), 164);
    // Draw wrapped lines
    doc.text(adviceLines, 23, currentY + 6.5);

    // Increment Y
    const blockHeight = 6.5 + adviceLines.length * 3.3;
    // Draw a very subtle indicator line if text is longer
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.65);
    doc.line(20, currentY, 20, currentY + blockHeight);

    currentY += blockHeight + 3.0;
  });

  // 8. Footer Section
  const footerY = 266;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(20, footerY, 190, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Wichtiger Hinweis:", 20, footerY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const disclaimerText =
    "Diese Empfehlung basiert auf der DIN 18101 Normung. Alle Maße sind bauseits vor der Bestellung zu prüfen. Einbaufehler, lotrechte Abweichungen und bauseitige Gegebenheiten können die Passform beeinflussen. Berechnungen erfolgen ohne Gewähr.";
  const wrappedDisclaimer = doc.splitTextToSize(cleanText(disclaimerText), 170);
  doc.text(wrappedDisclaimer, 20, footerY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text("Berechnet mit dem Online-Türenmaßrechner auf www.schreinerdigital.de", 105, footerY + 19, {
    align: "center",
  });

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
Berechnet mit dem Online-Türenmaßrechner auf www.schreinerdigital.de`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    if (results) {
      generatePDF(results, wallWidth, wallHeight, wallThickness, dinSide);
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
