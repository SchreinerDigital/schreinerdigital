// angebotsvorlage.mjs — ANGEBOT (PDF + Word)
//
// Customer-facing quote document. Original wording (not derived from any
// third-party template). Every company/person/address reference is a
// literal bracketed placeholder — nothing here is real business data.
//
// Laid out as a real DIN-5008-style business letter (address window, sender
// line, info box, "[Ihr Firmenlogo]" placeholder) since this document is
// meant to be sent out under the customer's OWN letterhead — not as a
// schreiner.digital product page.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawLetterHeader,
  drawAddressBlock,
  drawInfoBox,
  drawSubjectLine,
  ensureLetterRoom,
  finalizeLetterPdf,
  pdfText,
  drawParagraph,
  drawFieldsRow,
  drawTable,
  tableHeight,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxLetterFooter,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "Angebot";

const INTRO_TEXT =
  "Sehr geehrte(r) [Anrede Kunde], vielen Dank für Ihre Anfrage. Wir unterbreiten Ihnen hiermit folgendes Angebot:";
const BINDING_TEXT =
  "Dieses Angebot ist verbindlich und gilt bis zum [Datum]. Nach § 145 BGB sind wir an dieses Angebot gebunden, sobald Sie es annehmen. Möchten Sie sich eine unverbindliche Nachverhandlung vorbehalten, kennzeichnen Sie das Angebot ausdrücklich als freibleibend.";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const INFO_FIELDS = [
  { label: "Datum:", value: "[Datum]" },
  { label: "Angebotsnummer:", value: "[Nummer]" },
];

function drawSummaryLines(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Nettobetrag:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. 19 % USt.:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Gesamtbetrag (brutto):", x: 20, endX: 190 }]);
  return y;
}

function summaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Nettobetrag:", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. 19 % USt.:", labelPct: 35, valuePct: 65 }],
    [{ label: "Gesamtbetrag (brutto):", labelPct: 35, valuePct: 65 }],
  ]);
}

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
  let y = drawAddressBlock(doc);
  drawInfoBox(doc, INFO_FIELDS);
  y += 10;

  y = drawSubjectLine(doc, y, TITLE);
  y += 3;

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: 6 }));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 6,
    fontSize: 7.5,
  });
  y += 8;

  y = ensureLetterRoom(doc, y, 24);
  y = drawSummaryLines(doc, y);
  y += 12;

  y = ensureLetterRoom(doc, y, 20);
  y = drawParagraph(doc, BINDING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 8.5 });
  y += 10;

  y = ensureLetterRoom(doc, y, 16);
  drawSignature(doc, y);

  finalizeLetterPdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxLetterHeader(),
    docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSpacer(200),
    docxSubjectLine(TITLE),
    docxParagraph(INTRO_TEXT),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 6,
    }),
    docxSpacer(200),
    ...summaryFieldsBlock(),
    docxParagraph(BINDING_TEXT, { size: 18, color: "646460", spacingAfter: 300 }),
    ...signatureParagraphs(300),
    ...docxLetterFooter(),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAngebotsvorlage() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
