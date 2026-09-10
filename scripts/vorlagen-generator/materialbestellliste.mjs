// materialbestellliste.mjs — MATERIALBESTELLLISTE (PDF + Excel)

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

const TITLE = "MATERIALBESTELLLISTE";
const SUBTITLE = "Benötigtes Material für ein Projekt sammeln und beim Lieferanten bestellen";

const HEADERS = [
  "Pos.",
  "Menge",
  "Einheit",
  "Materialart / Bezeichnung",
  "Lieferant",
  "Bestellt am",
  "Liefertermin",
  "Erhalten",
];
const ROW_COUNT = 16;

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt / Kom.-Nr.:", x: 20, endX: 74 },
    { label: "Datum:", x: 78, endX: 132 },
    { label: "Bestellt von:", x: 136, endX: 190 },
  ]);
  y += 12;

  const colWidths = [10, 14, 16, 40, 26, 22, 22, 20];
  const neededHeight = 5 + tableHeight({ rowCount: ROW_COUNT, rowHeight: 6 });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MATERIAL");
  y += 5;
  drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount: ROW_COUNT,
    rowHeight: 6,
    fontSize: 6.5,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Materialbestellliste");
  ws.columns = [
    { width: 6 },
    { width: 8 },
    { width: 9 },
    { width: 32 },
    { width: 20 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
  ];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Projekt / Kom.-Nr.:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Datum:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 7).value = "Bestellt von:";
  ws.getCell(row, 7).font = { bold: true, size: 10 };
  ws.getCell(row, 8).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Material");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  xlsxBlankRows(ws, row, 1, HEADERS.length, ROW_COUNT);

  return wb.xlsx.writeBuffer();
}

export async function generateMaterialbestellliste() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
