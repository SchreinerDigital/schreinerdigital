// anzahlungsrechnung.mjs — ANZAHLUNGSRECHNUNG (PDF + Word)
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
  sectionLabel,
  drawFieldsRow,
  drawTable,
  tableHeight,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxTotalsBlock,
  docxLetterFooter,
  docxSectionLabel,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "Anzahlungsrechnung";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 30, 30];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 18, 18];

const INFO_FIELDS = [
  { label: "Rechnungsdatum:", value: "[Datum]" },
  { label: "Rechnungsnummer:", value: "[Nummer]" },
];

const AUFTRAGSWERT_ROWS = [
  { label: "Nettobetrag (Auftragswert)" },
  { label: "zzgl. 19 % USt." },
  { label: "Bruttobetrag (Auftragswert)", bold: true, shaded: true },
];

const ANZAHLUNG_ROWS = [
  { label: "Anzahlungsbetrag netto" },
  { label: "zzgl. 19 % USt." },
  { label: "Anzahlungsbetrag gesamt", bold: true, shaded: true },
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
    "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir berechnen Ihnen folgende vereinbarte Leistungen:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: 3 }) + totalsBlockHeight(AUFTRAGSWERT_ROWS.length));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: 3,
    fontSize: 7.5,
  });
  y = drawTotalsBlock(doc, y, AUFTRAGSWERT_ROWS);
  y += 6;

  y = ensureLetterRoom(doc, y, 18);
  sectionLabel(doc, PAGE.marginLeft, y, "ANZAHLUNG");
  y += 5;
  drawFieldsRow(doc, y, [{ label: "Anzahlung in % des Auftragswerts:", x: 20, endX: 190 }]);
  y += 7;

  y = ensureLetterRoom(doc, y, totalsBlockHeight(ANZAHLUNG_ROWS.length));
  y = drawTotalsBlock(doc, y, ANZAHLUNG_ROWS);
  y += 6;

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(
    doc,
    "Bitte überweisen Sie den Anzahlungsbetrag innerhalb von [Zahlungsziel, z. B. 7 Tage] auf das unten genannte Konto. Nach Zahlungseingang beginnen wir mit der vereinbarten Leistung.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 6;

  y = ensureLetterRoom(doc, y, 12);
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
      "Sehr geehrte Damen und Herren, besten Dank für Ihre Auftragserteilung. Wir berechnen Ihnen folgende vereinbarte Leistungen:",
    ),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: 3,
    }),
    docxTotalsBlock(AUFTRAGSWERT_ROWS),
    docxSpacer(200),
    docxSectionLabel("ANZAHLUNG"),
    ...docxFieldsBlock([[{ label: "Anzahlung in % des Auftragswerts:", labelPct: 40, valuePct: 60 }]]),
    docxTotalsBlock(ANZAHLUNG_ROWS),
    docxSpacer(300),
    docxParagraph(
      "Bitte überweisen Sie den Anzahlungsbetrag innerhalb von [Zahlungsziel, z. B. 7 Tage] auf das unten genannte Konto. Nach Zahlungseingang beginnen wir mit der vereinbarten Leistung.",
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

export async function generateAnzahlungsrechnung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
