// gespraechsnotiz.mjs — Template 4: Gesprächsnotiz (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawRuledArea,
  ruledAreaHeight,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxRuledLines,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "GESPRÄCHSNOTIZ";
const SUBTITLE = "Kundengespräche strukturiert festhalten";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Datum:", x: 20, endX: 100 },
    { label: "Uhrzeit:", x: 104, endX: 190 },
  ]);
  y += 12;

  const gesprPartnerHeight = 6 + ruledAreaHeight(4, 7);
  y = ensureRoom(doc, y, gesprPartnerHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "GESPRÄCHSPARTNER");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 4, gap: 7 });
  y += 6;

  drawFieldsRow(doc, y, [{ label: "Thema:", x: 20, endX: 190 }]);
  y += 12;

  const notesHeight = 6 + ruledAreaHeight(10, 6);
  y = ensureRoom(doc, y, notesHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "NOTIZEN");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 10, gap: 6 });
  y += 8;

  const stepsCols = [80, 50, 40];
  const stepsHeight = 6 + tableHeight({ rowCount: 4 });
  y = ensureRoom(doc, y, stepsHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "VEREINBARUNGEN / NÄCHSTE SCHRITTE");
  y += 5;
  drawTable(doc, {
    y,
    colWidths: stepsCols,
    headers: ["Aufgabe", "Zuständig", "Bis wann"],
    rowCount: 4,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Datum:", labelPct: 14, valuePct: 36 },
        { label: "Uhrzeit:", labelPct: 14, valuePct: 36 },
      ],
    ]),
    docxSectionLabel("Gesprächspartner"),
    ...docxRuledLines(4),
    docxSpacer(150),
    ...docxFieldsBlock([[{ label: "Thema:", labelPct: 15, valuePct: 85 }]]),
    docxSectionLabel("Notizen"),
    ...docxRuledLines(10),
    docxSpacer(150),
    docxSectionLabel("Vereinbarungen / nächste Schritte"),
    docxDataTable({
      headers: ["Aufgabe", "Zuständig", "Bis wann"],
      colPcts: [45, 30, 25],
      rowCount: 4,
    }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateGespraechsnotiz() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
