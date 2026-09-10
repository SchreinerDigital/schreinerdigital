// bestaetigung-elternzeit.mjs — Bestätigung der Elternzeit (PDF + Word)
//
// A standard HR confirmation letter. The legal wording is kept intact; every
// name/date/company reference is a literal bracketed placeholder.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  drawFieldsRow,
  drawParagraph,
  cleanText,
  docxHeader,
  docxFieldsBlock,
  docxParagraph,
  HEX,
} from "./branding.mjs";

const TITLE = "BESTÄTIGUNG DER ELTERNZEIT";
const SUBTITLE = "Schriftliche Bestätigung der Elternzeit gegenüber Mitarbeitenden (§ 16, § 17 BEEG)";

const BODY_SEGMENTS = [
  "Sehr geehrte/r [Name],",
  "hiermit bestätigen wir Ihnen die gewünschte Elternzeit für Ihr Kind [Name des Kindes], geboren am [Geburtsdatum], für den Zeitraum",
  "vom [Datum] bis [Datum]",
  "[ggf. weiterer Zeitraum: vom [Datum] bis [Datum]]",
  "Zugleich machen wir von unserer Befugnis gemäß § 17 Abs. 1 Satz 1 BEEG Gebrauch und kürzen den Ihnen für das Urlaubsjahr zustehenden Erholungsurlaub für jeden vollen Kalendermonat der Elternzeit um ein Zwölftel.",
];

const CLOSING_NOTE = "Diese Vorlage ersetzt keine arbeitsrechtliche Beratung im Einzelfall.";

const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

// Pre-measures the body+closing block so ensureRoom can be checked *before*
// any of it is drawn (same technique as email-vorlagen-kundenkommunikation.mjs).
function bodyBlockHeight(doc, text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  const lines = doc.splitTextToSize(cleanText(text), PAGE.contentWidth);
  return lines.length * BODY_LINE_HEIGHT;
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Name Mitarbeiter/in:", x: 20, endX: 104 },
    { label: "Anschrift:", x: 108, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Datum:", x: 20, endX: 74 }]);
  y += 12;

  const bodyText = [...BODY_SEGMENTS, "Mit freundlichen Grüßen\n[Firma]"].join("\n\n");
  const needed = bodyBlockHeight(doc, bodyText) + 14;
  y = ensureRoom(doc, y, needed, header);
  y = drawParagraph(doc, bodyText, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: BODY_FONT_SIZE });
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
    ...docxFieldsBlock([
      [
        { label: "Name Mitarbeiter/in:", labelPct: 22, valuePct: 28 },
        { label: "Anschrift:", labelPct: 13, valuePct: 37 },
      ],
      [{ label: "Datum:", labelPct: 15, valuePct: 35 }],
    ]),
    docxParagraph(BODY_SEGMENTS[0]),
    docxParagraph(BODY_SEGMENTS[1]),
    docxParagraph(BODY_SEGMENTS[2]),
    docxParagraph(BODY_SEGMENTS[3]),
    docxParagraph(BODY_SEGMENTS[4], { spacingAfter: 300 }),
    docxParagraph("Mit freundlichen Grüßen", { spacingAfter: 20 }),
    docxParagraph("[Firma]", { spacingAfter: 300 }),
    docxParagraph(CLOSING_NOTE, { italics: true, size: 15, color: HEX.muted, spacingAfter: 0 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateBestaetigungElternzeit() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
