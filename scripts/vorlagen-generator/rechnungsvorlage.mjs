// rechnungsvorlage.mjs — RECHNUNG (PDF + Word)
//
// Customer-facing invoice with the elements required under § 14 UStG
// (fortlaufende Rechnungsnummer, Leistungsdatum, Steuersatz/-betrag) plus an
// explicit Verzugsfolgen-Hinweis, which German law requires stating on the
// invoice itself for automatic default against consumers after 30 days
// (§ 286 Abs. 3 BGB) without a further reminder being necessary. The credit
// note / cancellation-invoice variants live in their own standalone files
// (gutschrift.mjs, storno-rechnung.mjs). Original wording throughout; every
// company/person/address/amount reference is a literal bracketed
// placeholder — nothing here is real business data.

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

const TITLE = "RECHNUNG";
const SUBTITLE = "Rechnung für erbrachte Leistungen – mit den Pflichtangaben nach § 14 UStG";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// The three totals lines are identical (only the numbers filled in by hand
// differ) between the invoice and the credit note, so both PDF and Word
// build them from one shared helper.
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
    { label: "Rechnungsnummer:", x: 20, endX: 74 },
    { label: "Rechnungsdatum:", x: 78, endX: 132 },
    { label: "Leistungsdatum:", x: 136, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 14, header1);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, vereinbarungsgemäß berechnen wir Ihnen folgende Leistungen:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureRoom(doc, y, tableHeight({ rowCount: 6 }), header1);
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 6,
    fontSize: 7.5,
  });
  y += 8;

  y = ensureRoom(doc, y, 24, header1);
  y = drawSummaryLines(doc, y);
  y += 12;

  y = ensureRoom(doc, y, 26, header1);
  y = drawParagraph(
    doc,
    "Bitte überweisen Sie den Rechnungsbetrag innerhalb von [Zahlungsziel, z. B. 14 Tage] auf das unten genannte Konto. Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen gemäß § 288 BGB zu berechnen. Für Rückfragen stehen wir gerne zur Verfügung.",
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
        { label: "Rechnungsnummer:", labelPct: 12, valuePct: 21 },
        { label: "Rechnungsdatum:", labelPct: 12, valuePct: 21 },
        { label: "Leistungsdatum:", labelPct: 12, valuePct: 22 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph("Sehr geehrte Damen und Herren, vereinbarungsgemäß berechnen wir Ihnen folgende Leistungen:"),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 6,
    }),
    docxSpacer(200),
    ...summaryFieldsBlock(),
    docxParagraph(
      "Bitte überweisen Sie den Rechnungsbetrag innerhalb von [Zahlungsziel, z. B. 14 Tage] auf das unten genannte Konto. Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen gemäß § 288 BGB zu berechnen. Für Rückfragen stehen wir gerne zur Verfügung.",
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

export async function generateRechnungsvorlage() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
