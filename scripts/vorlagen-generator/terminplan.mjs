// terminplan.mjs — Template 8: Terminplan (PDF + Excel)

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

const TITLE = "TERMINPLAN";
const SUBTITLE = "Meilensteine und Termine eines Projekts im Überblick behalten";

const HEADERS = [
  "Meilenstein / Arbeitsschritt",
  "Geplanter Termin",
  "Tatsächlicher Termin",
  "Verantwortlich",
  "Status",
  "Bemerkung",
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt:", x: 20, endX: 100 },
    { label: "Projektnummer:", x: 104, endX: 190 },
  ]);
  y += 9;
  drawFieldsRow(doc, y, [
    { label: "Projektleitung:", x: 20, endX: 100 },
    { label: "Stand vom:", x: 104, endX: 190 },
  ]);
  y += 12;

  const colWidths = [38, 27, 34, 26, 17, 28];
  const rowCount = 12;
  const neededHeight = 5 + tableHeight({ rowCount });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MEILENSTEINE");
  y += 5;
  drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount,
    fontSize: 7.5,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Terminplan");
  ws.columns = [{ width: 34 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 12 }, { width: 26 }];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Projekt:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Projektnummer:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 1;
  ws.getCell(row, 1).value = "Projektleitung:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Stand vom:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Meilensteine");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  xlsxBlankRows(ws, row, 1, HEADERS.length, 12);

  return wb.xlsx.writeBuffer();
}

export async function generateTerminplan() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
