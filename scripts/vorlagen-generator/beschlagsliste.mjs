// beschlagsliste.mjs — BESCHLAGSLISTE (PDF + Excel)

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

const TITLE = "BESCHLAGSLISTE";
const SUBTITLE = "Benötigte Beschläge je Bauteil erfassen – für Bestellung und Montage";

const HEADERS = ["Pos.", "Bauteil", "Beschlagsart", "Hersteller / Art.-Nr.", "Menge", "Montageort", "Bemerkung"];
const ROW_COUNT = 16;

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt / Kom.-Nr.:", x: 20, endX: 120 },
    { label: "Datum:", x: 124, endX: 190 },
  ]);
  y += 12;

  const colWidths = [10, 26, 28, 32, 14, 28, 32];
  const neededHeight = 5 + tableHeight({ rowCount: ROW_COUNT });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BESCHLÄGE");
  y += 5;
  drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount: ROW_COUNT,
    fontSize: 7,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Beschlagsliste");
  ws.columns = [
    { width: 6 },
    { width: 20 },
    { width: 20 },
    { width: 24 },
    { width: 8 },
    { width: 20 },
    { width: 24 },
  ];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Projekt / Kom.-Nr.:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Datum:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Beschläge");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  xlsxBlankRows(ws, row, 1, HEADERS.length, ROW_COUNT);

  return wb.xlsx.writeBuffer();
}

export async function generateBeschlagsliste() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
