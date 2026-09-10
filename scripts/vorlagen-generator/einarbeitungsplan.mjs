// einarbeitungsplan.mjs — Einarbeitungsplan für neue Mitarbeiter (PDF + Word)

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
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxRuledLines,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "EINARBEITUNGSPLAN FÜR NEUE MITARBEITER";
const SUBTITLE = "Neue Kolleginnen und Kollegen strukturiert einarbeiten – von Tag 1 bis zur ersten Woche";

const SECTIONS = [
  {
    pdfTitle: "VOR DEM ERSTEN TAG",
    docxTitle: "Vor dem ersten Tag",
    items: [
      "Arbeitsplatz/Werkzeug vorbereitet",
      "Zugänge eingerichtet (Schlüssel, Software, E-Mail)",
      "Team über Neuzugang informiert",
    ],
  },
  {
    pdfTitle: "ERSTER TAG",
    docxTitle: "Erster Tag",
    items: [
      "Begrüßung und Betriebsrundgang",
      "Vorstellung im Team",
      "Arbeitssicherheit und Maschineneinweisung",
      "Wichtige Ansprechpartner benannt",
    ],
  },
  {
    pdfTitle: "ERSTE WOCHE",
    docxTitle: "Erste Woche",
    items: ["Aufgabenbereich erklärt", "Erste eigene Aufgabe übertragen", "Feedback-Gespräch vereinbart"],
  },
  {
    pdfTitle: "NACH VIER WOCHEN",
    docxTitle: "Nach vier Wochen",
    items: ["Rückmeldegespräch geführt", "Offene Fragen geklärt"],
  },
];

function checklistSectionHeight(items) {
  return 6 + items.length * 6;
}

function drawChecklistSection(doc, y, title, items) {
  sectionLabel(doc, PAGE.marginLeft, y, title);
  y += 6;
  items.forEach((item) => {
    drawCheckboxLabel(doc, PAGE.marginLeft, y, item);
    y += 6;
  });
  return y;
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Name:", x: 20, endX: 64 },
    { label: "Start am:", x: 68, endX: 112 },
    { label: "Zuständig (Pate/Mentor):", x: 116, endX: 190 },
  ]);
  y += 12;

  SECTIONS.forEach(({ pdfTitle, items }) => {
    const needed = checklistSectionHeight(items) + 8;
    y = ensureRoom(doc, y, needed, header);
    y = drawChecklistSection(doc, y, pdfTitle, items);
    y += 8;
  });

  const notesHeight = 6 + ruledAreaHeight(4, 6);
  y = ensureRoom(doc, y, notesHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "NOTIZEN");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 4, gap: 6 });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Name:", labelPct: 10, valuePct: 23 },
        { label: "Start am:", labelPct: 12, valuePct: 21 },
        { label: "Zuständig (Pate/Mentor):", labelPct: 20, valuePct: 14 },
      ],
    ]),
    ...SECTIONS.flatMap(({ docxTitle, items }) => [
      docxSectionLabel(docxTitle),
      ...items.map((item) => docxCheckboxLine([item])),
      docxSpacer(150),
    ]),
    docxSectionLabel("Notizen"),
    ...docxRuledLines(4),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateEinarbeitungsplan() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
