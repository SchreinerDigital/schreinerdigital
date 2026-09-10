// ablagesystem-buchhaltung.mjs — Ablagesystem für Buchhaltungsunterlagen
// (PDF + Word)
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

const TITLE = "ABLAGESYSTEM FÜR BUCHHALTUNGSUNTERLAGEN";
const SUBTITLE =
  "Eine einheitliche Ordnerstruktur erleichtert die Zusammenarbeit mit Steuerberatung und Buchhaltung";

const INTRO_TEXT =
  "Diese Vorlage schlägt eine Struktur zur Ablage der laufenden Buchhaltungsunterlagen vor – sortiert nach Belegart und Zeitraum.";

const TABLE_HEADERS = ["Ordner / Reiter", "Inhalt", "Empfohlener Zeitraum"];
const ROWS = [
  ["Rechnungseingang", "Eingangsrechnungen von Lieferanten", "je Quartal oder Halbjahr"],
  ["Rechnungsausgang", "Ausgangsrechnungen an Kunden", "je Quartal oder Halbjahr"],
  ["Lieferscheine", "Eingehende Lieferscheine, sortiert nach Lieferant", "jährlich"],
  ["Kontoauszüge", "Auszüge aller Geschäftskonten", "monatlich oder je Quartal"],
  ["Lohn", "Lohn- und Gehaltsunterlagen", "jährlich"],
  ["Kassenbuch/Belege", "Barbelege und Kassenbuch (falls geführt)", "monatlich"],
];

const CLOSING_NOTE =
  "Hinweis: Aufbewahrungsfristen (z. B. nach GoBD) sind unabhängig von der Ablagestruktur einzuhalten. Diese Vorlage ersetzt keine steuerliche Beratung.";

const PDF_COL_WIDTHS = [40, 90, 40];
const DOCX_COL_PCTS = [24, 52, 24];

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

  y = ensureRoom(doc, y, 14, header);
  drawParagraph(doc, CLOSING_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, {
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

export async function generateAblagesystemBuchhaltung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
