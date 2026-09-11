// storno-rechnung.mjs — STORNORECHNUNG (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  HEX,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  pdfText,
  drawParagraph,
  drawFieldsRow,
  drawTable,
  tableHeight,
  smallNote,
  docxHeader,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "STORNORECHNUNG";
const SUBTITLE = "Vollständige Stornierung einer fehlerhaft ausgestellten Rechnung";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const SMALL_NOTE_TEXT =
  '(Positionen und Beträge entsprechen der stornierten Rechnung, ausgewiesen als Abzug, z. B. „./. 250,00 €".)';

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// Same shape as the invoice's totals lines (only the numbers filled in by
// hand differ) — kept as a local, unexported helper so this file stands on
// its own rather than importing from rechnungsvorlage.mjs.
function drawSummaryLines(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Nettobetrag:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. USt. (19 %):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Rechnungsbetrag:", x: 20, endX: 190 }]);
  return y;
}

function summaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Nettobetrag:", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. USt. (19 %):", labelPct: 35, valuePct: 65 }],
    [{ label: "Rechnungsbetrag:", labelPct: 35, valuePct: 65 }],
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
  const header1 = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header1);

  drawFieldsRow(doc, y, [
    { label: "Stornorechnung-Nr.:", x: 20, endX: 72 },
    { label: "Datum:", x: 76, endX: 110 },
    { label: "Bezug: Rechnung Nr. [Nummer] vom [Datum]", x: 114, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 14, header1);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, hiermit stornieren wir unsere Rechnung Nr. [Nummer] vom [Datum] vollständig. Die genannte Rechnung ist damit ungültig:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureRoom(doc, y, tableHeight({ rowCount: 4 }), header1);
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 4,
    fontSize: 7.5,
  });
  y += 4;

  y = ensureRoom(doc, y, 10, header1);
  smallNote(doc, PAGE.marginLeft, y, SMALL_NOTE_TEXT);
  y += 9;

  y = ensureRoom(doc, y, 24, header1);
  y = drawSummaryLines(doc, y);
  y += 12;

  y = ensureRoom(doc, y, 20, header1);
  y = drawParagraph(
    doc,
    "Eine korrigierte Rechnung erhalten Sie ggf. separat. Ein bereits gezahlter Betrag wird Ihnen in den nächsten Tagen auf Ihr Konto zurücküberwiesen.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 10;

  y = ensureRoom(doc, y, 16, header1);
  y = drawSignature(doc, y);
  y += 10;

  y = ensureRoom(doc, y, 14, header1);
  drawParagraph(doc, FOOTER_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 7.5, color: COLORS.muted });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Stornorechnung-Nr.:", labelPct: 14, valuePct: 16 },
        { label: "Datum:", labelPct: 8, valuePct: 12 },
        { label: "Bezug: Rechnung Nr. [Nummer] vom [Datum]", labelPct: 28, valuePct: 22 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph(
      "Sehr geehrte Damen und Herren, hiermit stornieren wir unsere Rechnung Nr. [Nummer] vom [Datum] vollständig. Die genannte Rechnung ist damit ungültig:",
    ),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 4,
    }),
    docxSpacer(200),
    docxParagraph(SMALL_NOTE_TEXT, { italics: true, size: 15, color: HEX.muted, spacingAfter: 200 }),
    ...summaryFieldsBlock(),
    docxParagraph(
      "Eine korrigierte Rechnung erhalten Sie ggf. separat. Ein bereits gezahlter Betrag wird Ihnen in den nächsten Tagen auf Ihr Konto zurücküberwiesen.",
      { spacingAfter: 300 },
    ),
    ...signatureParagraphs(300),
    docxParagraph(FOOTER_NOTE, { size: 15, color: HEX.muted, spacingAfter: 0 }),
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
