// storno-rechnung.mjs — STORNORECHNUNG (PDF + Word)
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
  smallNote,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxTotalsBlock,
  docxLetterFooter,
  docxParagraph,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "Stornorechnung";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const INFO_FIELDS = [
  { label: "Stornorechnung-Nr.:", value: "[Nummer]" },
  { label: "Datum:", value: "[Datum]" },
  { label: "Bezug:", value: "Rechnung Nr. [Nummer] vom [Datum]" },
];

const SMALL_NOTE_TEXT =
  '(Positionen und Beträge entsprechen der stornierten Rechnung, ausgewiesen als Abzug, z. B. „./. 250,00 €".)';

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
  drawLetterHeader(doc, { branded: true });
  const addressEndY = drawAddressBlock(doc);
  const infoEndY = drawInfoBox(doc, INFO_FIELDS);
  let y = Math.max(addressEndY, infoEndY) + 10;

  y = drawSubjectLine(doc, y, TITLE);

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, hiermit stornieren wir unsere Rechnung Nr. [Nummer] vom [Datum] vollständig. Die genannte Rechnung ist damit ungültig:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: 4 }) + 10 + totalsBlockHeight(TOTALS_ROWS.length));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 4,
    fontSize: 7.5,
  });
  y += 4;

  smallNote(doc, PAGE.marginLeft, y, SMALL_NOTE_TEXT);
  y += 6;

  y = drawTotalsBlock(doc, y, TOTALS_ROWS);
  y += 12;

  y = ensureLetterRoom(doc, y, 20);
  y = drawParagraph(
    doc,
    "Eine korrigierte Rechnung erhalten Sie ggf. separat. Ein bereits gezahlter Betrag wird Ihnen in den nächsten Tagen auf Ihr Konto zurücküberwiesen.",
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
    docxParagraph(
      "Sehr geehrte Damen und Herren, hiermit stornieren wir unsere Rechnung Nr. [Nummer] vom [Datum] vollständig. Die genannte Rechnung ist damit ungültig:",
    ),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 4,
    }),
    docxSpacer(150),
    docxParagraph(SMALL_NOTE_TEXT, { italics: true, size: 15, color: HEX.muted, spacingAfter: 200 }),
    docxTotalsBlock(TOTALS_ROWS),
    docxSpacer(300),
    docxParagraph(
      "Eine korrigierte Rechnung erhalten Sie ggf. separat. Ein bereits gezahlter Betrag wird Ihnen in den nächsten Tagen auf Ihr Konto zurücküberwiesen.",
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

export async function generateStornoRechnung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
