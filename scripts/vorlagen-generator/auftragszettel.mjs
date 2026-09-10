// auftragszettel.mjs — Template 1: Auftragszettel (PDF + Word)

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
  docxRuledLines,
  docxDataTable,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "AUFTRAGSZETTEL";
const SUBTITLE = "Kundenkontakt und Auftragsdaten für den ersten Werkstatt-Termin";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  // Kunde
  sectionLabel(doc, PAGE.marginLeft, y, "KUNDE");
  y += 6;
  drawFieldsRow(doc, y, [
    { label: "Name:", x: 20, endX: 74 },
    { label: "Straße:", x: 78, endX: 132 },
    { label: "PLZ/Ort:", x: 136, endX: 190 },
  ]);
  y += 10;

  drawFieldsRow(doc, y, [
    { label: "Telefon:", x: 20, endX: 74 },
    { label: "E-Mail:", x: 78, endX: 132 },
    { label: "Datum:", x: 136, endX: 190 },
  ]);
  y += 10;

  drawFieldsRow(doc, y, [{ label: "Gesprochen mit (Ansprechpartner beim Kunden):", x: 20, endX: 190 }]);
  y += 12;

  // Art der Anfrage
  sectionLabel(doc, PAGE.marginLeft, y, "ART DER ANFRAGE");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Angebotsanfrage");
  drawCheckboxLabel(doc, 90, y, "Auftrag");
  drawCheckboxLabel(doc, 130, y, "Auftrag mit Rapportzettel");
  y += 12;

  // Termin
  sectionLabel(doc, PAGE.marginLeft, y, "TERMIN");
  y += 6;
  drawFieldsRow(doc, y, [
    { label: "Datum:", x: 20, endX: 64 },
    { label: "Uhrzeit:", x: 68, endX: 112 },
    { label: "Ansprechpartner vor Ort:", x: 116, endX: 190 },
  ]);
  y += 12;

  // Beschreibung / Notizen
  const notesHeight = 6 + ruledAreaHeight(8, 6);
  y = ensureRoom(doc, y, notesHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BESCHREIBUNG / NOTIZEN");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 8, gap: 6 });
  y += 6;

  // Materialliste
  const materialCols = [85, 30, 55];
  const materialHeight = 6 + tableHeight({ rowCount: 6 });
  y = ensureRoom(doc, y, materialHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MATERIALLISTE");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: materialCols,
    headers: ["Bezeichnung", "Menge", "Bemerkung"],
    rowCount: 6,
  });
  y += 8;

  // Auftragszeit
  const auftragszeitCols = [40, 25, 105];
  const auftragszeitHeight = 6 + tableHeight({ rowCount: 4 });
  y = ensureRoom(doc, y, auftragszeitHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "AUFTRAGSZEIT");
  y += 5;
  drawTable(doc, {
    y,
    colWidths: auftragszeitCols,
    headers: ["Datum", "Std.", "Name"],
    rowCount: 4,
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    docxSectionLabel("Kunde"),
    ...docxFieldsBlock([
      [
        { label: "Name:", labelPct: 12, valuePct: 21 },
        { label: "Straße:", labelPct: 12, valuePct: 21 },
        { label: "PLZ/Ort:", labelPct: 12, valuePct: 22 },
      ],
      [
        { label: "Telefon:", labelPct: 15, valuePct: 18.3 },
        { label: "E-Mail:", labelPct: 15, valuePct: 18.4 },
        { label: "Datum:", labelPct: 15, valuePct: 18.3 },
      ],
      [{ label: "Gesprochen mit (Ansprechpartner beim Kunden):", labelPct: 45, valuePct: 55 }],
    ]),
    docxSectionLabel("Art der Anfrage"),
    docxCheckboxLine(["Angebotsanfrage", "Auftrag", "Auftrag mit Rapportzettel"]),
    docxSpacer(150),
    docxSectionLabel("Termin"),
    ...docxFieldsBlock([
      [
        { label: "Datum:", labelPct: 12, valuePct: 21 },
        { label: "Uhrzeit:", labelPct: 12, valuePct: 21 },
        { label: "Ansprechpartner vor Ort:", labelPct: 12, valuePct: 22 },
      ],
    ]),
    docxSectionLabel("Beschreibung / Notizen"),
    ...docxRuledLines(8),
    docxSpacer(150),
    docxSectionLabel("Materialliste"),
    docxDataTable({
      headers: ["Bezeichnung", "Menge", "Bemerkung"],
      colPcts: [50, 20, 30],
      rowCount: 6,
    }),
    docxSpacer(200),
    docxSectionLabel("Auftragszeit"),
    docxDataTable({
      headers: ["Datum", "Std.", "Name"],
      colPcts: [34, 16, 50],
      rowCount: 4,
    }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAuftragszettel() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
