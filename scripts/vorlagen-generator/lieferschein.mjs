// lieferschein.mjs — LIEFERSCHEIN (PDF + Word)
//
// Laid out as a real DIN-5008-style business letter, matching the exact
// structure of the user's own Drive originals (verified against a PDF
// export of Rechnungsvorlage.docx, same document family) — just restyled
// in schreiner.digital's design (accent-colored rules, house font).

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawLetterHeader,
  drawAddressBlock,
  drawInfoBox,
  drawSubjectLine,
  ensureLetterRoom,
  finalizeLetterPdf,
  drawFieldsRow,
  drawParagraph,
  drawTable,
  tableHeight,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxLetterFooter,
  docxFieldsBlock,
  docxParagraph,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "Lieferschein";

const INTRO_TEXT =
  "Sehr geehrte Damen und Herren, vielen Dank für die Zusammenarbeit. Wir liefern Ihnen wie vereinbart folgende Positionen:";
const CLOSING_TEXT = "Bitte prüfen Sie die Lieferung auf Vollständigkeit und Unversehrtheit.";

const ITEM_TABLE_HEADERS = ["Pos.", "Menge", "Einheit", "Bezeichnung", "Bemerkung"];
const ITEM_TABLE_PDF_COLS = [10, 16, 16, 68, 60];
const ITEM_TABLE_DOCX_COLS = [6, 9, 9, 40, 36];
const ITEM_ROW_COUNT = 8;

const INFO_FIELDS = [
  { label: "Lieferschein-Nr.:", value: "[Nummer]" },
  { label: "Datum:", value: "[Datum]" },
  { label: "Auftrags-/Projektnummer:", value: "[Nummer]" },
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  drawLetterHeader(doc);
  const addressEndY = drawAddressBlock(doc);
  const infoEndY = drawInfoBox(doc, INFO_FIELDS);
  let y = Math.max(addressEndY, infoEndY) + 10;

  y = drawSubjectLine(doc, y, TITLE);

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  y = ensureLetterRoom(doc, y, tableHeight({ rowCount: ITEM_ROW_COUNT }));
  y = drawTable(doc, {
    y,
    colWidths: ITEM_TABLE_PDF_COLS,
    headers: ITEM_TABLE_HEADERS,
    rowCount: ITEM_ROW_COUNT,
    fontSize: 8,
  });
  y += 8;

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(doc, CLOSING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 10;

  y = ensureLetterRoom(doc, y, 12);
  drawFieldsRow(doc, y, [
    { label: "Ort, Datum:", x: 20, endX: 64 },
    { label: "Unterschrift (Ware ordnungsgemäß erhalten):", x: 68, endX: 190 },
  ]);

  finalizeLetterPdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxLetterHeader(),
    ...docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSpacer(200),
    docxSubjectLine(TITLE),
    docxParagraph(INTRO_TEXT),
    docxDataTable({
      headers: ITEM_TABLE_HEADERS,
      colPcts: ITEM_TABLE_DOCX_COLS,
      rowCount: ITEM_ROW_COUNT,
    }),
    docxSpacer(200),
    docxParagraph(CLOSING_TEXT, { spacingAfter: 300 }),
    ...docxFieldsBlock([
      [
        { label: "Ort, Datum:", labelPct: 14, valuePct: 20 },
        { label: "Unterschrift (Ware ordnungsgemäß erhalten):", labelPct: 30, valuePct: 36 },
      ],
    ]),
    ...docxLetterFooter(),
  ];

  const document = new Document({ sections: [{ children }] });
  return Packer.toBuffer(document);
}

export async function generateLieferschein() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
