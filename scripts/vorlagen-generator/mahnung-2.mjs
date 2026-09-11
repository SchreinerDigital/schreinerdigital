// mahnung-2.mjs — 2. MAHNUNG (PDF + Word)

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

const TITLE = "2. MAHNUNG";
const SUBTITLE = "Letzte Mahnung vor Einleitung weiterer rechtlicher Schritte";

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

const FOOTER_NOTE =
  "[Ihre Firma] · [Straße Hausnummer] · [PLZ Ort] · Telefon: [Nummer] · [E-Mail] · [Website] · Bank: [Name] · IBAN: [IBAN] · BIC: [BIC] · Registergericht: [Ort], HRB [Nummer] · USt-IdNr.: [Nummer]";

// Body paragraphs joined with blank lines for jsPDF, which honors "\n" as a
// forced line break inside splitTextToSize/drawParagraph (same pattern as
// mahnung-1.mjs / zahlungserinnerung-brief.mjs).
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

export async function generateMahnung2() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
