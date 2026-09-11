// mahnung-1.mjs — 1. MAHNUNG (PDF + Word)
//
// Laid out as a real DIN-5008-style business letter (address window, sender
// line, info box, "[Ihr Firmenlogo]" placeholder) since this document is
// meant to be sent out under the customer's OWN letterhead. Title stays
// all-caps, matching the source documents' emphasis convention for
// escalation letters (Mahnungen), unlike the normal-case Rechnung/
// Auftragsbestätigung subject lines.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawLetterHeader,
  drawAddressBlock,
  drawInfoBox,
  drawSubjectLine,
  ensureLetterRoom,
  finalizeLetterPdf,
  pdfText,
  drawParagraph,
  cleanText,
  docxLetterHeader,
  docxAddressAndInfoBlock,
  docxSubjectLine,
  docxLetterFooter,
  docxParagraph,
} from "./branding.mjs";

const TITLE = "1. MAHNUNG";

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

const INFO_FIELDS = [
  { label: "Rechnungsnummer:", value: "[Nummer]" },
  { label: "Rechnungsdatum:", value: "[Datum]" },
  { label: "Datum:", value: "[Datum]" },
];

// Body paragraphs joined with blank lines for jsPDF, which honors "\n" as a
// forced line break inside splitTextToSize/drawParagraph (same pattern as
// email-vorlagen-kundenkommunikation.mjs's emailBodyText).
function bodyText() {
  return BODY_PARAGRAPHS.join("\n\n");
}

// Pre-measures the body block's height so ensureLetterRoom can be checked
// before any of it is drawn.
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
  drawLetterHeader(doc);
  let y = drawAddressBlock(doc);
  drawInfoBox(doc, INFO_FIELDS);
  y += 10;

  y = drawSubjectLine(doc, y, TITLE);
  y += 3;

  y = ensureLetterRoom(doc, y, bodyBlockHeight(doc) + 6);
  y = drawParagraph(doc, bodyText(), PAGE.marginLeft, y, PAGE.contentWidth, {
    fontSize: BODY_FONT_SIZE,
    lineHeight: BODY_LINE_HEIGHT,
  });
  y += 6;

  y = ensureLetterRoom(doc, y, 14);
  y = drawParagraph(doc, CLOSING_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 10;

  y = ensureLetterRoom(doc, y, 16);
  drawSignature(doc, y);

  finalizeLetterPdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxLetterHeader(),
    docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSubjectLine(TITLE),
    ...BODY_PARAGRAPHS.map((p) => docxParagraph(p)),
    docxParagraph(CLOSING_TEXT, { spacingAfter: 300 }),
    ...signatureParagraphs(300),
    ...docxLetterFooter(),
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
