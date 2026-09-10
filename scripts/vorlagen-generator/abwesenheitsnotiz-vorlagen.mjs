// abwesenheitsnotiz-vorlagen.mjs — ABWESENHEITSNOTIZ-VORLAGEN (PDF + Word)
//
// A collection of ready-to-use auto-reply texts rather than a fillable form.
// Original wording throughout; every variable value is a literal bracketed
// placeholder (never a real name, amount, or date).

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
  drawRuledArea,
  cleanText,
  docxHeader,
  docxParagraph,
  docxRuledLines,
} from "./branding.mjs";

const TITLE = "ABWESENHEITSNOTIZ-VORLAGEN";
const SUBTITLE =
  "Drei fertig formulierte Auto-Antworten für Urlaub, Betriebsurlaub und Feiertage – zum direkten Kopieren.";

const SIGNATURE = "[Ihr Name]";
const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

const ABSENCE_NOTICES = [
  {
    heading: "1. Einzelne Abwesenheit (Urlaub/Krankheit)",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Nachricht. Ich bin bis einschließlich [Datum] nicht im Büro und kann Ihre Nachricht in dieser Zeit nicht bearbeiten.",
      "Ab dem [Datum] bin ich wieder wie gewohnt für Sie erreichbar. In dringenden Fällen wenden Sie sich gerne an [Name/E-Mail-Adresse einer Vertretung].",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "2. Betriebsurlaub",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre E-Mail. Wir befinden uns vom [Datum] bis [Datum] im Betriebsurlaub.",
      "Ab dem [Datum] sind wir wieder wie gewohnt für Sie erreichbar. Bitte haben Sie Verständnis dafür, dass Ihre Nachricht in diesem Zeitraum nicht bearbeitet werden kann.",
    ],
    closing: "Beste Grüße",
  },
  {
    heading: "3. Feiertage / Jahreswechsel",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Nachricht. Wir befinden uns aktuell in der [Weihnachts-/Betriebs-]pause und sind ab dem [Datum] wieder für Sie erreichbar.",
      "Wir wünschen Ihnen erholsame Feiertage und einen guten Start in das neue Jahr.",
    ],
    closing: "Mit besten Grüßen",
  },
];

// Body text (incl. closing + signature) as one string for jsPDF, which
// honors "\n" as a forced line break inside splitTextToSize/drawParagraph.
function emailBodyText(notice) {
  return [...notice.paragraphs, `${notice.closing}\n${SIGNATURE}`].join("\n\n");
}

// Pre-measures how tall this notice's heading+body block will render so
// ensureRoom can be checked *before* any of it is drawn (keeps a notice from
// starting on one page and continuing on the next).
function emailBlockHeight(doc, notice) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  const lines = doc.splitTextToSize(cleanText(emailBodyText(notice)), PAGE.contentWidth);
  const bodyHeight = lines.length * BODY_LINE_HEIGHT;
  // heading + gap (6) + body + gap-before-rule (6) + rule + gap-after (12).
  return 6 + bodyHeight + 18;
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  ABSENCE_NOTICES.forEach((notice, i) => {
    const needed = emailBlockHeight(doc, notice);
    y = ensureRoom(doc, y, needed, header);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.ink);
    pdfText(doc, notice.heading, PAGE.marginLeft, y);
    y += 6;

    y = drawParagraph(doc, emailBodyText(notice), PAGE.marginLeft, y, PAGE.contentWidth, {
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
    });
    y += 6;

    if (i < ABSENCE_NOTICES.length - 1) {
      y = drawRuledArea(doc, { y, lines: 1, gap: 6 });
      y += 6;
    }
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [...docxHeader(TITLE, SUBTITLE)];

  ABSENCE_NOTICES.forEach((notice, i) => {
    const isLast = i === ABSENCE_NOTICES.length - 1;
    children.push(docxParagraph(notice.heading, { bold: true, size: 22, spacingAfter: 150 }));
    notice.paragraphs.forEach((p) => children.push(docxParagraph(p)));
    children.push(docxParagraph(notice.closing, { spacingAfter: 20 }));
    children.push(docxParagraph(SIGNATURE, { spacingAfter: isLast ? 0 : 300 }));
    if (!isLast) {
      children.push(...docxRuledLines(1));
    }
  });

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateAbwesenheitsnotizVorlagen() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
