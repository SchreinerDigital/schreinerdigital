// lieferschein.mjs — LIEFERSCHEIN (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  drawFieldsRow,
  drawParagraph,
  drawTable,
  tableHeight,
  docxHeader,
  docxFieldsBlock,
  docxParagraph,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "LIEFERSCHEIN";
const SUBTITLE = "Gelieferte Ware nachvollziehbar dokumentieren – mit Empfangsbestätigung";

const INTRO_TEXT =
  "Sehr geehrte Damen und Herren, vielen Dank für die Zusammenarbeit. Wir liefern Ihnen wie vereinbart folgende Positionen:";
const CLOSING_TEXT = "Bitte prüfen Sie die Lieferung auf Vollständigkeit und Unversehrtheit.";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Lieferschein-Nr.:", x: 20, endX: 70 },
    { label: "Datum:", x: 74, endX: 104 },
    { label: "Auftrags-/Projektnummer:", x: 108, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Empfänger (Name):", x: 20, endX: 84 },
    { label: "Lieferadresse:", x: 88, endX: 190 },
  ]);
  y += 12;

  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth);
  y += 6;

  const colWidths = [10, 16, 16, 68, 60];
  const rowCount = 8;
  const neededHeight = tableHeight({ rowCount });
  y = ensureRoom(doc, y, neededHeight, header);
  y = drawTable(doc, {
    y,
    colWidths,
    headers: ["Pos.", "Menge", "Einheit", "Bezeichnung", "Bemerkung"],
    rowCount,
    fontSize: 8,
  });
  y += 8;

  y = drawParagraph(doc, CLOSING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth);
  y += 10;

  y = ensureRoom(doc, y, 12, header);
  drawFieldsRow(doc, y, [
    { label: "Ort, Datum:", x: 20, endX: 64 },
    { label: "Unterschrift (Ware ordnungsgemäß erhalten):", x: 68, endX: 190 },
  ]);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Lieferschein-Nr.:", labelPct: 16, valuePct: 14 },
        { label: "Datum:", labelPct: 8, valuePct: 12 },
        { label: "Auftrags-/Projektnummer:", labelPct: 22, valuePct: 28 },
      ],
      [
        { label: "Empfänger (Name):", labelPct: 16, valuePct: 24 },
        { label: "Lieferadresse:", labelPct: 14, valuePct: 46 },
      ],
    ]),
    docxParagraph(INTRO_TEXT),
    docxDataTable({
      headers: ["Pos.", "Menge", "Einheit", "Bezeichnung", "Bemerkung"],
      colPcts: [6, 9, 9, 40, 36],
      rowCount: 8,
    }),
    docxSpacer(200),
    docxParagraph(CLOSING_TEXT),
    ...docxFieldsBlock([
      [
        { label: "Ort, Datum:", labelPct: 14, valuePct: 20 },
        { label: "Unterschrift (Ware ordnungsgemäß erhalten):", labelPct: 30, valuePct: 36 },
      ],
    ]),
  ];

  const document = new Document({ sections: [{ children }] });
  return Packer.toBuffer(document);
}

export async function generateLieferschein() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
