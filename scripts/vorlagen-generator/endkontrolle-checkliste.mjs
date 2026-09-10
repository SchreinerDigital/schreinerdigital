// endkontrolle-checkliste.mjs — ENDKONTROLLE VOR AUSLIEFERUNG (PDF + Word)

import { jsPDF } from "jspdf";
import { Document, Packer } from "docx";
import {
  PAGE,
  drawPdfHeader,
  finalizePdf,
  ensureRoom,
  sectionLabel,
  drawFieldsRow,
  drawCheckboxLabel,
  drawRuledArea,
  ruledAreaHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxRuledLines,
  docxSpacer,
} from "./branding.mjs";

const TITLE = "ENDKONTROLLE VOR AUSLIEFERUNG";
const SUBTITLE = "Qualität und Vollständigkeit prüfen, bevor ein Werkstück die Werkstatt verlässt";

const CHECKLIST_ITEMS = [
  "Maße stimmen mit Auftrag/Aufmaß überein",
  "Oberfläche frei von Kratzern, Flecken und Ausbesserungen",
  "Beschläge montiert und funktionsfähig (Scharniere, Schubladen, Schlösser)",
  "Kanten sauber verarbeitet, keine losen Stellen",
  "Fronten und Türen schließen bündig",
  "Zubehör/Kleinteile vollständig (Blenden, Griffe, Ersatzteile)",
  "Verpackung/Transportschutz für den Versand angebracht",
  "Montageanleitung bzw. Pflegehinweise beigelegt (falls vereinbart)",
];

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Projekt / Kom.-Nr.:", x: 20, endX: 74 },
    { label: "Geprüft von:", x: 78, endX: 132 },
    { label: "Datum:", x: 136, endX: 190 },
  ]);
  y += 9;

  const pruefpunkteHeight = 8 + CHECKLIST_ITEMS.length * 7;
  y = ensureRoom(doc, y, pruefpunkteHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "PRÜFPUNKTE");
  y += 8;
  CHECKLIST_ITEMS.forEach((label) => {
    drawCheckboxLabel(doc, 20, y, label);
    y += 7;
  });
  y += 2;

  const bemerkungenHeight = 6 + ruledAreaHeight(4, 6);
  y = ensureRoom(doc, y, bemerkungenHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "BEMERKUNGEN");
  y += 5;
  y = drawRuledArea(doc, { y, lines: 4, gap: 6 });
  y += 6;

  drawFieldsRow(doc, y, [
    { label: "Freigegeben durch:", x: 20, endX: 100 },
    { label: "Datum:", x: 104, endX: 190 },
  ]);

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Projekt / Kom.-Nr.:", labelPct: 12, valuePct: 21 },
        { label: "Geprüft von:", labelPct: 12, valuePct: 21 },
        { label: "Datum:", labelPct: 12, valuePct: 22 },
      ],
    ]),
    docxSectionLabel("Prüfpunkte"),
    ...CHECKLIST_ITEMS.map((label) => docxCheckboxLine([label])),
    docxSpacer(150),
    docxSectionLabel("Bemerkungen"),
    ...docxRuledLines(4),
    docxSpacer(150),
    ...docxFieldsBlock([
      [
        { label: "Freigegeben durch:", labelPct: 18, valuePct: 32 },
        { label: "Datum:", labelPct: 10, valuePct: 40 },
      ],
    ]),
  ];

  const document = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(document);
}

export async function generateEndkontrolleCheckliste() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
