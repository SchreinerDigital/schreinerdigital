// aufmassblatt.mjs — AUFMASSBLATT (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawCheckboxLabel,
  drawRuledArea,
  ruledAreaHeight,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxRuledLines,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "AUFMASSBLATT";
const SUBTITLE = "Maße und Rahmenbedingungen beim Kundentermin strukturiert festhalten";

const HEADERS = ["Pos.", "Bezeichnung", "Breite (mm)", "Höhe (mm)", "Tiefe (mm)", "Bemerkung"];
const ROW_COUNT = 10;

const RAHMENBEDINGUNGEN_ITEMS = [
  "Wand tragend",
  "Installationen vorhanden (Strom/Wasser)",
  "Bodenbelag wird noch verlegt",
  "Zugang/Transportweg beengt",
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Kunde:", x: 20, endX: 74 },
    { label: "Projekt / Kom.-Nr.:", x: 78, endX: 132 },
    { label: "Datum:", x: 136, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Aufgenommen von:", x: 20, endX: 104 },
    { label: "Ort / Raum:", x: 108, endX: 190 },
  ]);
  y += 12;

  // Maße
  const colWidths = [12, 40, 26, 26, 26, 40];
  const tableNeeded = 6 + tableHeight({ rowCount: ROW_COUNT });
  y = ensureRoom(doc, y, tableNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MASSE");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount: ROW_COUNT,
    fontSize: 8,
  });
  y += 8;

  // Rahmenbedingungen
  const checkboxNeeded = 6 + RAHMENBEDINGUNGEN_ITEMS.length * 6;
  y = ensureRoom(doc, y, checkboxNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "RAHMENBEDINGUNGEN");
  y += 6;
  RAHMENBEDINGUNGEN_ITEMS.forEach((item) => {
    drawCheckboxLabel(doc, PAGE.marginLeft, y, item);
    y += 6;
  });
  y += 3;

  // Skizze / Notizen
  const notesNeeded = 6 + ruledAreaHeight(10, 6);
  y = ensureRoom(doc, y, notesNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "SKIZZE / NOTIZEN");
  y += 5;
  drawRuledArea(doc, { y, lines: 10, gap: 6 });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Kunde:", labelPct: 12, valuePct: 21 },
        { label: "Projekt / Kom.-Nr.:", labelPct: 12, valuePct: 21 },
        { label: "Datum:", labelPct: 12, valuePct: 22 },
      ],
      [
        { label: "Aufgenommen von:", labelPct: 18, valuePct: 32 },
        { label: "Ort / Raum:", labelPct: 18, valuePct: 32 },
      ],
    ]),
    docxSectionLabel("Maße"),
    docxDataTable({
      headers: HEADERS,
      colPcts: [7, 24, 15, 15, 15, 24],
      rowCount: ROW_COUNT,
    }),
    docxSpacer(200),
    docxSectionLabel("Rahmenbedingungen"),
    ...RAHMENBEDINGUNGEN_ITEMS.map((item) => docxCheckboxLine([item])),
    docxSpacer(150),
    docxSectionLabel("Skizze / Notizen"),
    ...docxRuledLines(10),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAufmassblatt() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
