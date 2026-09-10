// projektuebersicht-kapazitaetsplaner.mjs — PROJEKTÜBERSICHT (PDF + Excel)
//
// This is a cross-project portfolio overview: one row per project/customer,
// showing timeframe and status across all currently running jobs. It is
// distinct from terminplan.mjs, which tracks the milestones *within* a
// single project rather than listing multiple projects side by side.

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

const TITLE = "PROJEKTÜBERSICHT";
const SUBTITLE = "Alle laufenden Projekte auf einen Blick – Zeitraum und Status je Auftrag";

const HEADERS = ["Projekt / Kunde", "Start", "Geplantes Ende", "Verantwortlich", "Status", "Bemerkung"];
const ROW_COUNT = 14;
const STATUS_LEGEND = "geplant · in Arbeit · abgeschlossen · pausiert";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Stand vom:", x: 20, endX: 100 },
    { label: "Erstellt von:", x: 104, endX: 190 },
  ]);
  y += 12;

  // Reuse the exact proven-safe colWidths/fontSize from terminplan.mjs's
  // 6-column table (same shape, shorter header strings) — see AGENTS notes
  // on the earlier header-overlap bug for this column layout.
  const colWidths = [38, 27, 34, 26, 17, 28];
  const neededHeight = 5 + tableHeight({ rowCount: ROW_COUNT });
  y = ensureRoom(doc, y, neededHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PROJEKTE");
  y += 5;
  drawTable(doc, {
    y,
    colWidths,
    headers: HEADERS,
    rowCount: ROW_COUNT,
    fontSize: 7.5,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Projektübersicht");
  ws.columns = [{ width: 30 }, { width: 14 }, { width: 16 }, { width: 16 }, { width: 12 }, { width: 22 }];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Stand vom:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Erstellt von:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Projekte");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, HEADERS);
  row = xlsxBlankRows(ws, row, 1, HEADERS.length, ROW_COUNT);

  row += 1;
  row = xlsxSectionLabel(ws, row, "Status-Kürzel:");
  ws.getCell(row, 1).value = STATUS_LEGEND;

  return wb.xlsx.writeBuffer();
}

export async function generateProjektuebersichtKapazitaetsplaner() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
