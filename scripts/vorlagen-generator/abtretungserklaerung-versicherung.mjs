// abtretungserklaerung-versicherung.mjs — Template 6: Abtretungserklärung bei
// Versicherungsschäden (PDF + Word)
//
// A standard legal-assignment form. The legal meaning/wording is kept intact;
// every company/address/name reference is a literal bracketed placeholder.

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  COLORS,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  pdfText,
  drawParagraph,
  drawField,
  drawRuledArea,
  docxHeader,
  docxParagraph,
  docxFieldsRow,
  docxRuledLines,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "ABTRETUNGSERKLÄRUNG BEI VERSICHERUNGSSCHÄDEN";
const SUBTITLE = "Für die direkte Schadensabwicklung mit der Kundenversicherung";

const INTRO_TEXT =
  "Sehr geehrte Kundin, sehr geehrter Kunde, um Ihnen die Abwicklung des Schadens zu erleichtern, können wir auf Wunsch die weitere Abwicklung direkt mit Ihrer Versicherung vornehmen. Hierfür senden Sie uns diese Erklärung bitte vollständig ausgefüllt und unterzeichnet zurück:";

const ASSIGNMENT_TEXT =
  "Als Auftraggeber trete ich / wir die gegen die oben genannte Versicherung zustehenden Ansprüche in Höhe der werkvertraglichen Vergütungsforderung von [Ihre Firma GmbH] unwiderruflich ab. Ich/wir ermächtige(n) die Versicherung, gegen Vorlage der Rechnung die Zahlung direkt an [Ihre Firma GmbH], [Straße, Hausnummer], [PLZ Ort], vorzunehmen.";

const FULFILLMENT_TEXT =
  "Die Abtretung erfolgt erfüllungshalber. Es ist mir/uns bekannt, dass ich/wir zur vollständigen Zahlung der Rechnung an [Ihre Firma GmbH] verpflichtet bin/sind, falls die Versicherung keine oder nur teilweise Zahlung leistet.";

const DEADLINE_TEXT =
  "Für die Einhaltung der Zahlungsfristen bin ich verantwortlich und werde meine Versicherung darauf hinweisen.";

const FOOTER_LINE = "[Ihre Firma GmbH] · [Straße, Hausnummer] · [PLZ Ort] · [Telefon] · [E-Mail]";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawField(doc, { x: 20, y, label: "Name / Anschrift des Versicherungsnehmers:", endX: 190 });
  y += 4;
  y = drawRuledArea(doc, { y, lines: 3, gap: 6 });
  y += 6;

  y = drawParagraph(doc, INTRO_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  drawField(doc, { x: 20, y, label: "Versicherungsname:", endX: 190 });
  y += 8;
  drawField(doc, { x: 20, y, label: "Versicherungsanschrift:", endX: 190 });
  y += 8;
  drawField(doc, { x: 20, y, label: "Schadens-Nr. der Versicherung (wichtig):", endX: 190 });
  y += 10;

  y = ensureRoom(doc, y, 34, header);
  y = drawParagraph(doc, ASSIGNMENT_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  y = ensureRoom(doc, y, 18, header);
  y = drawParagraph(doc, FULFILLMENT_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 8;

  y = ensureRoom(doc, y, 12, header);
  y = drawParagraph(doc, DEADLINE_TEXT, PAGE.marginLeft, y, PAGE.contentWidth, { fontSize: 9 });
  y += 12;

  y = ensureRoom(doc, y, 24, header);
  drawField(doc, { x: 20, y, label: "Ort / Datum:", endX: 100 });
  y += 10;
  drawField(doc, { x: 20, y, label: "Rechtsverbindliche Unterschrift des Versicherungsnehmers:", endX: 190 });
  y += 14;

  y = ensureRoom(doc, y, 10, header);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  pdfText(doc, FOOTER_LINE, PAGE.marginLeft, y);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    docxParagraph("Name / Anschrift des Versicherungsnehmers:", { bold: true, size: 18, color: "646460", spacingAfter: 100 }),
    ...docxRuledLines(3),
    docxSpacer(150),
    docxParagraph(INTRO_TEXT, { spacingAfter: 300 }),
    docxFieldsRow([{ label: "Versicherungsname:", labelPct: 30, valuePct: 70 }]),
    docxSpacer(100),
    docxFieldsRow([{ label: "Versicherungsanschrift:", labelPct: 30, valuePct: 70 }]),
    docxSpacer(100),
    docxFieldsRow([{ label: "Schadens-Nr. der Versicherung (wichtig):", labelPct: 45, valuePct: 55 }]),
    docxSpacer(300),
    docxParagraph(ASSIGNMENT_TEXT, { spacingAfter: 300 }),
    docxParagraph(FULFILLMENT_TEXT, { spacingAfter: 300 }),
    docxParagraph(DEADLINE_TEXT, { spacingAfter: 300 }),
    docxFieldsRow([{ label: "Ort / Datum:", labelPct: 16, valuePct: 34 }]),
    docxSpacer(100),
    docxFieldsRow([{ label: "Rechtsverbindliche Unterschrift des Versicherungsnehmers:", labelPct: 50, valuePct: 50 }]),
    docxSpacer(300),
    docxParagraph(FOOTER_LINE, { size: 15, italics: true, color: "646460", spacingAfter: 0 }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAbtretungserklaerungVersicherung() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
