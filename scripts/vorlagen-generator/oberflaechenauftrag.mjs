// oberflaechenauftrag.mjs — OBERFLÄCHENAUFTRAG (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawCheckboxLabel,
  drawRuledArea,
  ruledAreaHeight,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxDataTable,
  docxRuledLines,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "OBERFLÄCHENAUFTRAG";
const SUBTITLE = "Vorgaben zur Oberflächenbehandlung je Bauteil festhalten, bevor es in die Lackiererei geht";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt / Kom.-Nr.:", x: 20, endX: 84 },
    { label: "Datum:", x: 88, endX: 132 },
    { label: "Verantwortlich:", x: 136, endX: 190 },
  ]);
  y += 12;

  sectionLabel(doc, PAGE.marginLeft, y, "OBERFLÄCHENART");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Lackieren");
  drawCheckboxLabel(doc, 80, y, "Ölen");
  drawCheckboxLabel(doc, 130, y, "Wachsen");
  y += 9;
  drawCheckboxLabel(doc, 20, y, "Beizen");
  drawCheckboxLabel(doc, 70, y, "Unbehandelt");
  y += 12;

  drawFieldsRow(doc, y, [
    { label: "Farbton / Bezeichnung:", x: 20, endX: 84 },
    { label: "Glanzgrad:", x: 88, endX: 132 },
    { label: "Anzahl Schichten:", x: 136, endX: 190 },
  ]);
  y += 12;

  const bauteileCols = [12, 40, 20, 40, 58];
  const bauteileHeight = 6 + tableHeight({ rowCount: 8 });
  y = ensureRoom(doc, y, bauteileHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BAUTEILE");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: bauteileCols,
    headers: ["Pos.", "Bauteil", "Menge", "Vorbehandlung", "Bemerkung"],
    rowCount: 8,
    fontSize: 8,
  });
  y += 8;

  const besondHeight = 6 + ruledAreaHeight(4, 6);
  y = ensureRoom(doc, y, besondHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BESONDERHEITEN");
  y += 5;
  drawRuledArea(doc, { y, lines: 4, gap: 6 });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Projekt / Kom.-Nr.:", labelPct: 20, valuePct: 16 },
        { label: "Datum:", labelPct: 12, valuePct: 18 },
        { label: "Verantwortlich:", labelPct: 16, valuePct: 18 },
      ],
    ]),
    docxSectionLabel("Oberflächenart"),
    docxCheckboxLine(["Lackieren", "Ölen", "Wachsen", "Beizen", "Unbehandelt"]),
    docxSpacer(150),
    ...docxFieldsBlock([
      [
        { label: "Farbton / Bezeichnung:", labelPct: 22, valuePct: 14 },
        { label: "Glanzgrad:", labelPct: 12, valuePct: 18 },
        { label: "Anzahl Schichten:", labelPct: 16, valuePct: 18 },
      ],
    ]),
    docxSectionLabel("Bauteile"),
    docxDataTable({
      headers: ["Pos.", "Bauteil", "Menge", "Vorbehandlung", "Bemerkung"],
      colPcts: [7, 23, 12, 23, 35],
      rowCount: 8,
    }),
    docxSpacer(200),
    docxSectionLabel("Besonderheiten"),
    ...docxRuledLines(4),
  ];

  const document = new Document({ sections: [{ children }] });
  return Packer.toBuffer(document);
}

export async function generateOberflaechenauftrag() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
