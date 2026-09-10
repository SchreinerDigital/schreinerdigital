// bautagebericht.mjs — Template 9: Bautagebericht (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawField,
  drawFieldsRow,
  drawRuledArea,
  ruledAreaHeight,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsRow,
  docxSpacer,
  docxRuledLines,
  docxDataTable,
} from "./branding.mjs";

const TITLE = "BAUTAGEBERICHT";
const SUBTITLE = "Tägliche Dokumentation der Arbeiten auf der Baustelle";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  // "Baumaßnahme:" gets two blank lines (its own field line plus one more
  // ruled line) so a multi-line address/description fits.
  drawField(doc, { x: 20, y, label: "Baumaßnahme:", endX: 190 });
  y += 6;
  y = drawRuledArea(doc, { y, lines: 1, gap: 6 });
  y += 6;

  drawField(doc, { x: 20, y, label: "Datum:", endX: 100 });
  y += 10;

  const crewCols = [55, 80, 35];
  const crewHeight = 6 + tableHeight({ rowCount: 4 });
  y = ensureRoom(doc, y, crewHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PERSONAL VOR ORT");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: crewCols,
    headers: ["Anzahl Arbeiter", "Funktion", "Zeit (Std.)"],
    rowCount: 4,
  });
  y += 8;

  const leistungenHeight = 6 + ruledAreaHeight(4, 6);
  y = ensureRoom(doc, y, leistungenHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "LEISTUNGEN");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 4, gap: 6 });
  y += 8;

  const vorkommnisseHeight = 6 + ruledAreaHeight(3, 6);
  y = ensureRoom(doc, y, vorkommnisseHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BESONDERE VORKOMMNISSE");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 3, gap: 6 });
  y += 10;

  y = ensureRoom(doc, y, 10, header);
  drawFieldsRow(doc, y, [
    { label: "Auftragnehmer:", x: 20, endX: 100 },
    { label: "Auftraggeber / Bauleitung:", x: 104, endX: 190 },
  ]);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    docxFieldsRow([{ label: "Baumaßnahme:", labelPct: 20, valuePct: 80 }]),
    docxSpacer(80),
    ...docxRuledLines(1),
    docxSpacer(150),
    docxFieldsRow([{ label: "Datum:", labelPct: 15, valuePct: 85 }]),
    docxSpacer(200),
    docxSectionLabel("Personal vor Ort"),
    docxDataTable({
      headers: ["Anzahl Arbeiter", "Funktion", "Zeit (Std.)"],
      colPcts: [30, 45, 25],
      rowCount: 4,
    }),
    docxSpacer(200),
    docxSectionLabel("Leistungen"),
    ...docxRuledLines(4),
    docxSpacer(150),
    docxSectionLabel("Besondere Vorkommnisse"),
    ...docxRuledLines(3),
    docxSpacer(300),
    docxFieldsRow([
      { label: "Auftragnehmer:", labelPct: 22, valuePct: 28 },
      { label: "Auftraggeber / Bauleitung:", labelPct: 25, valuePct: 25 },
    ]),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateBautagebericht() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
