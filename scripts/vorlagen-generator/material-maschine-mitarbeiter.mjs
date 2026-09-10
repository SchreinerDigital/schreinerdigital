// material-maschine-mitarbeiter.mjs — Template 5: Material-Maschine-Mitarbeiter-Zettel (PDF + Excel)

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

const TITLE = "MATERIAL · MASCHINE · MITARBEITER";
const SUBTITLE = "Verbrauchte Materialien und Fertigungszeit je Auftrag dokumentieren";

const MASCHINEN = [
  "Plattensäge",
  "Formatsäge",
  "Kantenmaschine",
  "Tischfräse",
  "Abrichthobelmaschine",
  "Furnierpresse",
  "Langbandschleifmaschine",
  "CNC-Maschine",
  "Handmaschinen",
];

const ROLLEN = ["Facharbeiter / Meister", "Auszubildender", "Helfer"];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Datum:", x: 20, endX: 90 },
    { label: "Kommission / Projekt-Nr.:", x: 94, endX: 190 },
  ]);
  y += 12;

  // Materialliste (8 columns)
  const materialCols = [12, 16, 40, 22, 16, 22, 16, 26];
  const materialHeight = 6 + tableHeight({ rowCount: 15, rowHeight: 6 });
  y = ensureRoom(doc, y, materialHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MATERIALLISTE");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: materialCols,
    headers: ["Pos.", "Anzahl", "Materialart", "Länge (mm)", "Kante", "Breite (mm)", "Kante", "m²"],
    rowCount: 15,
    rowHeight: 6,
    fontSize: 6.5,
  });
  y += 8;

  // Maschinenzeit (pre-filled machine names)
  const maschineCols = [55, 25, 90];
  const maschinePrefill = MASCHINEN.map((name) => [name, null, null]);
  const maschineHeight = 6 + tableHeight({ rowCount: MASCHINEN.length });
  y = ensureRoom(doc, y, maschineHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MASCHINENZEIT");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: maschineCols,
    headers: ["Maschine", "Std.", "Bemerkungen"],
    rowCount: MASCHINEN.length,
    prefill: maschinePrefill,
  });
  y += 8;

  // Personalzeit (pre-filled role names)
  const rolleCols = [130, 40];
  const rollePrefill = ROLLEN.map((name) => [name, null]);
  const rolleHeight = 6 + tableHeight({ rowCount: ROLLEN.length });
  y = ensureRoom(doc, y, rolleHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PERSONALZEIT");
  y += 5;
  drawTable(doc, {
    y,
    colWidths: rolleCols,
    headers: ["Rolle", "Std."],
    rowCount: ROLLEN.length,
    prefill: rollePrefill,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "schreiner.digital";
  const ws = wb.addWorksheet("Material-Maschine-Mitarbeiter");
  ws.columns = [
    { width: 26 },
    { width: 12 },
    { width: 26 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 10 },
    { width: 10 },
  ];

  let row = xlsxHeader(ws, TITLE, SUBTITLE);

  ws.getCell(row, 1).value = "Datum:";
  ws.getCell(row, 1).font = { bold: true, size: 10 };
  ws.getCell(row, 2).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  ws.getCell(row, 4).value = "Kommission / Projekt-Nr.:";
  ws.getCell(row, 4).font = { bold: true, size: 10 };
  ws.getCell(row, 5).border = { bottom: { style: "thin", color: { argb: ARGB.border } } };
  row += 2;

  row = xlsxSectionLabel(ws, row, "Materialliste");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, [
    "Pos.",
    "Anzahl",
    "Materialart",
    "Länge (mm)",
    "Kante",
    "Breite (mm)",
    "Kante",
    "m²",
  ]);
  row = xlsxBlankRows(ws, row, 1, 8, 15);
  row += 1;

  row = xlsxSectionLabel(ws, row, "Maschinenzeit");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, ["Maschine", "Std.", "Bemerkungen"]);
  row = xlsxBlankRows(ws, row, 1, 3, MASCHINEN.length, MASCHINEN);
  row += 1;

  row = xlsxSectionLabel(ws, row, "Personalzeit");
  row += 1;
  row = xlsxTableHeaderRow(ws, row, 1, ["Rolle", "Std."]);
  xlsxBlankRows(ws, row, 1, 2, ROLLEN.length, ROLLEN);

  return wb.xlsx.writeBuffer();
}

export async function generateMaterialMaschineMitarbeiter() {
  const pdf = buildPdf();
  const xlsx = await buildXlsx();
  return { pdf, xlsx: Buffer.from(xlsx) };
}
