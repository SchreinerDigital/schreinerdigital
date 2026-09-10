// email-vorlagen-kundenkommunikation-teil2.mjs — E-Mail-Vorlagen für die
// Kundenkommunikation – Teil 2 (PDF + Word)
//
// A collection of ready-to-use email texts rather than a fillable form.
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

const TITLE = "E-MAIL-VORLAGEN FÜR DIE KUNDENKOMMUNIKATION – TEIL 2";
const SUBTITLE =
  "Sechs weitere fertig formulierte E-Mail-Texte für Kostenschätzung, Akonto-Rechnung, Kapazitätsabsagen und Bewerbungen – zum direkten Kopieren.";

const SIGNATURE = "[Ihr Name]";
const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

const EMAILS = [
  {
    heading: "1. Kostenschätzung ankündigen",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "anbei erhalten Sie die erste Kostenschätzung für die bei unserem Termin besprochenen Arbeiten.",
      "Die Kostenschätzung beruht auf unseren Erfahrungswerten sowie den angedachten Materialien und Ausführungen. Sie ist nicht bindend und lässt bei den Einzelpositionen noch Spielraum.",
      "Im nächsten Schritt schlagen wir vor, die einzelnen Positionen gemeinsam zu besprechen und darauf aufbauend ein detailliertes Angebot zu erstellen.",
      "Wir freuen uns auf Ihre Rückmeldung.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "2. Akonto-Rechnung ankündigen",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für das entgegengebrachte Vertrauen durch Ihre Auftragserteilung.",
      "Im Anhang finden Sie die entsprechende Akonto-Rechnung (Abschlagsrechnung) zu Ihrem Projekt.",
    ],
    closing: "Mit besten Grüßen",
  },
  {
    heading: "3. Absage aus Kapazitätsgründen",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Anfrage und Ihr Interesse an unserem Betrieb.",
      "Leider können wir die Arbeiten im gewünschten Zeitraum aus Kapazitätsgründen nicht übernehmen und sehen daher von einem Angebot ab.",
      "Wir würden uns freuen, wenn Sie uns bei einem künftigen Projekt wieder berücksichtigen.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "4. Antwort auf Kundenanfrage mit eigenen Vorstellungen",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Anfrage. Es freut uns, dass Sie uns für die Umsetzung Ihres Projekts in Betracht ziehen.",
      "Schön, dass Sie bereits eigene Vorstellungen und Ideen mitgeschickt haben – damit haben wir auf den ersten Blick schon viele wichtige Informationen.",
      "Bei Rückfragen melden wir uns gerne bei Ihnen.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "5. Anfrage an einen Lieferanten",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "wir benötigen ein Angebot für: [Bezeichnung/Menge der benötigten Ware], inklusive Lieferung nach [PLZ Ort].",
      "Bei Rückfragen stehen wir Ihnen gerne zur Verfügung.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "6. Absage auf Praktikums-/Bewerbungsanfrage",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Bewerbung und Ihr Interesse an unserem Betrieb.",
      "Leider können wir Ihnen aktuell keinen Platz anbieten.",
      "Für Ihren weiteren Weg wünschen wir Ihnen viel Erfolg.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
];

// Body text (incl. closing + signature) as one string for jsPDF, which
// honors "\n" as a forced line break inside splitTextToSize/drawParagraph.
function emailBodyText(email) {
  return [...email.paragraphs, `${email.closing}\n${SIGNATURE}`].join("\n\n");
}

// Pre-measures how tall this email's heading+body block will render so
// ensureRoom can be checked *before* any of it is drawn (keeps an email from
// starting on one page and continuing on the next).
function emailBlockHeight(doc, email) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  const lines = doc.splitTextToSize(cleanText(emailBodyText(email)), PAGE.contentWidth);
  const bodyHeight = lines.length * BODY_LINE_HEIGHT;
  // heading + gap (6) + body + gap-before-rule (6) + rule + gap-after (12).
  return 6 + bodyHeight + 18;
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  EMAILS.forEach((email, i) => {
    const needed = emailBlockHeight(doc, email);
    y = ensureRoom(doc, y, needed, header);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.ink);
    pdfText(doc, email.heading, PAGE.marginLeft, y);
    y += 6;

    y = drawParagraph(doc, emailBodyText(email), PAGE.marginLeft, y, PAGE.contentWidth, {
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
    });
    y += 6;

    if (i < EMAILS.length - 1) {
      y = drawRuledArea(doc, { y, lines: 1, gap: 6 });
      y += 6;
    }
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [...docxHeader(TITLE, SUBTITLE)];

  EMAILS.forEach((email, i) => {
    const isLast = i === EMAILS.length - 1;
    children.push(docxParagraph(email.heading, { bold: true, size: 22, spacingAfter: 150 }));
    email.paragraphs.forEach((p) => children.push(docxParagraph(p)));
    children.push(docxParagraph(email.closing, { spacingAfter: 20 }));
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

export async function generateEmailVorlagenKundenkommunikationTeil2() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
