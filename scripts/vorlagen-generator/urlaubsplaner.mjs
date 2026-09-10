// urlaubsplaner.mjs — URLAUBS- UND ABWESENHEITSPLANER (PDF + Excel)

import { jsPDF } from "jspdf";
import ExcelJS from "exceljs";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  smallNote,
  drawFieldsRow,
  drawTable,
  tableHeight,
  xlsxHeader,
  xlsxSectionLabel,
  xlsxTableHeaderRow,
  xlsxBlankRows,
  ARGB,
} from "./branding.mjs";

const TITLE = "URLAUBS- UND ABWESENHEITSPLANER";
const SUBTITLE = "Abwesenheiten im Team frühzeitig abstimmen und Kapazitäten im Blick behalten";

const HEADERS = ["Name", "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const ROW_COUNT = 10;
const LEGEND_NOTE = "Kürzel eintragen: U = Urlaub, K = Krank, F = Fortbildung, S = Sonstige Abwesenheit";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Jahr:", x: 20, endX: 100 },
    { label: "Stand vom:", x: 104, endX: 190 },
  ]);
  y += 12;

  const colWidths = [28, ...Array.from({ length: 12 }, () => 11.8)];
  const neededHeight = 6 + tableHeight({ rowCount: ROW_COUNT }) + 8;
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "TEAM");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount: ROW_COUNT,
    fontSize: 7,
  });
  y += 4;
  smallNote(doc, PAGE.marginLeft, y, LEGEND_NOTE);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Urlaubsplaner");
  ws.columns = [{ width: 22 }, ...Array.from({ length: 12 }, () => ({ width: 6 }))];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Jahr:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Stand vom:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Team");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  row = xlsxBlankRows(ws, row, 1, HEADERS.length, ROW_COUNT);

  row += 1;
  ws.getCell(row, 1).value = LEGEND_NOTE;
  ws.getCell(row, 1).font = { italic: true, size: 9, color: { argb: ARGB.muted } };

  return wb.xlsx.writeBuffer();
}

export async function generateUrlaubsplaner() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
