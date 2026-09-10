// ladecheckliste.mjs — Template 10: Ladecheckliste (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawCheckboxLabel,
  docxHeader,
  docxSectionLabel,
  docxCheckboxLine,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "LADECHECKLISTE";
const SUBTITLE = "Werkzeug und Material für Montage- und Baustelleneinsätze vollständig einladen";

const SECTIONS = [
  {
    pdfTitle: "HANDWERKZEUGE",
    docxTitle: "Handwerkzeuge",
    items: [
      "Werkzeugkiste Handwerkzeug",
      "Ratschenkasten / Drehmomentschlüssel",
      "Silikonspritze mit Kartuschen (Silikon, Acryl, Kleber)",
      "Verbinder-Montagewerkzeug",
      "Sockelfußversteller",
    ],
  },
  {
    pdfTitle: "HANDMASCHINEN",
    docxTitle: "Handmaschinen",
    items: [
      "Stichsäge",
      "Handkreissäge mit Führungsschiene",
      "Akkuschrauber mit Bit-Set und Bohrern",
      "Multitool mit Aufsätzen",
      "Exzenterschleifer",
      "Schlagbohrmaschine",
      "Lamellofräse",
      "Hobelmaschine",
      "Oberfräse",
      "Kappsäge",
      "Winkelschleifer",
      "Kantenmaschine",
      "Tischkreissäge",
    ],
  },
  {
    pdfTitle: "HILFSMITTEL",
    docxTitle: "Hilfsmittel",
    items: [
      "Dosenbohrer-Set",
      "Bügelkanten und Bügeleisen",
      "Böcke",
      "Reinigungsmittel, Lappen, Papierrolle",
      "Staubsauger",
      "Besen, Handfeger, Schaufel",
      "Müllsäcke",
      "Baustellenleuchte",
      "Schleifpapier und Schleifklotz",
      "Abdeckmaterial, Decken",
      "Rollbretter",
      "Vakuumheber",
      "Kabeltrommel, Verlängerungskabel",
      "Leitern",
      "Schraubenkoffer",
    ],
  },
  {
    pdfTitle: "SONSTIGES",
    docxTitle: "Sonstiges",
    items: [
      "Lack/Öl zum Ausbessern lackierter/geölter Teile, Pinsel",
      "Auftragsspezifische Sonderteile",
      "Lieferschein",
      "Wegbeschreibung",
      "Navigationsgerät",
    ],
  },
];

function checklistSectionHeight(items) {
  return 6 + items.length * 6;
}

function drawChecklistSection(doc, y, title, items) {
  sectionLabel(doc, PAGE.marginLeft, y, title);
  y += 6;
  items.forEach((item) => {
    drawCheckboxLabel(doc, PAGE.marginLeft, y, item);
    y += 6;
  });
  return y;
}

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  SECTIONS.forEach(({ pdfTitle, items }) => {
    const needed = checklistSectionHeight(items) + 8;
    y = ensureRoom(doc, y, needed, header);
    y = drawChecklistSection(doc, y, pdfTitle, items);
    y += 8;
  });

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...SECTIONS.flatMap(({ docxTitle, items }) => [
      docxSectionLabel(docxTitle),
      ...items.map((item) => docxCheckboxLine([item])),
      docxSpacer(150),
    ]),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateLadecheckliste() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
