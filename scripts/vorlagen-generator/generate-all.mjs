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
import { generateAufmassblatt } from "./aufmassblatt.mjs";
import { generateKundendatenblatt } from "./kundendatenblatt.mjs";
import { generateProjektuebersichtKapazitaetsplaner } from "./projektuebersicht-kapazitaetsplaner.mjs";
import { generateUrlaubsplaner } from "./urlaubsplaner.mjs";
import { generateMaterialbestellliste } from "./materialbestellliste.mjs";
import { generateBeschlagsliste } from "./beschlagsliste.mjs";
import { generateOberflaechenauftrag } from "./oberflaechenauftrag.mjs";
import { generateLieferschein } from "./lieferschein.mjs";
import { generateAbnahmeprotokoll } from "./abnahmeprotokoll.mjs";
import { generateMaengelliste } from "./maengelliste.mjs";
import { generateEndkontrolleCheckliste } from "./endkontrolle-checkliste.mjs";
import { generateReklamationsprotokoll } from "./reklamationsprotokoll.mjs";
import { generateRechnungsvorlage } from "./rechnungsvorlage.mjs";
import { generateAbwesenheitsnotizVorlagen } from "./abwesenheitsnotiz-vorlagen.mjs";
import { generateRetourenschein } from "./retourenschein.mjs";
import { generateEmailVorlagenKundenkommunikationTeil2 } from "./email-vorlagen-kundenkommunikation-teil2.mjs";
import { generateProjektordnerRegister } from "./projektordner-register.mjs";
import { generateAblagesystemBuchhaltung } from "./ablagesystem-buchhaltung.mjs";
import { generateBestaetigungElternzeit } from "./bestaetigung-elternzeit.mjs";
import { generateEinarbeitungsplan } from "./einarbeitungsplan.mjs";

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
  { name: "Aufmaßblatt", build: generateAufmassblatt, base: "aufmassblatt", editable: "docx" },
  { name: "Kundendatenblatt", build: generateKundendatenblatt, base: "kundendatenblatt", editable: "docx" },
  {
    name: "Projektübersicht / Kapazitätsplaner",
    build: generateProjektuebersichtKapazitaetsplaner,
    base: "projektuebersicht-kapazitaetsplaner",
    editable: "xlsx",
  },
  { name: "Urlaubsplaner", build: generateUrlaubsplaner, base: "urlaubsplaner", editable: "xlsx" },
  {
    name: "Materialbestellliste",
    build: generateMaterialbestellliste,
    base: "materialbestellliste",
    editable: "xlsx",
  },
  { name: "Beschlagsliste", build: generateBeschlagsliste, base: "beschlagsliste", editable: "xlsx" },
  {
    name: "Oberflächenauftrag",
    build: generateOberflaechenauftrag,
    base: "oberflaechenauftrag",
    editable: "docx",
  },
  { name: "Lieferschein", build: generateLieferschein, base: "lieferschein", editable: "docx" },
  { name: "Abnahmeprotokoll", build: generateAbnahmeprotokoll, base: "abnahmeprotokoll", editable: "docx" },
  { name: "Mängelliste", build: generateMaengelliste, base: "maengelliste", editable: "xlsx" },
  {
    name: "Endkontrolle vor Auslieferung",
    build: generateEndkontrolleCheckliste,
    base: "endkontrolle-checkliste",
    editable: "docx",
  },
  {
    name: "Reklamationsprotokoll",
    build: generateReklamationsprotokoll,
    base: "reklamationsprotokoll",
    editable: "docx",
  },
  { name: "Rechnungsvorlage", build: generateRechnungsvorlage, base: "rechnungsvorlage", editable: "docx" },
  {
    name: "Abwesenheitsnotiz-Vorlagen",
    build: generateAbwesenheitsnotizVorlagen,
    base: "abwesenheitsnotiz-vorlagen",
    editable: "docx",
  },
  { name: "Retourenschein", build: generateRetourenschein, base: "retourenschein", editable: "docx" },
  {
    name: "E-Mail-Vorlagen Kundenkommunikation Teil 2",
    build: generateEmailVorlagenKundenkommunikationTeil2,
    base: "email-vorlagen-kundenkommunikation-teil2",
    editable: "docx",
  },
  {
    name: "Projektordner-Register",
    build: generateProjektordnerRegister,
    base: "projektordner-register",
    editable: "docx",
  },
  {
    name: "Ablagesystem für Buchhaltungsunterlagen",
    build: generateAblagesystemBuchhaltung,
    base: "ablagesystem-buchhaltung",
    editable: "docx",
  },
  {
    name: "Bestätigung der Elternzeit",
    build: generateBestaetigungElternzeit,
    base: "bestaetigung-elternzeit",
    editable: "docx",
  },
  { name: "Einarbeitungsplan", build: generateEinarbeitungsplan, base: "einarbeitungsplan", editable: "docx" },
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
