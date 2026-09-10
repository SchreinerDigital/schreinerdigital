// retourenschein.mjs — RÜCKSENDUNG / RETOURENSCHEIN (PDF + Word)

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
  drawFieldsRow,
  drawTable,
  tableHeight,
  docxHeader,
  docxParagraph,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "RÜCKSENDUNG / RETOURENSCHEIN";
const SUBTITLE = "Rücksendung nicht benötigter Ware gegenüber dem Kunden nachvollziehbar begleiten";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Bestellnummer / Auftragsnummer:", x: 20, endX: 92 },
    { label: "Kundennummer:", x: 96, endX: 143 },
    { label: "Datum:", x: 147, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = drawParagraph(
    doc,
    "Sehr geehrte Damen und Herren, hiermit erhalten Sie wie vereinbart die Rücksendung der nicht benötigten Teile:",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 8;

  const itemsCols = [10, 20, 70, 70];
  y = ensureRoom(doc, y, tableHeight({ rowCount: 6 }), header);
  y = drawTable(doc, {
    y,
    colWidths: itemsCols,
    headers: ["Pos.", "Menge", "Bezeichnung", "Grund der Rücksendung"],
    rowCount: 6,
    fontSize: 8,
  });
  y += 8;

  y = drawParagraph(
    doc,
    "Bei Rückfragen zur Rücksendung stehen wir Ihnen gerne zur Verfügung.",
    PAGE.marginLeft,
    y,
    PAGE.contentWidth,
    { fontSize: 9 },
  );
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, "Mit freundlichen Grüßen", PAGE.marginLeft, y);
  y += 6;
  pdfText(doc, "[Ihr Name]", PAGE.marginLeft, y);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Bestellnummer / Auftragsnummer:", labelPct: 26, valuePct: 14 },
        { label: "Kundennummer:", labelPct: 14, valuePct: 16 },
        { label: "Datum:", labelPct: 8, valuePct: 22 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    docxParagraph("Sehr geehrte Damen und Herren, hiermit erhalten Sie wie vereinbart die Rücksendung der nicht benötigten Teile:"),
    docxDataTable({
      headers: ["Pos.", "Menge", "Bezeichnung", "Grund der Rücksendung"],
      colPcts: [6, 12, 41, 41],
      rowCount: 6,
    }),
    docxSpacer(200),
    docxParagraph("Bei Rückfragen zur Rücksendung stehen wir Ihnen gerne zur Verfügung.", { spacingAfter: 300 }),
    docxParagraph("Mit freundlichen Grüßen", { spacingAfter: 20 }),
    docxParagraph("[Ihr Name]", { spacingAfter: 0 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateRetourenschein() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
