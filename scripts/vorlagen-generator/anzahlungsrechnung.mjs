// anzahlungsrechnung.mjs — ANZAHLUNGSRECHNUNG (PDF + Word)

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
  sectionLabel,
  drawFieldsRow,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "ANZAHLUNGSRECHNUNG";
const SUBTITLE = "Abschlagsrechnung (Akontorechnung) für eine vereinbarte Anzahlung vor Projektbeginn";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// Totals for the underlying order value (Auftragswert).
function drawAuftragswertSummary(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Nettobetrag (Auftragswert):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. USt. (19 %):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Bruttobetrag (Auftragswert):", x: 20, endX: 190 }]);
  return y;
}

function auftragswertSummaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Nettobetrag (Auftragswert):", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. USt. (19 %):", labelPct: 35, valuePct: 65 }],
    [{ label: "Bruttobetrag (Auftragswert):", labelPct: 35, valuePct: 65 }],
  ]);
}

// Totals for the deposit actually due now (Anzahlung).
function drawAnzahlungSummary(doc, y) {
  drawFieldsRow(doc, y, [{ label: "Anzahlungsbetrag netto:", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "zzgl. USt. (19 %):", x: 20, endX: 190 }]);
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Anzahlungsbetrag gesamt:", x: 20, endX: 190 }]);
  return y;
}

function anzahlungSummaryFieldsBlock() {
  return docxFieldsBlock([
    [{ label: "Anzahlungsbetrag netto:", labelPct: 35, valuePct: 65 }],
    [{ label: "zzgl. USt. (19 %):", labelPct: 35, valuePct: 65 }],
    [{ label: "Anzahlungsbetrag gesamt:", labelPct: 35, valuePct: 65 }],
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
    { label: "Rechnungsnummer:", x: 20, endX: 100 },
    { label: "Rechnungsdatum:", x: 104, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 14, header);
  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir berechnen Ihnen folgende vereinbarte Leistungen:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureRoom(doc, y, tableHeight({ rowCount: 5 }), header);
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 5,
    fontSize: 7.5,
  });
  y += 8;

  y = ensureRoom(doc, y, 24, header);
  y = drawAuftragswertSummary(doc, y);
  y += 10;

  y = ensureRoom(doc, y, 20, header);
  sectionLabel(doc, PAGE.marginLeft, y, "ANZAHLUNG");
  y += 6;
  drawFieldsRow(doc, y, [{ label: "Anzahlung in % des Auftragswerts:", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, 24, header);
  y = drawAnzahlungSummary(doc, y);
  y += 12;

  y = ensureRoom(doc, y, 20, header);
  y = drawParagraph(
    doc,
    "Bitte überweisen Sie den Anzahlungsbetrag innerhalb von [Zahlungsziel, z. B. 7 Tage] auf das unten genannte Konto. Nach Zahlungseingang beginnen wir mit der vereinbarten Leistung.",
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
        { label: "Rechnungsnummer:", labelPct: 16, valuePct: 34 },
        { label: "Rechnungsdatum:", labelPct: 16, valuePct: 34 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph(
      "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir berechnen Ihnen folgende vereinbarte Leistungen:",
    ),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 5,
    }),
    docxSpacer(200),
    ...auftragswertSummaryFieldsBlock(),
    docxSectionLabel("ANZAHLUNG"),
    ...docxFieldsBlock([[{ label: "Anzahlung in % des Auftragswerts:", labelPct: 40, valuePct: 60 }]]),
    ...anzahlungSummaryFieldsBlock(),
    docxParagraph(
      "Bitte überweisen Sie den Anzahlungsbetrag innerhalb von [Zahlungsziel, z. B. 7 Tage] auf das unten genannte Konto. Nach Zahlungseingang beginnen wir mit der vereinbarten Leistung.",
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

export async function generateAnzahlungsrechnung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
