// reklamationsprotokoll.mjs — REKLAMATIONSPROTOKOLL (PDF + Word)

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

const TITLE = "REKLAMATIONSPROTOKOLL";
const SUBTITLE = "Kundenreklamationen strukturiert aufnehmen und bis zur Lösung nachverfolgen";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Kunde:", x: 20, endX: 72 },
    { label: "Projekt / Auftragsnummer:", x: 76, endX: 137 },
    { label: "Datum der Meldung:", x: 141, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Gemeldet von (Kunde):", x: 20, endX: 100 },
    { label: "Aufgenommen von:", x: 104, endX: 190 },
  ]);
  y += 9;

  const beschreibungHeight = 6 + ruledAreaHeight(6, 6);
  y = ensureRoom(doc, y, beschreibungHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BESCHREIBUNG DER REKLAMATION");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 6, gap: 6 });
  y += 6;

  sectionLabel(doc, PAGE.marginLeft, y, "ERSTEINSCHÄTZUNG");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Berechtigte Reklamation");
  drawCheckboxLabel(doc, 66, y, "Nicht im Rahmen der Gewährleistung");
  drawCheckboxLabel(doc, 132, y, "Rücksprache erforderlich");
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Vor-Ort-Termin vereinbart am:", x: 20, endX: 190 }]);
  y += 9;

  const massnahmenCols = [70, 40, 30, 30];
  const massnahmenHeight = 6 + tableHeight({ rowCount: 5 });
  y = ensureRoom(doc, y, massnahmenHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MASSNAHMEN");
  y += 5;
  y = drawTable(doc, {
    y,
    colWidths: massnahmenCols,
    headers: ["Maßnahme", "Zuständig", "Bis wann", "Erledigt am"],
    rowCount: 5,
    fontSize: 8,
  });
  y += 8;

  drawFieldsRow(doc, y, [
    { label: "Reklamation abgeschlossen am:", x: 20, endX: 100 },
    { label: "Unterschrift:", x: 104, endX: 190 },
  ]);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Kunde:", labelPct: 8, valuePct: 22 },
        { label: "Projekt / Auftragsnummer:", labelPct: 22, valuePct: 18 },
        { label: "Datum der Meldung:", labelPct: 16, valuePct: 14 },
      ],
      [
        { label: "Gemeldet von (Kunde):", labelPct: 20, valuePct: 30 },
        { label: "Aufgenommen von:", labelPct: 16, valuePct: 34 },
      ],
    ]),
    docxSectionLabel("Beschreibung der Reklamation"),
    ...docxRuledLines(6),
    docxSpacer(150),
    docxSectionLabel("Ersteinschätzung"),
    docxCheckboxLine(["Berechtigte Reklamation", "Nicht im Rahmen der Gewährleistung", "Rücksprache erforderlich"]),
    docxSpacer(150),
    ...docxFieldsBlock([[{ label: "Vor-Ort-Termin vereinbart am:", labelPct: 28, valuePct: 72 }]]),
    docxSectionLabel("Maßnahmen"),
    docxDataTable({
      headers: ["Maßnahme", "Zuständig", "Bis wann", "Erledigt am"],
      colPcts: [41, 24, 18, 17],
      rowCount: 5,
    }),
    docxSpacer(200),
    ...docxFieldsBlock([
      [
        { label: "Reklamation abgeschlossen am:", labelPct: 24, valuePct: 26 },
        { label: "Unterschrift:", labelPct: 14, valuePct: 36 },
      ],
    ]),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateReklamationsprotokoll() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
