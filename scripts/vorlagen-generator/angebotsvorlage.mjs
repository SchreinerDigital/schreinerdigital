// angebotsvorlage.mjs — Template 3: Angebotsvorlage (PDF + Word)
//
// Customer-facing quote document. Original wording (not derived from any
// third-party template). Every company/person/address reference is a
// literal bracketed placeholder — nothing here is real business data.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  pdfText,
  drawParagraph,
  drawField,
  drawTable,
  tableHeight,
  docxWordmarkParagraph,
  docxSubtitleParagraph,
  docxParagraph,
  docxSpacer,
  docxFieldsRow,
  docxDataTable,
  docxRightLabelsTable,
} from "./branding.mjs";

const SUBTITLE = "Vorlage für ein rechtssicheres Angebot";

const ABSENDER_LINES = ["[Ihre Firma GmbH]", "[Straße, Hausnummer]", "[PLZ, Ort]", "[Telefon] · [E-Mail]"];
const EMPFAENGER_LINES = ["[Name des Kunden]", "[Straße, Hausnummer]", "[PLZ, Ort]"];
const INTRO_TEXT =
  "Sehr geehrte(r) [Anrede Kunde], vielen Dank für Ihre Anfrage. Wir unterbreiten Ihnen hiermit folgendes Angebot:";
const BINDING_TEXT =
  "Dieses Angebot ist verbindlich und gilt bis zum ______ . Nach § 145 BGB sind wir an dieses Angebot gebunden, sobald Sie es annehmen. Möchten Sie sich unverbindlich nachverhandeln vorbehalten, kennzeichnen Sie das Angebot ausdrücklich als freibleibend.";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: null, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  ABSENDER_LINES.forEach((line, i) => pdfText(doc, line, PAGE.marginLeft, y + i * 4.2));
  y += ABSENDER_LINES.length * 4.2 + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  EMPFAENGER_LINES.forEach((line, i) => pdfText(doc, line, PAGE.marginLeft, y + i * 4.2));
  y += EMPFAENGER_LINES.length * 4.2 + 10;

  drawField(doc, { x: 20, y, label: "Datum:", endX: 80 });
  drawField(doc, { x: 90, y, label: "Angebotsnummer:", endX: 190 });
  y += 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, "Angebot", PAGE.marginLeft, y);
  y += 10;

  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9.5 });
  y += 8;

  const posCols = [14, 18, 20, 70, 24, 24];
  const posHeight = tableHeight({ rowCount: 6 });
  y = ensureRoom(doc, y, posHeight, header);
  y = drawTable(doc, {
    y,
    colWidths: posCols,
    headers: ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"],
    rowCount: 6,
    fontSize: 7.5,
  });
  y += 8;

  y = ensureRoom(doc, y, 24, header);
  drawField(doc, { x: 90, y, label: "Nettobetrag:", endX: 190 });
  y += 6;
  drawField(doc, { x: 90, y, label: "zzgl. 19 % USt.:", endX: 190 });
  y += 6;
  drawField(doc, { x: 90, y, label: "Gesamtbetrag (brutto):", endX: 190 });
  y += 12;

  y = ensureRoom(doc, y, 20, header);
  y = drawParagraph(doc, BINDING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 8.5 });
  y += 10;

  y = ensureRoom(doc, y, 26, header);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, "Für Rückfragen stehen wir Ihnen gerne zur Verfügung.", PAGE.marginLeft, y);
  y += 12;
  pdfText(doc, "Mit freundlichen Grüßen", PAGE.marginLeft, y);
  y += 6;
  pdfText(doc, "[Ihr Name]", PAGE.marginLeft, y);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    docxWordmarkParagraph(),
    docxSubtitleParagraph(SUBTITLE),
    ...ABSENDER_LINES.map((line) => docxParagraph(line, { spacingAfter: 20 })),
    docxSpacer(200),
    ...EMPFAENGER_LINES.map((line) => docxParagraph(line, { spacingAfter: 20 })),
    docxSpacer(300),
    docxFieldsRow([
      { label: "Datum:", labelPct: 12, valuePct: 33 },
      { label: "Angebotsnummer:", labelPct: 20, valuePct: 35 },
    ]),
    docxSpacer(200),
    docxParagraph("Angebot", { bold: true, size: 40, spacingAfter: 200 }),
    docxParagraph(INTRO_TEXT, { spacingAfter: 200 }),
    docxDataTable({
      headers: ["Pos.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"],
      colPcts: [8, 12, 12, 40, 14, 14],
      rowCount: 6,
    }),
    docxSpacer(200),
    docxRightLabelsTable(["Nettobetrag:", "zzgl. 19 % USt.:", "Gesamtbetrag (brutto):"]),
    docxSpacer(200),
    docxParagraph(BINDING_TEXT, { size: 18, color: "646460", spacingAfter: 300 }),
    docxParagraph("Für Rückfragen stehen wir Ihnen gerne zur Verfügung.", { spacingAfter: 300 }),
    docxParagraph("Mit freundlichen Grüßen", { spacingAfter: 20 }),
    docxParagraph("[Ihr Name]", { spacingAfter: 0 }),
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
