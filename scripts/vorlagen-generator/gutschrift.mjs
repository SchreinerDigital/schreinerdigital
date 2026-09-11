// gutschrift.mjs — GUTSCHRIFT (PDF + Word)

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
  docxHeader,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "GUTSCHRIFT";
const SUBTITLE =
  "Teilweise oder vollständige Gutschrift zu einer bereits gestellten Rechnung – z. B. bei Reklamation oder Rücksendung";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// This kaufmännische/umsatzsteuerliche Gutschrift disambiguation runs well
// past one line, so it is drawn with drawParagraph (wrapped) rather than the
// single-line smallNote helper — using the same italic/7.5pt/muted styling
// smallNote applies.
const HINT_NOTE =
  'Hinweis: Diese Gutschrift ist eine kaufmännische Gutschrift (Preisnachlass/Korrektur). Sie ist nicht zu verwechseln mit der umsatzsteuerlichen „Gutschrift" nach § 14 Abs. 2 Satz 2 UStG, bei der der Leistungsempfänger selbst abrechnet.';

// Same shape as the invoice's totals lines (only the last label differs) —
// kept as a local, unexported helper so this file stands on its own rather
// than importing from rechnungsvorlage.mjs.
function drawSummaryLines(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Nettobetrag:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. USt. (19 %):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Gutschriftsbetrag:", x: 20, endX: 190 }]);
  return y;
}

function summaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Nettobetrag:", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. USt. (19 %):", labelPct: 35, valuePct: 65 }],
    [{ label: "Gutschriftsbetrag:", labelPct: 35, valuePct: 65 }],
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
    { label: "Gutschrift-Nr.:", x: 20, endX: 72 },
    { label: "Datum:", x: 76, endX: 110 },
    { label: "Bezug: Rechnung Nr. [Nummer] vom [Datum]", x: 114, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 14, header1);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, gemäß unserer Vereinbarung schreiben wir Ihnen folgende Leistungen gut:",
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
  y += 8;

  y = ensureRoom(doc, y, 24, header1);
  y = drawSummaryLines(doc, y);
  y += 12;

  y = ensureRoom(doc, y, 20, header1);
  y = drawParagraph(
    doc,
    "Wir überweisen Ihnen den Gutschriftsbetrag innerhalb der nächsten Tage auf Ihr Konto. Für Rückfragen stehen wir Ihnen gerne zur Verfügung.",
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
  y = drawParagraph(doc, FOOTER_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 7.5, color: COLORS.muted });
  y += 6;

  y = ensureRoom(doc, y, 14, header1);
  drawParagraph(doc, HINT_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, {
    fontSize: 7.5,
    lineHeight: 3.6,
    color: COLORS.muted,
    font: "italic",
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Gutschrift-Nr.:", labelPct: 14, valuePct: 16 },
        { label: "Datum:", labelPct: 8, valuePct: 12 },
        { label: "Bezug: Rechnung Nr. [Nummer] vom [Datum]", labelPct: 28, valuePct: 22 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph("Sehr geehrte Damen und Herren, gemäß unserer Vereinbarung schreiben wir Ihnen folgende Leistungen gut:"),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 4,
    }),
    docxSpacer(200),
    ...summaryFieldsBlock(),
    docxParagraph(
      "Wir überweisen Ihnen den Gutschriftsbetrag innerhalb der nächsten Tage auf Ihr Konto. Für Rückfragen stehen wir Ihnen gerne zur Verfügung.",
      { spacingAfter: 300 },
    ),
    ...signatureParagraphs(300),
    docxParagraph(FOOTER_NOTE, { size: 15, color: HEX.muted, spacingAfter: 200 }),
    docxParagraph(HINT_NOTE, { italics: true, size: 15, color: HEX.muted, spacingAfter: 0 }),
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
