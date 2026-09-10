// kundendatenblatt.mjs — KUNDENDATENBLATT (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  smallNote,
  drawFieldsRow,
  drawCheckboxLabel,
  drawCheckbox,
  drawParagraph,
  drawRuledArea,
  ruledAreaHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxRuledLines,
  docxParagraph,
  docxSpacer,
  HEX,
} from "./branding.mjs";

const TITLE = "KUNDENDATENBLATT";
const SUBTITLE = "Erstkontakt strukturiert erfassen – Kontaktdaten, Projektart und Rückmeldung an einem Ort";

const PROJEKTART_ITEMS = ["Neubau", "Renovierung/Umbau", "Reparatur", "Sonstiges"];
const CONSENT_TEXT =
  "Der Kunde ist damit einverstanden, dass die genannten Daten zur Bearbeitung der Anfrage gespeichert werden.";
const DSGVO_NOTE =
  "Hinweis: Diese Vorlage ersetzt keine Rechtsberatung. Prüfen Sie die Formulierung zur Einwilligung ggf. mit Blick auf die DSGVO für Ihren Betrieb.";
// smallNote() draws a single line of unwrapped text; at its fixed 7.5pt size this
// sentence measures ~173mm (wider than the 170mm content area), so for the PDF it
// is split across two lines at the natural sentence boundary (same wording as
// DSGVO_NOTE above, used as-is for the docx paragraph, which wraps on its own).
const DSGVO_NOTE_PDF_LINES = [
  "Hinweis: Diese Vorlage ersetzt keine Rechtsberatung.",
  "Prüfen Sie die Formulierung zur Einwilligung ggf. mit Blick auf die DSGVO für Ihren Betrieb.",
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Name:", x: 20, endX: 74 },
    { label: "Straße:", x: 78, endX: 132 },
    { label: "PLZ/Ort:", x: 136, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Telefon:", x: 20, endX: 68 },
    { label: "E-Mail:", x: 72, endX: 120 },
    { label: "Bevorzugter Kontaktweg:", x: 124, endX: 190 },
  ]);
  y += 12;

  // Projektart
  const projektartNeeded = 8 + 9;
  y = ensureRoom(doc, y, projektartNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PROJEKTART");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Neubau");
  drawCheckboxLabel(doc, 63, y, "Renovierung/Umbau");
  drawCheckboxLabel(doc, 106, y, "Reparatur");
  drawCheckboxLabel(doc, 149, y, "Sonstiges");
  y += 9;

  drawFieldsRow(doc, y, [{ label: "Wie sind Sie auf uns aufmerksam geworden?:", x: 20, endX: 190 }]);
  y += 12;

  // Projektbeschreibung
  const notesNeeded = 6 + ruledAreaHeight(8, 6);
  y = ensureRoom(doc, y, notesNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PROJEKTBESCHREIBUNG");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 8, gap: 6 });
  y += 6;

  drawFieldsRow(doc, y, [
    { label: "Gewünschter Termin für Besichtigung:", x: 20, endX: 125 },
    { label: "Budgetrahmen (ca.):", x: 129, endX: 190 },
  ]);
  y += 12;

  // Hinweis zum Datenschutz
  const consentNeeded = 40;
  y = ensureRoom(doc, y, consentNeeded, header);
  sectionLabel(doc, PAGE.marginLeft, y, "HINWEIS ZUM DATENSCHUTZ");
  y += 7;
  drawCheckbox(doc, 20, y - 3.2, 4);
  y = drawParagraph(doc, CONSENT_TEXT, 26, y, PAGE.contentWidth - 6);
  y += 6;
  DSGVO_NOTE_PDF_LINES.forEach((line, i) => {
    smallNote(doc, PAGE.marginLeft, y + i * 4, line);
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Name:", labelPct: 12, valuePct: 21 },
        { label: "Straße:", labelPct: 12, valuePct: 21 },
        { label: "PLZ/Ort:", labelPct: 12, valuePct: 22 },
      ],
      [
        { label: "Telefon:", labelPct: 15, valuePct: 18.3 },
        { label: "E-Mail:", labelPct: 15, valuePct: 18.4 },
        { label: "Bevorzugter Kontaktweg:", labelPct: 15, valuePct: 18.3 },
      ],
    ]),
    docxSectionLabel("Projektart"),
    docxCheckboxLine(PROJEKTART_ITEMS),
    docxSpacer(150),
    ...docxFieldsBlock([[{ label: "Wie sind Sie auf uns aufmerksam geworden?:", labelPct: 45, valuePct: 55 }]]),
    docxSectionLabel("Projektbeschreibung"),
    ...docxRuledLines(8),
    docxSpacer(150),
    ...docxFieldsBlock([
      [
        { label: "Gewünschter Termin für Besichtigung:", labelPct: 30, valuePct: 20 },
        { label: "Budgetrahmen (ca.):", labelPct: 25, valuePct: 25 },
      ],
    ]),
    docxSectionLabel("Hinweis zum Datenschutz"),
    docxCheckboxLine([CONSENT_TEXT]),
    docxParagraph(DSGVO_NOTE, { italics: true, size: 16, color: HEX.muted }),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateKundendatenblatt() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
