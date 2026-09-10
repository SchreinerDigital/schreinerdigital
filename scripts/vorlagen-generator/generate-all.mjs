// generate-all.mjs — orchestrator: builds all 12 template file-sets and writes
// them into public/downloads/. Run with: node generate-all.mjs

import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { generateAuftragszettel } from "./auftragszettel.mjs";
import { generateZeiterfassungszettel } from "./zeiterfassungszettel.mjs";
import { generateAngebotsvorlage } from "./angebotsvorlage.mjs";
import { generateGespraechsnotiz } from "./gespraechsnotiz.mjs";
import { generateMaterialMaschineMitarbeiter } from "./material-maschine-mitarbeiter.mjs";
import { generateAbtretungserklaerungVersicherung } from "./abtretungserklaerung-versicherung.mjs";
import { generateZuschnittliste } from "./zuschnittliste.mjs";
import { generateTerminplan } from "./terminplan.mjs";
import { generateBautagebericht } from "./bautagebericht.mjs";
import { generateLadecheckliste } from "./ladecheckliste.mjs";
import { generateTeambesprechungProtokoll } from "./teambesprechung-protokoll.mjs";
import { generateEmailVorlagenKundenkommunikation } from "./email-vorlagen-kundenkommunikation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../public/downloads");

const JOBS = [
  { name: "Auftragszettel", build: generateAuftragszettel, base: "auftragszettel", editable: "docx" },
  { name: "Zeiterfassungszettel", build: generateZeiterfassungszettel, base: "zeiterfassungszettel", editable: "xlsx" },
  { name: "Angebotsvorlage", build: generateAngebotsvorlage, base: "angebotsvorlage", editable: "docx" },
  { name: "Gesprächsnotiz", build: generateGespraechsnotiz, base: "gespraechsnotiz", editable: "docx" },
  {
    name: "Material-Maschine-Mitarbeiter",
    build: generateMaterialMaschineMitarbeiter,
    base: "material-maschine-mitarbeiter",
    editable: "xlsx",
  },
  {
    name: "Abtretungserklärung Versicherung",
    build: generateAbtretungserklaerungVersicherung,
    base: "abtretungserklaerung-versicherung",
    editable: "docx",
  },
  { name: "Zuschnittliste", build: generateZuschnittliste, base: "zuschnittliste", editable: "xlsx" },
  { name: "Terminplan", build: generateTerminplan, base: "terminplan", editable: "xlsx" },
  { name: "Bautagebericht", build: generateBautagebericht, base: "bautagebericht", editable: "docx" },
  { name: "Ladecheckliste", build: generateLadecheckliste, base: "ladecheckliste", editable: "docx" },
  {
    name: "Teambesprechung-Protokoll",
    build: generateTeambesprechungProtokoll,
    base: "teambesprechung-protokoll",
    editable: "docx",
  },
  {
    name: "E-Mail-Vorlagen Kundenkommunikation",
    build: generateEmailVorlagenKundenkommunikation,
    base: "email-vorlagen-kundenkommunikation",
    editable: "docx",
  },
];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Output directory: ${OUT_DIR}\n`);

  const written = [];

  for (const job of JOBS) {
    console.log(`Generating: ${job.name} ...`);
    const result = await job.build();

    const pdfPath = path.join(OUT_DIR, `${job.base}.pdf`);
    writeFileSync(pdfPath, result.pdf);
    written.push(pdfPath);

    const editableBuf = result[job.editable];
    const editablePath = path.join(OUT_DIR, `${job.base}.${job.editable}`);
    writeFileSync(editablePath, editableBuf);
    written.push(editablePath);
  }

  console.log("\nVerifying output files:");
  let allOk = true;
  for (const filePath of written) {
    const stats = statSync(filePath);
    const ok = stats.size > 0;
    if (!ok) allOk = false;
    console.log(`  ${ok ? "OK  " : "FAIL"}  ${path.basename(filePath)}  (${stats.size} bytes)`);
  }

  if (!allOk) {
    console.error("\nOne or more output files are empty. Aborting with error.");
    process.exit(1);
  }

  console.log(`\nAll ${written.length} files generated successfully.`);
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
