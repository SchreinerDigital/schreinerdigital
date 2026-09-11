// rechnungsvorlage.mjs — RECHNUNG (PDF + Word)
//
// Customer-facing invoice with the elements required under § 14 UStG
// (fortlaufende Rechnungsnummer, Leistungsdatum, Steuersatz/-betrag) plus an
// explicit Verzugsfolgen-Hinweis, which German law requires stating on the
// invoice itself for automatic default against consumers after 30 days
// (§ 286 Abs. 3 BGB) without a further reminder being necessary. The credit
// note / cancellation-invoice variants live in their own standalone files
// (gutschrift.mjs, storno-rechnung.mjs).
//
// Laid out as a real DIN-5008-style business letter, matching the exact
// structure of the user's own Drive original (verified against a PDF export
// of Rechnungsvorlage.docx) — just restyled in schreiner.digital's design
// (accent-colored rules, house font) instead of the original's plain blue.
// Original wording throughout; every company/person/address/amount
// reference is a literal bracketed placeholder — nothing here is real
// business data.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawLetterHeader,
  drawAddressBlock,
  drawInfoBox,
  drawSubjectLine,
  drawTotalsBlock,
  totalsBlockHeight,
  ensureLetterRoom,
  finalizeLetterPdf,
  pdfText,
  drawParagraph,
  drawTable,
  tableHeight,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxTotalsBlock,
  docxLetterFooter,
  docxParagraph,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "Rechnung";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const INFO_FIELDS = [
  { label: "Datum:", value: "[Datum]" },
  { label: "Rechnungsnummer:", value: "[Nummer]" },
  { note: "Rechnungsdatum entspricht Liefer-/Leistungsdatum" },
];

const TOTALS_ROWS = [
  { label: "Nettobetrag" },
  { label: "zzgl. 19 % USt." },
  { label: "Rechnungsbetrag", bold: true, shaded: true },
];

function drawSignature(doc, y) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, "Mit freundlichen Grüßen", PAGE.marginLeft, y);
  y += 6;
  pdfText(doc, "[Ihr Name]", PAGE.marginLeft, y);
  return y;
}

function signatureParagraphs(spacingAfter) {
  return [docxParagraph("Mit freundlichen Grüßen", { spacingAfter: 20 }), docxParagraph("[Ihr Name]", { spacingAfter })];
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  drawLetterHeader(doc);
  const addressEndY = drawAddressBlock(doc);
  const infoEndY = drawInfoBox(doc, INFO_FIELDS);
  let y = Math.max(addressEndY, infoEndY) + 10;

  y = drawSubjectLine(doc, y, TITLE);

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, vereinbarungsgemäß berechnen wir Ihnen hiermit folgende Leistungen:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: 6 }) + totalsBlockHeight(TOTALS_ROWS.length));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 6,
    fontSize: 7.5,
  });
  y = drawTotalsBlock(doc, y, TOTALS_ROWS);
  y += 10;

  y = ensureLetterRoom(doc, y, 26);
  y = drawParagraph(
    doc,
    "Bitte überweisen Sie den Rechnungsbetrag innerhalb von [Zahlungsziel, z. B. 14 Tage] auf das unten genannte Konto. Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen gemäß § 288 BGB zu berechnen. Für Rückfragen stehen wir gerne zur Verfügung.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 10;

  y = ensureLetterRoom(doc, y, 16);
  drawSignature(doc, y);

  finalizeLetterPdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxLetterHeader(),
    ...docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSpacer(200),
    docxSubjectLine(TITLE),
    docxParagraph("Sehr geehrte Damen und Herren, vereinbarungsgemäß berechnen wir Ihnen hiermit folgende Leistungen:"),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 6,
    }),
    docxTotalsBlock(TOTALS_ROWS),
    docxSpacer(300),
    docxParagraph(
      "Bitte überweisen Sie den Rechnungsbetrag innerhalb von [Zahlungsziel, z. B. 14 Tage] auf das unten genannte Konto. Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen gemäß § 288 BGB zu berechnen. Für Rückfragen stehen wir gerne zur Verfügung.",
      { spacingAfter: 300 },
    ),
    ...signatureParagraphs(300),
    ...docxLetterFooter(),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateRechnungsvorlage() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
