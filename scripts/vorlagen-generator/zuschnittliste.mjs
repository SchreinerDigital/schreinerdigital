// zuschnittliste.mjs — Template 7: Zuschnittliste (PDF + Excel)

import { jsPDF } from "jspdf";
import ExcelJS from "exceljs";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawTable,
  tableHeight,
  xlsxHeader,
  xlsxSectionLabel,
  xlsxTableHeaderRow,
  xlsxBlankRows,
  ARGB,
} from "./branding.mjs";

const TITLE = "ZUSCHNITTLISTE";
const SUBTITLE = "Bauteile für den Zuschnitt vorbereiten und den Fortschritt dokumentieren";

const HEADERS = [
  "Pos.",
  "Stück",
  "Bezeichnung",
  "Materialart",
  "Länge (mm)",
  "Kante L",
  "Breite (mm)",
  "Kante B",
  "Dicke (mm)",
  "Geschnitten",
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Kunde:", x: 20, endX: 74 },
    { label: "Datum:", x: 78, endX: 132 },
    { label: "Auftrag / Projekt:", x: 136, endX: 190 },
  ]);
  y += 12;

  const colWidths = [10, 12, 32, 22, 18, 14, 18, 14, 16, 14];
  const rowCount = 20;
  const neededHeight = 5 + tableHeight({ rowCount, rowHeight: 6 });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BAUTEILE");
  y += 5;
  drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount,
    rowHeight: 6,
    fontSize: 6.5,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Zuschnittliste");
  ws.columns = [
    { width: 6 },
    { width: 8 },
    { width: 24 },
    { width: 16 },
    { width: 12 },
    { width: 10 },
    { width: 12 },
    { width: 10 },
    { width: 12 },
    { width: 12 },
  ];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Kunde:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Datum:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 7).value = "Auftrag / Projekt:";
  ws.getCell(row, 7).font = { bold: true, size: 10 };
  ws.getCell(row, 8).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Bauteile");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  xlsxBlankRows(ws, row, 1, HEADERS.length, 20);

  return wb.xlsx.writeBuffer();
}

export async function generateZuschnittliste() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
