// projektordner-register.mjs — Projektordner-Register (PDF + Word)
//
// A reference table: the row content itself is the template's value (a
// suggested filing structure), not a form to be filled in by hand.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  drawParagraph,
  drawTable,
  tableHeight,
  docxHeader,
  docxParagraph,
  docxDataTable,
  docxSpacer,
  HEX,
} from "./branding.mjs";

const TITLE = "PROJEKTORDNER-REGISTER";
const SUBTITLE = "Einheitliche Struktur für den Papier- oder Cloud-Ordner je Kundenprojekt";

const INTRO_TEXT =
  "Diese Vorlage schlägt eine einheitliche Reihenfolge für Unterlagen je Projekt vor – ob im Ordner mit Trennblättern oder als Ordnerstruktur in der Cloud.";

const TABLE_HEADERS = ["Nr.", "Bereich", "Inhalt"];
const ROWS = [
  ["1", "Notizen", "Telefonnotizen, Gesprächsnotizen"],
  ["2", "Schriftverkehr", "Ein- und ausgehende Korrespondenz"],
  ["3", "Auftragsbestätigung & Rechnungen", "Angebot, Auftragsbestätigung, Rechnungen"],
  ["4", "Pläne", "Zeichnungen, Aufmaße, CAD-Ausdrucke"],
  ["5", "Material", "Materialbestellungen, Lieferscheine"],
  ["6", "Werkstatt", "Zuschnittliste, Beschlagsliste, interne Notizen"],
  ["7", "Bauseitige Unterlagen", "Unterlagen von Kunde, Architekt oder anderen Gewerken"],
  ["8", "Termine", "Terminplan, Bautagebericht"],
  ["9", "Sonstiges", "Alles, was sonst nirgends reinpasst"],
];

const CLOSING_NOTE =
  "Die Nummerierung lässt sich mit nummerierten Trennblättern 1–9 (z. B. handelsüblich erhältlich) direkt umsetzen.";

const PDF_COL_WIDTHS = [14, 50, 106];
const DOCX_COL_PCTS = [8, 29, 63];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  const neededTable = tableHeight({ rowCount: ROWS.length });
  y = ensureRoom(doc, y, neededTable, header);
  y = drawTable(doc, {
    y,
    colWidths: PDF_COL_WIDTHS,
    headers: TABLE_HEADERS,
    rowCount: ROWS.length,
    prefill: ROWS,
    fontSize: 8,
  });
  y += 8;

  y = ensureRoom(doc, y, 10, header);
  y = drawParagraph(doc, CLOSING_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, {
    fontSize: 7.5,
    lineHeight: 3.6,
    color: COLORS.muted,
    font: "italic",
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    docxParagraph(INTRO_TEXT, { spacingAfter: 300 }),
    docxDataTable({
      headers: TABLE_HEADERS,
      colPcts: DOCX_COL_PCTS,
      rowCount: ROWS.length,
      prefill: ROWS,
    }),
    docxSpacer(200),
    docxParagraph(CLOSING_NOTE, { italics: true, size: 15, color: HEX.muted, spacingAfter: 0 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateProjektordnerRegister() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
