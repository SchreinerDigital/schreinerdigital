// gutschrift.mjs — GUTSCHRIFT (PDF + Word)
//
// Laid out as a real DIN-5008-style business letter, matching the exact
// structure of the user's own Drive originals (verified against a PDF
// export of Rechnungsvorlage.docx, same document family) — just restyled
// in schreiner.digital's design (accent-colored rules, house font).

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  HEX,
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

const TITLE = "Gutschrift";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const INFO_FIELDS = [
  { label: "Gutschrift-Nr.:", value: "[Nummer]" },
  { label: "Datum:", value: "[Datum]" },
  { label: "Bezug:", value: "Rechnung Nr. [Nummer] vom [Datum]" },
];

// This kaufmännische/umsatzsteuerliche Gutschrift disambiguation runs well
// past one line, so it is drawn with drawParagraph (wrapped) rather than a
// single-line note.
const HINT_NOTE =
  'Hinweis: Diese Gutschrift ist eine kaufmännische Gutschrift (Preisnachlass/Korrektur). Sie ist nicht zu verwechseln mit der umsatzsteuerlichen „Gutschrift" nach § 14 Abs. 2 Satz 2 UStG, bei der der Leistungsempfänger selbst abrechnet.';

const TOTALS_ROWS = [
  { label: "Nettobetrag" },
  { label: "zzgl. 19 % USt." },
  { label: "Gutschriftsbetrag", bold: true, shaded: true },
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
    "Sehr geehrte Damen und Herren, gemäß unserer Vereinbarung schreiben wir Ihnen folgende Leistungen gut:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: 4 }) + totalsBlockHeight(TOTALS_ROWS.length));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 4,
    fontSize: 7.5,
  });
  y = drawTotalsBlock(doc, y, TOTALS_ROWS);
  y += 10;

  y = ensureLetterRoom(doc, y, 20);
  y = drawParagraph(
    doc,
    "Wir überweisen Ihnen den Gutschriftsbetrag innerhalb der nächsten Tage auf Ihr Konto. Für Rückfragen stehen wir Ihnen gerne zur Verfügung.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 10;

  y = ensureLetterRoom(doc, y, 16);
  y = drawSignature(doc, y);
  y += 10;

  y = ensureLetterRoom(doc, y, 10);
  drawParagraph(doc, HINT_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, {
    fontSize: 7,
    lineHeight: 3.3,
    color: COLORS.muted,
    font: "italic",
  });

  finalizeLetterPdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxLetterHeader(),
    ...docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSpacer(200),
    docxSubjectLine(TITLE),
    docxParagraph("Sehr geehrte Damen und Herren, gemäß unserer Vereinbarung schreiben wir Ihnen folgende Leistungen gut:"),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 4,
    }),
    docxTotalsBlock(TOTALS_ROWS),
    docxSpacer(300),
    docxParagraph(
      "Wir überweisen Ihnen den Gutschriftsbetrag innerhalb der nächsten Tage auf Ihr Konto. Für Rückfragen stehen wir Ihnen gerne zur Verfügung.",
      { spacingAfter: 300 },
    ),
    ...signatureParagraphs(300),
    ...docxLetterFooter(),
    docxParagraph(HINT_NOTE, { italics: true, size: 14, color: HEX.muted, spacingAfter: 0 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateGutschrift() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
