// mahnung-2.mjs — 2. MAHNUNG (PDF + Word)
//
// Laid out as a real DIN-5008-style business letter, matching the exact
// structure of the user's own Drive originals (verified against a PDF
// export of Rechnungsvorlage.docx, same document family) — just restyled
// in schreiner.digital's design (accent-colored rules, house font). Title
// stays all-caps, matching the source documents' emphasis convention for
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
  docxSpacer,
} from "./branding.mjs";

const TITLE = "2. MAHNUNG";

const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

const BODY_PARAGRAPHS = [
  "Sehr geehrte Damen und Herren,",
  "auch auf unsere 1. Mahnung vom [Datum] haben wir leider keine Zahlung erhalten. Für die Rechnung Nr. [Nummer] über [Betrag] € ist weiterhin kein Zahlungseingang zu verzeichnen.",
  "Wir fordern Sie hiermit letztmalig auf, den fälligen Betrag zzgl. der bereits entstandenen Mahnkosten in Höhe von [Betrag] € sowie der gesetzlichen Verzugszinsen bis spätestens [Datum] (innerhalb von 7 Tagen) vollständig zu begleichen.",
  "Sollte der Betrag nicht fristgerecht bei uns eingehen, sehen wir uns ohne weitere Ankündigung gezwungen, den Vorgang an ein Inkassounternehmen bzw. zur gerichtlichen Durchsetzung abzugeben. Die dadurch entstehenden zusätzlichen Kosten gehen zu Ihren Lasten.",
  "Sollten Sie die Zahlung bereits veranlasst haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.",
];

const CLOSING_TEXT = "Bei Fragen zu dieser Angelegenheit erreichen Sie uns unter den unten genannten Kontaktdaten.";

const INFO_FIELDS = [
  { label: "Rechnungsnummer:", value: "[Nummer]" },
  { label: "Rechnungsdatum:", value: "[Datum]" },
  { label: "Datum:", value: "[Datum]" },
];

// Body paragraphs joined with blank lines for jsPDF, which honors "\n" as a
// forced line break inside splitTextToSize/drawParagraph (same pattern as
// mahnung-1.mjs / zahlungserinnerung-brief.mjs).
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
  const addressEndY = drawAddressBlock(doc);
  const infoEndY = drawInfoBox(doc, INFO_FIELDS);
  let y = Math.max(addressEndY, infoEndY) + 10;

  y = drawSubjectLine(doc, y, TITLE);

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
    ...docxAddressAndInfoBlock({ infoFields: INFO_FIELDS }),
    docxSpacer(200),
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

export async function generateMahnung2() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
