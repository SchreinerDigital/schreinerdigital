// abnahmeprotokoll.mjs — ABNAHMEPROTOKOLL (PDF + Word)

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
  drawRuledArea,
  ruledAreaHeight,
  drawTable,
  tableHeight,
  docxHeader,
  docxSectionLabel,
  docxFieldsBlock,
  docxCheckboxLine,
  docxRuledLines,
  docxDataTable,
  docxSpacer,
  docxParagraph,
  HEX,
} from "./branding.mjs";

const TITLE = "ABNAHMEPROTOKOLL";
const SUBTITLE = "Fertigstellung der Arbeiten gemeinsam mit dem Kunden dokumentieren (§ 640 BGB, § 12 VOB/B)";

function buildPdf() {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const header = { title: TITLE, subtitle: SUBTITLE };
  let y = drawPdfHeader(doc, header);

  drawFieldsRow(doc, y, [
    { label: "Bauvorhaben / Projekt:", x: 20, endX: 104 },
    { label: "Datum der Abnahme:", x: 108, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Auftraggeber:", x: 20, endX: 104 },
    { label: "Auftragnehmer:", x: 108, endX: 190 },
  ]);
  y += 9;

  drawFieldsRow(doc, y, [
    { label: "Baubeginn:", x: 20, endX: 104 },
    { label: "Fertigstellung:", x: 108, endX: 190 },
  ]);
  y += 12;

  // Gegenstand der Abnahme
  const gegenstandHeight = 8 + 7 + 8 + ruledAreaHeight(3, 6) + 6;
  y = ensureRoom(doc, y, gegenstandHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "GEGENSTAND DER ABNAHME");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Gesamtleistung");
  drawCheckboxLabel(doc, 90, y, "Teilleistung (siehe Beschreibung unten)");
  y += 8;
  y = drawRuledArea(doc, { y, lines: 3, gap: 6 });
  y += 6;

  // Mängelfeststellung
  const maengelCheckHeight = 8 + 7 + 9;
  y = ensureRoom(doc, y, maengelCheckHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "MÄNGELFESTSTELLUNG");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Es wurden keine Mängel festgestellt.");
  y += 7;
  drawCheckboxLabel(doc, 20, y, "Es wurden folgende Mängel festgestellt (siehe Tabelle).");
  y += 9;

  const maengelCols = [14, 106, 50];
  const maengelRowCount = 6;
  y = ensureRoom(doc, y, tableHeight({ rowCount: maengelRowCount }), header);
  y = drawTable(doc, {
    y,
    colWidths: maengelCols,
    headers: ["Pos.", "Beschreibung des Mangels", "Frist zur Behebung"],
    rowCount: maengelRowCount,
    fontSize: 8,
  });
  y += 10;

  // Erklärung des Auftraggebers
  const erklaerungHeight = 8 + 7 + 7 + 8 + ruledAreaHeight(3, 6);
  y = ensureRoom(doc, y, erklaerungHeight, header);
  sectionLabel(doc, PAGE.marginLeft, y, "ERKLÄRUNG DES AUFTRAGGEBERS");
  y += 8;
  drawCheckboxLabel(doc, 20, y, "Die Abnahme erfolgt.");
  y += 7;
  drawCheckboxLabel(doc, 20, y, "Die Abnahme erfolgt unter Vorbehalt (siehe unten).");
  y += 7;
  drawCheckboxLabel(doc, 20, y, "Die Abnahme wird wegen wesentlicher Mängel verweigert.");
  y += 8;
  y = drawRuledArea(doc, { y, lines: 3, gap: 6 });
  y += 8;

  // Unterschriften
  y = ensureRoom(doc, y, 24, header);
  drawFieldsRow(doc, y, [{ label: "Ort, Datum:", x: 20, endX: 190 }]);
  y += 12;
  drawFieldsRow(doc, y, [
    { label: "Unterschrift Auftraggeber:", x: 20, endX: 104 },
    { label: "Unterschrift Auftragnehmer:", x: 108, endX: 190 },
  ]);
  y += 12;

  y = ensureRoom(doc, y, 6, header);
  smallNote(doc, PAGE.marginLeft, y, "Diese Vorlage ersetzt keine Rechtsberatung im Einzelfall.");

  finalizePdf(doc);
  return Buffer.from(doc.output("arraybuffer"));
}

async function buildDocx() {
  const children = [
    ...docxHeader(TITLE, SUBTITLE),
    ...docxFieldsBlock([
      [
        { label: "Bauvorhaben / Projekt:", labelPct: 20, valuePct: 30 },
        { label: "Datum der Abnahme:", labelPct: 18, valuePct: 32 },
      ],
      [
        { label: "Auftraggeber:", labelPct: 15, valuePct: 35 },
        { label: "Auftragnehmer:", labelPct: 15, valuePct: 35 },
      ],
      [
        { label: "Baubeginn:", labelPct: 15, valuePct: 35 },
        { label: "Fertigstellung:", labelPct: 15, valuePct: 35 },
      ],
    ]),
    docxSectionLabel("Gegenstand der Abnahme"),
    docxCheckboxLine(["Gesamtleistung", "Teilleistung (siehe Beschreibung unten)"]),
    docxSpacer(100),
    ...docxRuledLines(3),
    docxSpacer(150),
    docxSectionLabel("Mängelfeststellung"),
    docxCheckboxLine(["Es wurden keine Mängel festgestellt."]),
    docxCheckboxLine(["Es wurden folgende Mängel festgestellt (siehe Tabelle)."]),
    docxSpacer(100),
    docxDataTable({
      headers: ["Pos.", "Beschreibung des Mangels", "Frist zur Behebung"],
      colPcts: [8, 62, 30],
      rowCount: 6,
    }),
    docxSpacer(200),
    docxSectionLabel("Erklärung des Auftraggebers"),
    docxCheckboxLine(["Die Abnahme erfolgt."]),
    docxCheckboxLine(["Die Abnahme erfolgt unter Vorbehalt (siehe unten)."]),
    docxCheckboxLine(["Die Abnahme wird wegen wesentlicher Mängel verweigert."]),
    docxSpacer(100),
    ...docxRuledLines(3),
    docxSpacer(150),
    ...docxFieldsBlock([[{ label: "Ort, Datum:", labelPct: 20, valuePct: 80 }]]),
    ...docxFieldsBlock([
      [
        { label: "Unterschrift Auftraggeber:", labelPct: 25, valuePct: 25 },
        { label: "Unterschrift Auftragnehmer:", labelPct: 25, valuePct: 25 },
      ],
    ]),
    docxParagraph("Diese Vorlage ersetzt keine Rechtsberatung im Einzelfall.", {
      italics: true,
      size: 16,
      color: HEX.muted,
      spacingAfter: 0,
    }),
  ];

  const document = new Document({ sections: [{ children }] });
  return Packer.toBuffer(document);
}

export async function generateAbnahmeprotokoll() {
  const pdf = buildPdf();
  const docxBuf = await buildDocx();
  return { pdf, docx: docxBuf };
}
