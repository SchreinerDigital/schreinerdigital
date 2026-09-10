// maengelliste.mjs — MÄNGELLISTE (PDF + Excel)

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

const TITLE = "MÄNGELLISTE";
const SUBTITLE = "Festgestellte Mängel über den Projektverlauf nachvollziehbar dokumentieren";

const HEADERS = ["Pos.", "Beschreibung des Mangels", "Ort / Bauteil", "Festgestellt am", "Frist", "Behoben am", "Status"];
const ROW_COUNT = 14;

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt / Kom.-Nr.:", x: 20, endX: 84 },
    { label: "Aufgenommen von:", x: 88, endX: 146 },
    { label: "Datum:", x: 150, endX: 190 },
  ]);
  y += 12;

  const colWidths = [10, 48, 28, 24, 18, 24, 18];
  const neededHeight = 5 + tableHeight({ rowCount: ROW_COUNT, rowHeight: 6 });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MÄNGEL");
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
  const ws = wb.addWorksheet("Mängelliste");
  ws.columns = [
    { width: 6 },
    { width: 32 },
    { width: 18 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 10 },
  ];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Projekt / Kom.-Nr.:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Aufgenommen von:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 6).value = "Datum:";
  ws.getCell(row, 6).font = { bold: true, size: 10 };
  ws.getCell(row, 7).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Mängel");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  xlsxBlankRows(ws, row, 1, HEADERS.length, ROW_COUNT);

  return wb.xlsx.writeBuffer();
}

export async function generateMaengelliste() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
