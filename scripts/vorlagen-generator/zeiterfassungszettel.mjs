// zeiterfassungszettel.mjs — Template 2: Zeiterfassungszettel (PDF + Excel)

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
  xlsxSumRow,
  ARGB,
} from "./branding.mjs";

const TITLE = "ZEITERFASSUNGSZETTEL";
const SUBTITLE = "Fertigungs- und Montagezeit je Auftrag erfassen";
const BEREICH_NOTE = "Bereich z. B. Maschine, Kante, CNC, Bankraum";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Kunde:", x: 20, endX: 100 },
    { label: "Projekt / Position:", x: 104, endX: 190 },
  ]);
  y += 12;

  // Fertigungszeit
  const fertigungCols = [40, 20, 55, 55];
  const fertigungHeight = 6 + tableHeight({ rowCount: 15, rowHeight: 6, extraRow: true }) + 6;
  y = ensureRoom(doc, y, fertigungHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "FERTIGUNGSZEIT");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: fertigungCols,
    headers: ["Datum", "Std.", "Name", "Bereich"],
    rowCount: 15,
    rowHeight: 6,
    extraRow: ["Summe Std.", null, null, null],
  });
  y += 4;
  smallNote(doc, PAGE.marginLeft, y, BEREICH_NOTE);
  y += 8;

  // Montagezeit
  const montageCols = [45, 30, 95];
  const montageHeight = 6 + tableHeight({ rowCount: 10, rowHeight: 6, extraRow: true });
  y = ensureRoom(doc, y, montageHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MONTAGEZEIT");
  y += 5;
  drawTable(doc, {
    y,
    colWidths: montageCols,
    headers: ["Datum", "Std.", "Name"],
    rowCount: 10,
    rowHeight: 6,
    extraRow: ["Summe Std.", null, null],
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Zeiterfassung");
  ws.columns = [{ width: 14 }, { width: 9 }, { width: 24 }, { width: 26 }];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Kunde:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 3).value = "Projekt / Position:";
  ws.getCell(row, 3).font = { bold: true, size: 10 };
  ws.getCell(row, 4).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Fertigungszeit");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, ["Datum", "Std.", "Name", "Bereich"]);
  const fertigungDataStart = row;
  row = xlsxBlankRows(ws, row, 1, 4, 15);
  const fertigungDataEnd = row - 1;
  row = xlsxSumRow(ws, row, 1, "Summe Std.", 1, fertigungDataStart, fertigungDataEnd);
  ws.getCell(row, 1).value = BEREICH_NOTE;
  ws.getCell(row, 1).font = { italic: true, size: 9, color: { argb: ARGB.muted } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Montagezeit");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, ["Datum", "Std.", "Name"]);
  const montageDataStart = row;
  row = xlsxBlankRows(ws, row, 1, 3, 10);
  const montageDataEnd = row - 1;
  xlsxSumRow(ws, row, 1, "Summe Std.", 1, montageDataStart, montageDataEnd);

  return wb.xlsx.writeBuffer();
}

export async function generateZeiterfassungszettel() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
