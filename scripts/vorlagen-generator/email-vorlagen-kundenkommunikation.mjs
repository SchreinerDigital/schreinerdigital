// email-vorlagen-kundenkommunikation.mjs — Template 12: E-Mail-Vorlagen für die
// Kundenkommunikation (PDF + Word)
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

const TITLE = "E-MAIL-VORLAGEN FÜR DIE KUNDENKOMMUNIKATION";
const SUBTITLE =
  "Sieben fertig formulierte E-Mail-Texte für Angebot, Nachfrage, Rechnung, Zahlungserinnerung, Mahnung und Anfragen – zum direkten Kopieren.";

const SIGNATURE = "[Ihr Name]";
const BODY_FONT_SIZE = 9;
const BODY_LINE_HEIGHT = 4.3;

const EMAILS = [
  {
    heading: "1. Angebot versenden",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Anfrage.",
      "Im Anhang erhalten Sie unser Angebot zu Ihrem Projekt. Um Ihnen die Ausführung in Form, Material und Maßen vorzustellen, würden wir uns gerne persönlich mit Ihnen treffen.",
      "Wir würden uns freuen, wenn wir zeitnah einen Termin vereinbaren könnten. Da die Preise für Material derzeit stärker schwanken, bitten wir um Verständnis, dass wir uns an die im Angebot genannten Preise nur für einen begrenzten Zeitraum halten können.",
      "Wir würden uns freuen, Sie bei Ihrem Projekt unterstützen zu dürfen.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "2. Nachfrage zum Angebot",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vor einiger Zeit haben wir Ihnen ein Angebot zu Ihrem Projekt zukommen lassen. Wir wollten kurz nachfragen, ob das Angebot für Sie noch interessant ist.",
      "Entsprechen unsere Vorstellungen Ihren preislichen Erwartungen? Gerne setzen wir uns noch einmal zusammen, um mögliche Alternativen bei Material oder Ausführung zu besprechen.",
      "Über eine kurze Rückmeldung freuen wir uns.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "3. Rechnung versenden",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "im Anhang finden Sie die Rechnung zu Ihrem Projekt.",
      "Vielen Dank für Ihr Vertrauen! Wir würden uns freuen, Sie bei Ihrem nächsten Projekt wieder unterstützen zu dürfen.",
    ],
    closing: "Mit besten Grüßen",
  },
  {
    heading: "4. Zahlungserinnerung",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "anbei senden wir Ihnen eine freundliche Erinnerung bezüglich der noch ausstehenden Zahlung in Höhe von [Betrag] € für unsere erbrachten Leistungen zu Ihrem Projekt [Projektbezeichnung].",
      "Gemäß unserer Vereinbarung sollte die Zahlung bis spätestens [Datum] erfolgen. Bislang konnten wir noch keinen Zahlungseingang feststellen.",
      "Wir bitten Sie, den ausstehenden Betrag innerhalb der nächsten 7 Tage (bis [Datum]) zu begleichen.",
      "Vielen Dank im Voraus für Ihr Verständnis.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "5. 1. Mahnung",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "nach unserer vorherigen Zahlungserinnerung vom [Datum] müssen wir leider feststellen, dass der ausstehende Betrag in Höhe von [Betrag] € weiterhin nicht beglichen wurde.",
      "Die Zahlung sollte spätestens am [Datum] auf unserem Konto eingegangen sein. Da dies bisher nicht erfolgt ist, lassen wir Ihnen hiermit die 1. Mahnung zukommen.",
      "Bitte überweisen Sie den offenen Betrag inklusive Mahngebühr in Höhe von [Betrag] € bis spätestens [Datum].",
      "Wir hoffen auf Ihr Verständnis und eine prompte Erledigung.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "6. Antwort auf Anfrage",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Anfrage. Wir freuen uns, dass wir für die Ausführung Ihres Projekts in Frage kommen.",
      "Gerne erstellen wir eine erste Kostenschätzung bzw. ein Angebot. Sollten Sie bereits eigene Vorstellungen oder Ideen haben, senden Sie uns diese gerne zusammen mit den wichtigsten Maßen zu – so können wir Ihre Anfrage zügig bearbeiten.",
      "Bei Rückfragen melden wir uns gerne bei Ihnen.",
    ],
    closing: "Mit freundlichen Grüßen",
  },
  {
    heading: "7. Absage Ausschreibung",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "vielen Dank für Ihre Anfrage – es freut uns, dass Sie uns für die Ausführung der Arbeiten in Betracht ziehen.",
      "Leider können wir die Arbeiten im angegebenen Zeitraum nicht ausführen und sehen daher von einer Angebotsabgabe ab.",
      "Wir würden uns freuen, wenn Sie uns bei einer künftigen Ausschreibung wieder berücksichtigen.",
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

export async function generateEmailVorlagenKundenkommunikation() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
