// mahnung-1.mjs — 1. MAHNUNG (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  HEX,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  pdfText,
  drawParagraph,
  drawFieldsRow,
  cleanText,
  docxHeader,
  docxParagraph,
  docxFieldsBlock,
} from "./branding.mjs";

const TITLE = "1. MAHNUNG";
const SUBTITLE = "Erste förmliche Mahnung nach erfolgloser Zahlungserinnerung";

const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

const BODY_PARAGRAPHS = [
  "Sehr geehrte Damen und Herren,",
  "auf unsere Zahlungserinnerung vom [Datum] haben Sie leider nicht reagiert. Für die Rechnung Nr. [Nummer] über [Betrag] € konnten wir weiterhin keinen Zahlungseingang feststellen.",
  "Wir bitten Sie, den fälligen Betrag bis spätestens [Datum] (innerhalb von 14 Tagen) auf das unten genannte Konto zu überweisen.",
  "Sollten Sie diese Frist versäumen, sehen wir uns gezwungen, Ihnen die Kosten des Mahnverfahrens sowie die gesetzlichen Verzugszinsen zusätzlich in Rechnung zu stellen.",
  "Sollten Sie die Zahlung bereits veranlasst haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.",
];

const CLOSING_TEXT = "Bei Rückfragen stehen wir Ihnen gerne zur Verfügung.";

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// Body paragraphs joined with blank lines for jsPDF, which honors "\n" as a
// forced line break inside splitTextToSize/drawParagraph (same pattern as
// email-vorlagen-kundenkommunikation.mjs's emailBodyText).
function bodyText() {
  return BODY_PARAGRAPHS.join("\n\n");
}

// Pre-measures the body block's height so ensureRoom can be checked before
// any of it is drawn.
function bodyBlockHeight(doc) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  const lines = doc.splitTextToSize(cleanText(bodyText()), PAGE.contentWidth);
  return lines.length * BODY_LINE_HEIGHT;
}

function drawSignature(doc, y) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.ink);
  pdfText(doc, "Mit freundlichen Grüßen", PAGE.marginLeft, y);
  y += 6;
  pdfText(doc, "[Ihr Name]", PAGE.marginLeft, y);
  return y;
}

function signatureParagraphs(spacingAfter) {
  return [docxParagraph("Mit freundlichen Grüßen", { spacingAfter: 20 }), docxParagraph("[Ihr Name]", { spacingAfter })];
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Rechnungsnummer:", x: 20, endX: 74 },
    { label: "Rechnungsdatum:", x: 78, endX: 132 },
    { label: "Datum:", x: 136, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Kunde (Name, Anschrift):", x: 20, endX: 190 }]);
  y += 9;

  y = ensureRoom(doc, y, bodyBlockHeight(doc) + 6, header);
  y = drawParagraph(doc, bodyText(), PAGE.marginLeft, y, PAGE.contentWidth, {
    fontSize: BODY_FONT_SIZE,
    lineHeight: BODY_LINE_HEIGHT,
  });
  y += 6;

  y = ensureRoom(doc, y, 14, header);
  y = drawParagraph(doc, CLOSING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 10;

  y = ensureRoom(doc, y, 16, header);
  y = drawSignature(doc, y);
  y += 10;

  y = ensureRoom(doc, y, 14, header);
  drawParagraph(doc, FOOTER_NOTE, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 7.5, color: COLORS.muted });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Rechnungsnummer:", labelPct: 12, valuePct: 21 },
        { label: "Rechnungsdatum:", labelPct: 12, valuePct: 21 },
        { label: "Datum:", labelPct: 12, valuePct: 22 },
      ],
      [{ label: "Kunde (Name, Anschrift):", labelPct: 25, valuePct: 75 }],
    ]),
    ...BODY_PARAGRAPHS.map((p) => docxParagraph(p)),
    docxParagraph(CLOSING_TEXT, { spacingAfter: 300 }),
    ...signatureParagraphs(300),
    docxParagraph(FOOTER_NOTE, { size: 15, color: HEX.muted, spacingAfter: 200 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateMahnung1() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
