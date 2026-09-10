// auftragsbestaetigung.mjs — AUFTRAGSBESTÄTIGUNG (PDF + Word)

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

const TITLE = "AUFTRAGSBESTÄTIGUNG";
const SUBTITLE = "Auftragserteilung des Kunden schriftlich bestätigen – der Vertrag kommt damit verbindlich zustande";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// The three totals lines are drawn as plain field rows (not a table row),
// matching rechnungsvorlage.mjs's summary-line pattern.
function drawSummaryLines(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Nettobetrag:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. USt. (19 %):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Bruttobetrag:", x: 20, endX: 190 }]);
  return y;
}

function summaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Nettobetrag:", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. USt. (19 %):", labelPct: 35, valuePct: 65 }],
    [{ label: "Bruttobetrag:", labelPct: 35, valuePct: 65 }],
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
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Auftragsnummer:", x: 20, endX: 100 },
    { label: "Datum:", x: 104, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 14, header);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir bestätigen Ihren Auftrag hiermit wie folgt:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureRoom(doc, y, tableHeight({ rowCount: 6 }), header);
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 6,
    fontSize: 7.5,
  });
  y += 8;

  y = ensureRoom(doc, y, 24, header);
  y = drawSummaryLines(doc, y);
  y += 12;

  y = ensureRoom(doc, y, 20, header);
  y = drawParagraph(
    doc,
    "Für Rückfragen oder weitere Informationen stehen wir Ihnen selbstverständlich jederzeit gerne zur Verfügung.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 10;

  y = ensureRoom(doc, y, 16, header);
  y = drawSignature(doc, y);
  y += 10;

  y = ensureRoom(doc, y, 14, header);
  drawParagraph(doc, FOOTER_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 7.5, color: COLORS.muted });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Auftragsnummer:", labelPct: 18, valuePct: 32 },
        { label: "Datum:", labelPct: 10, valuePct: 40 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph(
      "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir bestätigen Ihren Auftrag hiermit wie folgt:",
    ),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 6,
    }),
    docxSpacer(200),
    ...summaryFieldsBlock(),
    docxParagraph(
      "Für Rückfragen oder weitere Informationen stehen wir Ihnen selbstverständlich jederzeit gerne zur Verfügung.",
      { spacingAfter: 300 },
    ),
    ...signatureParagraphs(300),
    docxParagraph(FOOTER_NOTE, { size: 15, color: HEX.muted, spacingAfter: 200 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAuftragsbestaetigung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
