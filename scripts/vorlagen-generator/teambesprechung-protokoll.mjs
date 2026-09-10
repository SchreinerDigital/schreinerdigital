// teambesprechung-protokoll.mjs — Template 11: Teambesprechung-Protokoll (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "TEAMBESPRECHUNG";
const SUBTITLE = "Ergebnisse und Aufgaben aus der Teambesprechung festhalten";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Datum:", x: 20, endX: 74 },
    { label: "Beginn:", x: 78, endX: 132 },
    { label: "Ende:", x: 136, endX: 190 },
  ]);
  y += 9;
  drawFieldsRow(doc, y, [{ label: "Protokoll durch:", x: 20, endX: 190 }]);
  y += 12;

  const topicsCols = [40, 55, 35, 40];
  const topicsHeight = 6 + tableHeight({ rowCount: 4 });
  y = ensureRoom(doc, y, topicsHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "THEMEN UND AUFGABEN");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: topicsCols,
    headers: ["Thema", "Aufgabe", "Zuständig", "Zu erledigen bis"],
    rowCount: 4,
  });
  y += 8;

  const attendanceCols = [60, 30, 80];
  const attendanceHeight = 6 + tableHeight({ rowCount: 8 });
  y = ensureRoom(doc, y, attendanceHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "ANWESENHEIT");
  y += 5;
  drawTable(doc, {
    y,
    colWidths: attendanceCols,
    headers: ["Name", "Anwesend", "Unterschrift"],
    rowCount: 8,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Datum:", labelPct: 12, valuePct: 21 },
        { label: "Beginn:", labelPct: 12, valuePct: 21 },
        { label: "Ende:", labelPct: 12, valuePct: 22 },
      ],
      [{ label: "Protokoll durch:", labelPct: 20, valuePct: 80 }],
    ]),
    docxSectionLabel("Themen und Aufgaben"),
    docxDataTable({
      headers: ["Thema", "Aufgabe", "Zuständig", "Zu erledigen bis"],
      colPcts: [25, 32, 20, 23],
      rowCount: 4,
    }),
    docxSpacer(200),
    docxSectionLabel("Anwesenheit"),
    docxDataTable({
      headers: ["Name", "Anwesend", "Unterschrift"],
      colPcts: [35, 20, 45],
      rowCount: 8,
    }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateTeambesprechungProtokoll() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
