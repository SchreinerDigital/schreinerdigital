// branding.mjs
//
// Shared branding constants + drawing/layout helpers for the schreiner.digital
// downloadable template generator. Used by every template's .mjs file.
//
// PDF helpers use jsPDF in "mm" units on A4 (210 x 297mm), margins x=20..190.
// DOCX helpers use the `docx` package (percentage table widths).
// XLSX helpers use `exceljs` (applied directly to a worksheet + row cursor).

import {
  AlignmentType,
  BorderStyle,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

// --- COLORS -----------------------------------------------------------

// RGB arrays for jsPDF's setTextColor/setDrawColor/setFillColor(r, g, b).
export const COLORS = {
  ink: [27, 23, 18],
  accent: [255, 122, 26],
  muted: [100, 100, 95],
  // Exact color specified for the header separator line.
  headerRule: [226, 232, 240],
  // Supporting neutrals (not explicitly specified) for table grids / fields.
  border: [195, 191, 185],
  headerFill: [244, 242, 238],
};

// Hex (docx) / ARGB (exceljs) equivalents of the same palette.
export const HEX = {
  ink: "1B1712",
  accent: "FF7A1A",
  muted: "646460",
  border: "C3BFB9",
  headerFill: "F4F2EE",
};
export const ARGB = {
  ink: "FF1B1712",
  accent: "FFFF7A1A",
  muted: "FF646460",
  border: "FFC3BFB9",
  headerFill: "FFF4F2EE",
};

// --- PAGE GEOMETRY (A4, mm) --------------------------------------------

export const PAGE = {
  width: 210,
  height: 297,
  marginLeft: 20,
  marginRight: 190,
  contentWidth: 170,
};

// Below this y (mm), a new page should be started before drawing more content.
const SAFE_BOTTOM = 278;

// --- TEXT HELPERS --------------------------------------------------------

// Standard 14 PDF fonts can mishandle "ß"/"ẞ" — replace as done elsewhere in
// this repo's jsPDF usage (see tuerenmass-rechner.tsx generatePDF).
export function cleanText(text) {
  if (!text) return "";
  return String(text).replace(/ß/g, "ss").replace(/ẞ/g, "SS");
}

export function pdfText(doc, str, x, y, opts) {
  doc.text(cleanText(str), x, y, opts);
}

// Draws a paragraph of body text wrapped to maxWidth, returns the y cursor
// just below the last drawn line.
export function drawParagraph(doc, text, x, y, maxWidth, opts = {}) {
  const { fontSize = 9, lineHeight = 4.3, color = COLORS.ink, font = "normal" } = opts;
  doc.setFont("helvetica", font);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(cleanText(text), maxWidth);
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

// --- HEADER / FOOTER -----------------------------------------------------

function fitTitleFontSize(doc, text, maxWidth, startSize, minSize = 10.5) {
  let size = startSize;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size);
  while (doc.getTextWidth(cleanText(text)) > maxWidth && size > minSize) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  return size;
}

// Draws the schreiner.digital two-tone wordmark at the given baseline.
export function drawWordmark(doc, x = PAGE.marginLeft, y = 18) {
  const prefix = "schreiner";
  const suffix = ".digital";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.ink);
  doc.text(prefix, x, y);
  const prefixWidth = doc.getTextWidth(prefix);
  doc.setTextColor(...COLORS.accent);
  doc.text(suffix, x + prefixWidth, y);
}

// Draws the full branded header: wordmark, "Vorlage von schreiner.digital"
// top-right, separator line, then an optional bold title and/or muted
// subtitle line. Returns the y coordinate where template content may begin.
//
// Pass `title: null` to omit the title line (used by the Angebotsvorlage,
// which reserves its own big "Angebot" heading further down the page).
export function drawPdfHeader(doc, { title, subtitle } = {}) {
  drawWordmark(doc, PAGE.marginLeft, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, "Vorlage von schreiner.digital", PAGE.marginRight, 18, { align: "right" });

  doc.setDrawColor(...COLORS.headerRule);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginLeft, 24, PAGE.marginRight, 24);

  let y = 32;
  if (title) {
    const size = fitTitleFontSize(doc, title, PAGE.contentWidth, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...COLORS.ink);
    pdfText(doc, title, PAGE.marginLeft, y);
    y += 5.5;
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      pdfText(doc, subtitle, PAGE.marginLeft, y);
    }
    return 46;
  }
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.muted);
    pdfText(doc, subtitle, PAGE.marginLeft, y);
  }
  return 40;
}

export function drawPdfFooter(doc, pageNumber, pageCount) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  let footer = "www.schreiner.digital · Vorlage zur freien Verwendung";
  if (pageCount > 1) {
    footer += `   ·   Seite ${pageNumber} von ${pageCount}`;
  }
  pdfText(doc, footer, PAGE.width / 2, 289, { align: "center" });
}

// Call once, after all content has been drawn, to stamp every page's footer
// (page numbers require knowing the final page count).
export function finalizePdf(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawPdfFooter(doc, i, pageCount);
  }
  return doc;
}

// If the next block of `needed` mm would run past the safe content area,
// start a new page (redrawing the branded header) and return the new y.
export function ensureRoom(doc, y, needed, header) {
  if (y + needed > SAFE_BOTTOM) {
    doc.addPage();
    return drawPdfHeader(doc, header);
  }
  return y;
}

// --- LETTER LAYOUT (DIN-5008-style German business letter) --------------
//
// Used by the Auftragsabwicklung document family (Angebot, Auftragsbestä-
// tigung, Rechnung, Mahnungen, Gutschrift, Lieferschein, ...): real business
// correspondence the customer sends out under their OWN letterhead. Unlike
// the product-style drawPdfHeader() above (schreiner.digital wordmark, used
// for internal checklists/planners), these documents show a "[Ihr Firmen-
// logo]" placeholder instead, plus the sender reference line, address
// window and info box conventional in German business letters. The
// schreiner.digital credit shrinks to a small footer line instead of a
// full-width top banner, so the document looks like a real, ready-to-send
// letter rather than a shop product page.

export const LETTER_SENDER_LINE = "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort]";
export const LETTER_ADDRESS_PLACEHOLDER = ["[Name des Kunden]", "[Straße Hausnummer]", "[PLZ Ort]"];
export const LETTER_FOOTER_CONTACT = [
  "[Ihre Firma]",
  "[Straße Hausnummer] · [PLZ Ort]",
  "Telefon: [Nummer] · [E-Mail]",
  "[Website]",
];
export const LETTER_FOOTER_BANK = [
  "Bank: [Name] · IBAN: [IBAN] · BIC: [BIC]",
  "Registergericht: [Ort] · HRB [Nummer]",
  "USt-IdNr.: [Nummer]",
];

const LETTER = {
  logoX: PAGE.marginLeft,
  logoY: 14,
  logoWidth: 60,
  logoHeight: 18,
  ruleY: 34,
  senderLineY: 43,
  addressStartY: 50,
  addressLineGap: 5,
  infoBoxX: 122,
  infoBoxWidth: 68,
  infoStartY: 43,
  infoLineGap: 5.5,
  footerRuleY: 266,
};

// Dashed placeholder box standing in for the customer's own company logo.
function drawLetterLogoPlaceholder(doc) {
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([1.5, 1.2], 0);
  doc.rect(LETTER.logoX, LETTER.logoY, LETTER.logoWidth, LETTER.logoHeight, "D");
  doc.setLineDashPattern([], 0);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, "[Ihr Firmenlogo]", LETTER.logoX + LETTER.logoWidth / 2, LETTER.logoY + LETTER.logoHeight / 2 + 1.2, {
    align: "center",
  });
}

// Logo placeholder + header rule. Returns the y where the sender line /
// address block / info box may begin (LETTER.senderLineY).
export function drawLetterHeader(doc) {
  drawLetterLogoPlaceholder(doc);
  doc.setDrawColor(...COLORS.headerRule);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginLeft, LETTER.ruleY, PAGE.marginRight, LETTER.ruleY);
  return LETTER.senderLineY;
}

// Small underlined "Rücksendeangabe" sender line + recipient address block
// (DIN-5008 address window). `sender` defaults to LETTER_SENDER_LINE,
// `addressLines` to LETTER_ADDRESS_PLACEHOLDER. Returns the y just below
// the last address line.
export function drawAddressBlock(doc, { sender = LETTER_SENDER_LINE, addressLines = LETTER_ADDRESS_PLACEHOLDER } = {}) {
  const y = LETTER.senderLineY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, sender, PAGE.marginLeft, y);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(PAGE.marginLeft, y + 1.2, PAGE.marginLeft + doc.getTextWidth(cleanText(sender)), y + 1.2);

  let ay = LETTER.addressStartY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.ink);
  addressLines.forEach((line) => {
    pdfText(doc, line, PAGE.marginLeft, ay);
    ay += LETTER.addressLineGap;
  });
  return ay;
}

// Right-aligned info box beside the address block, e.g. Datum /
// Rechnungsnummer / Kundennummer. `fields`: [{ label, value }]. Returns the
// y just below the last row.
export function drawInfoBox(doc, fields) {
  const x = LETTER.infoBoxX;
  const width = LETTER.infoBoxWidth;
  let iy = LETTER.infoStartY;
  doc.setFontSize(9);
  fields.forEach(({ label, value }) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    pdfText(doc, label, x, iy);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.ink);
    pdfText(doc, value, x + width, iy, { align: "right" });
    iy += LETTER.infoLineGap;
  });
  return iy;
}

// Bold subject/title line (e.g. "Rechnung" or "1. MAHNUNG"). Returns the y
// just below it, ready for the salutation.
export function drawSubjectLine(doc, y, text) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, text, PAGE.marginLeft, y);
  return y + 9;
}

// Unlike the product-style pages (a single thin credit line at y=289), a
// letter's footer is a tall block starting at LETTER.footerRuleY (rule +
// two-column contact/bank text + credit line, ending around y=291) — so
// body content needs to stop well above that, not at the generic
// SAFE_BOTTOM used elsewhere in this file.
const LETTER_SAFE_BOTTOM = LETTER.footerRuleY - 8;

// On overflow, starts a new page with a plain safe top margin (no repeated
// address block — continuation pages of a letter just carry on the body).
export function ensureLetterRoom(doc, y, needed) {
  if (y + needed > LETTER_SAFE_BOTTOM) {
    doc.addPage();
    return 25;
  }
  return y;
}

// Footer rule + two-column table (contact info | bank & legal info) + a
// small schreiner.digital credit line. Called once per page by
// finalizeLetterPdf.
function drawLetterFooter(doc, { contactLines, bankLines, pageNumber, pageCount }) {
  doc.setDrawColor(...COLORS.headerRule);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginLeft, LETTER.footerRuleY, PAGE.marginRight, LETTER.footerRuleY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  let ly = LETTER.footerRuleY + 5;
  contactLines.forEach((line) => {
    pdfText(doc, line, PAGE.marginLeft, ly);
    ly += 3.8;
  });
  let ry = LETTER.footerRuleY + 5;
  bankLines.forEach((line) => {
    pdfText(doc, line, 106, ry);
    ry += 3.8;
  });

  let credit = "Vorlage von schreiner.digital";
  if (pageCount > 1) credit += `   ·   Seite ${pageNumber} von ${pageCount}`;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, credit, PAGE.width / 2, 289, { align: "center" });
}

// Call once, after all content has been drawn, to stamp every page's letter
// footer. `footerData`: { contactLines = LETTER_FOOTER_CONTACT, bankLines =
// LETTER_FOOTER_BANK }.
export function finalizeLetterPdf(doc, footerData = {}) {
  const { contactLines = LETTER_FOOTER_CONTACT, bankLines = LETTER_FOOTER_BANK } = footerData;
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawLetterFooter(doc, { contactLines, bankLines, pageNumber: i, pageCount });
  }
  return doc;
}

// --- SECTION LABELS / FIELDS / CHECKBOXES --------------------------------

export function sectionLabel(doc, x, y, text) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, text, x, y);
}

export function smallNote(doc, x, y, text) {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, text, x, y);
}

// A label followed by a fillable underline running to endX.
export function drawField(doc, { x, y, label, endX, fontSize = 9 }) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, label, x, y);
  const labelWidth = doc.getTextWidth(cleanText(label));
  const lineStartX = x + labelWidth + 2;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.25);
  doc.line(Math.min(lineStartX, endX), y + 1.3, endX, y + 1.3);
}

// Convenience: draw several fields left-to-right in one row.
// fields: [{ label, x, endX }]
export function drawFieldsRow(doc, y, fields, opts = {}) {
  fields.forEach((f) => drawField(doc, { ...f, y, fontSize: opts.fontSize }));
}

export function drawCheckbox(doc, x, y, size = 4) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.35);
  doc.rect(x, y, size, size, "D");
}

// A checkbox with a label to its right, returns nothing (caller manages x).
export function drawCheckboxLabel(doc, x, y, label, fontSize = 9) {
  drawCheckbox(doc, x, y - 3.2, 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, label, x + 6, y);
}

// Ruled blank area (for handwritten notes). Returns the y just below the
// last rule.
export function drawRuledArea(doc, { x = PAGE.marginLeft, y, width = PAGE.contentWidth, lines = 8, gap = 6 }) {
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  for (let i = 0; i < lines; i++) {
    const lineY = y + i * gap;
    doc.line(x, lineY, x + width, lineY);
  }
  return y + (lines - 1) * gap + gap;
}

export function ruledAreaHeight(lines = 8, gap = 6) {
  return (lines - 1) * gap + gap;
}

// --- TABLES (PDF) ---------------------------------------------------------

// Generic bordered table. `prefill` (optional) is a 2D array [row][col] of
// strings; null/undefined cells are left blank for handwriting.
// `extraRow` (optional) draws one additional bold summary row at the bottom,
// e.g. ["Summe Std.", null, null, null].
export function drawTable(doc, {
  x = PAGE.marginLeft,
  y,
  colWidths,
  headers,
  rowCount,
  prefill = null,
  rowHeight = 7,
  headerHeight = 7,
  fontSize = 8,
  extraRow = null,
}) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  let curY = y;

  // Header row.
  doc.setFillColor(...COLORS.headerFill);
  doc.rect(x, curY, totalWidth, headerHeight, "F");
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.25);
  doc.rect(x, curY, totalWidth, headerHeight, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.ink);
  let colX = x;
  headers.forEach((h, i) => {
    pdfText(doc, h, colX + 2, curY + headerHeight / 2 + 1.4);
    if (i > 0) doc.line(colX, curY, colX, curY + headerHeight);
    colX += colWidths[i];
  });
  curY += headerHeight;

  // Body rows.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  for (let r = 0; r < rowCount; r++) {
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);
    doc.rect(x, curY, totalWidth, rowHeight, "D");
    colX = x;
    for (let c = 0; c < colWidths.length; c++) {
      if (c > 0) doc.line(colX, curY, colX, curY + rowHeight);
      const val = prefill?.[r]?.[c];
      if (val != null && val !== "") {
        doc.setTextColor(...COLORS.ink);
        pdfText(doc, String(val), colX + 2, curY + rowHeight / 2 + 1.4);
      }
      colX += colWidths[c];
    }
    curY += rowHeight;
  }

  // Optional bold summary row.
  if (extraRow) {
    doc.setFillColor(...COLORS.headerFill);
    doc.rect(x, curY, totalWidth, rowHeight, "F");
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.25);
    doc.rect(x, curY, totalWidth, rowHeight, "D");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.setTextColor(...COLORS.ink);
    colX = x;
    extraRow.forEach((val, i) => {
      if (i > 0) doc.line(colX, curY, colX, curY + rowHeight);
      if (val != null && val !== "") {
        pdfText(doc, String(val), colX + 2, curY + rowHeight / 2 + 1.4);
      }
      colX += colWidths[i];
    });
    curY += rowHeight;
  }

  return curY;
}

export function tableHeight({ rowCount, rowHeight = 7, headerHeight = 7, extraRow = null }) {
  return headerHeight + rowCount * rowHeight + (extraRow ? rowHeight : 0);
}

// --- DOCX HELPERS ----------------------------------------------------------

export function docxWordmarkParagraph() {
  return new Paragraph({
    children: [
      new TextRun({ text: "schreiner", bold: true, size: 28, color: HEX.ink }),
      new TextRun({ text: ".digital", bold: true, size: 28, color: HEX.accent }),
    ],
    spacing: { after: 120 },
  });
}

export function docxTitleParagraph(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 32, color: HEX.ink })],
    spacing: { after: 80 },
  });
}

export function docxSubtitleParagraph(subtitle) {
  return new Paragraph({
    children: [new TextRun({ text: subtitle, italics: true, size: 19, color: HEX.muted })],
    spacing: { after: 300 },
  });
}

// Standard header block: wordmark + bold title + muted subtitle.
export function docxHeader(title, subtitle) {
  return [docxWordmarkParagraph(), docxTitleParagraph(title), docxSubtitleParagraph(subtitle)];
}

// --- DOCX LETTER LAYOUT (DIN-5008-style German business letter) ---------
// DOCX counterpart of the PDF letter-layout helpers above; same rationale.

const dashedBorder = { style: BorderStyle.DASHED, size: 2, color: HEX.border };
const allDashed = { top: dashedBorder, bottom: dashedBorder, left: dashedBorder, right: dashedBorder };

function ruleParagraph(spacingBefore = 0, spacingAfter = 300) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: HEX.border, space: 1 } },
    spacing: { before: spacingBefore, after: spacingAfter },
    children: [new TextRun({ text: " " })],
  });
}

// "[Ihr Firmenlogo]" dashed placeholder box (left-aligned, not full width)
// + header rule. Replaces docxHeader() for real business-letter documents.
export function docxLetterHeader() {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allNone,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 38, type: WidthType.PERCENTAGE },
              borders: allDashed,
              margins: { top: 160, bottom: 160, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "[Ihr Firmenlogo]", italics: true, size: 16, color: HEX.muted })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 62, type: WidthType.PERCENTAGE },
              borders: allNone,
              children: [new Paragraph({ children: [new TextRun({ text: "" })] })],
            }),
          ],
        }),
      ],
    }),
    ruleParagraph(200, 300),
  ];
}

// Sender line + recipient address block (left) beside a right-aligned info
// box (Datum / Rechnungsnummer / etc.), as one borderless 2-column table —
// the DOCX equivalent of drawAddressBlock()+drawInfoBox() side by side.
// `infoFields`: [{ label, value }].
export function docxAddressAndInfoBlock({
  sender = LETTER_SENDER_LINE,
  addressLines = LETTER_ADDRESS_PLACEHOLDER,
  infoFields,
}) {
  const addressCell = new TableCell({
    width: { size: 55, type: WidthType.PERCENTAGE },
    borders: allNone,
    children: [
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: HEX.border, space: 1 } },
        spacing: { after: 160 },
        children: [new TextRun({ text: sender, size: 15, color: HEX.muted })],
      }),
      ...addressLines.map(
        (line) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: line, size: 20, color: HEX.ink })] }),
      ),
    ],
  });
  const infoCell = new TableCell({
    width: { size: 45, type: WidthType.PERCENTAGE },
    borders: allNone,
    children: infoFields.map(
      ({ label, value }) =>
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${label} `, size: 18, color: HEX.muted }),
            new TextRun({ text: value, bold: true, size: 18, color: HEX.ink }),
          ],
        }),
    ),
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [addressCell, infoCell] })] });
}

// Bold subject/title line, e.g. "Rechnung" or "1. MAHNUNG".
export function docxSubjectLine(text) {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text, bold: true, size: 26, color: HEX.ink })],
  });
}

// Footer rule + two-column table (contact info | bank & legal info) + a
// small centered schreiner.digital credit line. Appended once at the end of
// a letter-style document's children array.
export function docxLetterFooter({ contactLines = LETTER_FOOTER_CONTACT, bankLines = LETTER_FOOTER_BANK } = {}) {
  return [
    ruleParagraph(300, 200),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allNone,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: allNone,
              children: contactLines.map(
                (l) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: l, size: 15, color: HEX.muted })] }),
              ),
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: allNone,
              children: bankLines.map(
                (l) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: l, size: 15, color: HEX.muted })] }),
              ),
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 0 },
      children: [new TextRun({ text: "Vorlage von schreiner.digital", italics: true, size: 14, color: HEX.muted })],
    }),
  ];
}

export function docxSectionLabel(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20, color: HEX.ink })],
    spacing: { before: 200, after: 100 },
  });
}

export function docxSpacer(size = 120) {
  return new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: size } });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinBorder = { style: BorderStyle.SINGLE, size: 2, color: HEX.border };
const allThin = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const allNone = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function blankParagraph(size = 20) {
  return new Paragraph({ children: [new TextRun({ text: " ", size })], spacing: { before: 40, after: 40 } });
}

// One row of "label: [fillable box]" field pairs, e.g.
// docxFieldsRow([{ label: "Name:", labelPct: 12, valuePct: 21 }, ...])
export function docxFieldsRow(pairs) {
  const cells = [];
  pairs.forEach(({ label, labelPct, valuePct }) => {
    cells.push(
      new TableCell({
        width: { size: labelPct, type: WidthType.PERCENTAGE },
        shading: { fill: HEX.headerFill },
        borders: allThin,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, color: HEX.muted })] })],
      }),
    );
    cells.push(
      new TableCell({
        width: { size: valuePct, type: WidthType.PERCENTAGE },
        borders: allThin,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [blankParagraph()],
      }),
    );
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: cells })],
  });
}

// A single wrapper to place several field rows with spacing after, since
// docx Tables can't easily be followed by margin without a spacer paragraph.
export function docxFieldsBlock(rowsOfPairs) {
  const out = [];
  rowsOfPairs.forEach((pairs) => {
    out.push(docxFieldsRow(pairs));
    out.push(docxSpacer(100));
  });
  return out;
}

// A right-aligned "label ... [box]" row, used for quote summary lines.
export function docxRightLabelRow(label) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 72, type: WidthType.PERCENTAGE },
        borders: allNone,
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: label, bold: true, size: 19, color: HEX.ink })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        borders: allThin,
        children: [blankParagraph()],
      }),
    ],
  });
}

export function docxRightLabelsTable(labels) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: labels.map((l) => docxRightLabelRow(l)),
  });
}

// Ruled blank lines (for handwritten/typed notes), each its own bottom-bordered
// empty paragraph.
export function docxRuledLines(count = 8) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    lines.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: HEX.border, space: 1 } },
        spacing: { after: 260 },
        children: [new TextRun({ text: " " })],
      }),
    );
  }
  return lines;
}

// A headed data table: header row (shaded/bold) + `rowCount` blank rows.
// `colPcts` must sum to 100. `prefill` (optional) is a 2D array [row][col] of
// strings for cells that should come pre-labeled (rest stay blank).
export function docxDataTable({ headers, colPcts, rowCount, prefill = null }) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h, i) =>
        new TableCell({
          width: { size: colPcts[i], type: WidthType.PERCENTAGE },
          shading: { fill: HEX.headerFill },
          borders: allThin,
          margins: { top: 60, bottom: 60, left: 80, right: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: HEX.ink })] })],
        }),
    ),
  });
  const bodyRows = [];
  for (let r = 0; r < rowCount; r++) {
    bodyRows.push(
      new TableRow({
        children: colPcts.map((pct, c) => {
          const val = prefill?.[r]?.[c];
          return new TableCell({
            width: { size: pct, type: WidthType.PERCENTAGE },
            borders: allThin,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              val != null && val !== ""
                ? new Paragraph({ children: [new TextRun({ text: String(val), size: 19, color: HEX.ink })] })
                : blankParagraph(),
            ],
          });
        }),
      }),
    );
  }
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] });
}

export function docxParagraph(text, opts = {}) {
  const { size = 20, bold = false, italics = false, color = HEX.ink, alignment, spacingAfter = 200 } = opts;
  return new Paragraph({
    alignment,
    spacing: { after: spacingAfter },
    children: [new TextRun({ text, bold, italics, size, color })],
  });
}

export function docxCheckboxLine(labels) {
  // Uses the Unicode ballot box (☐) as the fillable checkbox glyph.
  const text = labels.map((l) => `☐  ${l}`).join("        ");
  return new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 20, color: HEX.ink })],
  });
}

// --- XLSX HELPERS ----------------------------------------------------------

// Writes the wordmark (row 1), bold title (row 2) and muted subtitle
// (row 3) at the top of a worksheet. Returns the next free (blank) row.
export function xlsxHeader(ws, title, subtitle) {
  const r1 = ws.getRow(1);
  r1.getCell(1).value = {
    richText: [
      { font: { bold: true, size: 14, color: { argb: ARGB.ink } }, text: "schreiner" },
      { font: { bold: true, size: 14, color: { argb: ARGB.accent } }, text: ".digital" },
    ],
  };
  r1.height = 22;

  const r2 = ws.getRow(2);
  r2.getCell(1).value = title;
  r2.getCell(1).font = { bold: true, size: 13, color: { argb: ARGB.ink } };

  const r3 = ws.getRow(3);
  r3.getCell(1).value = subtitle;
  r3.getCell(1).font = { italic: true, size: 10, color: { argb: ARGB.muted } };

  return 5;
}

export function xlsxSectionLabel(ws, row, text) {
  const cell = ws.getCell(row, 1);
  cell.value = text;
  cell.font = { bold: true, size: 11, color: { argb: ARGB.ink } };
  return row + 1;
}

const xlsxThin = { style: "thin", color: { argb: ARGB.border } };
export const XLSX_THIN_BORDER = { top: xlsxThin, left: xlsxThin, bottom: xlsxThin, right: xlsxThin };
export const XLSX_HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: ARGB.headerFill } };

// Writes a header row (bold, shaded, bordered) starting at (row, startCol).
export function xlsxTableHeaderRow(ws, row, startCol, headers) {
  headers.forEach((h, i) => {
    const cell = ws.getCell(row, startCol + i);
    cell.value = h;
    cell.font = { bold: true, size: 10, color: { argb: ARGB.ink } };
    cell.fill = XLSX_HEADER_FILL;
    cell.border = XLSX_THIN_BORDER;
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  return row + 1;
}

// Writes `rowCount` blank bordered rows across the given columns, optionally
// pre-filling column offsets via `prefillCol0` (array of strings for the
// first column of each row).
export function xlsxBlankRows(ws, startRow, startCol, colCount, rowCount, prefillFirstCol = null) {
  for (let r = 0; r < rowCount; r++) {
    const rowIdx = startRow + r;
    for (let c = 0; c < colCount; c++) {
      const cell = ws.getCell(rowIdx, startCol + c);
      cell.border = XLSX_THIN_BORDER;
      if (c === 0 && prefillFirstCol && prefillFirstCol[r] != null) {
        cell.value = prefillFirstCol[r];
        cell.font = { size: 10, color: { argb: ARGB.ink } };
      }
    }
  }
  return startRow + rowCount;
}

export function xlsxSumRow(ws, row, startCol, labelText, sumColOffset, sumRangeStartRow, sumRangeEndRow) {
  const labelCell = ws.getCell(row, startCol);
  labelCell.value = labelText;
  labelCell.font = { bold: true, size: 10, color: { argb: ARGB.ink } };
  labelCell.border = XLSX_THIN_BORDER;

  const sumCol = startCol + sumColOffset;
  const colLetter = ws.getColumn(sumCol).letter;
  const sumCell = ws.getCell(row, sumCol);
  sumCell.value = { formula: `SUM(${colLetter}${sumRangeStartRow}:${colLetter}${sumRangeEndRow})` };
  sumCell.font = { bold: true, size: 10, color: { argb: ARGB.ink } };
  sumCell.border = XLSX_THIN_BORDER;
  sumCell.fill = XLSX_HEADER_FILL;
  labelCell.fill = XLSX_HEADER_FILL;
  return row + 1;
}
