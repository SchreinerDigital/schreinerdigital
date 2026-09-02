"use client";

import { useMemo, useState } from "react";
import { InfoTooltip } from "@/components/tools/info-tooltip";
import { cn } from "@/lib/cn";
import { num } from "@/lib/format";

// --- Types & Data --- (ported 1:1 from the reference calculator)

type Persona = "azubi" | "meister" | "profi";
type LoadType = "distributed" | "point";
type LimitStandard = "standard" | "shelf" | "visual";
type Status = "ok" | "warning" | "fail";

interface Material {
  id: string;
  name: string;
  category: string;
  eModul: number; // N/mm²
  density: number; // kg/m³ (approximate for self-weight)
  minE?: number;
  maxE?: number;
  description?: string;
}

interface Calculations {
  I: number;
  W: number;
  loadForceN: number;
  forceSelfN: number;
  massSelfKg: number;
  f_load: number;
  f_self: number;
  f_total: number;
  limitVal: number;
  usagePercent: number;
  status: Status;
}

const MATERIALS: Material[] = [
  // Massivholz (Europa)
  { id: "ahorn", name: "Ahorn (Bergahorn)", category: "Massivholz", eModul: 12500, density: 630, minE: 12000, maxE: 13000, description: "hart, feinporig, Möbel/Küchen" },
  { id: "birke", name: "Birke", category: "Massivholz", eModul: 12500, density: 650, minE: 12000, maxE: 13000, description: "hochwertiger Möbelbau" },
  { id: "douglasie", name: "Douglasie", category: "Massivholz", eModul: 12000, density: 510, minE: 11000, maxE: 13000, description: "zäh, fest, oft im Innenausbau" },
  { id: "esche", name: "Esche", category: "Massivholz", eModul: 13000, density: 690, minE: 12000, maxE: 14000, description: "sehr elastisch, hochwertig" },
  { id: "eiche", name: "Eiche (europäisch)", category: "Massivholz", eModul: 12000, density: 690, minE: 11000, maxE: 13000, description: "Klassiker im Möbelbau" },
  { id: "buche", name: "Buche", category: "Massivholz", eModul: 14500, density: 720, minE: 13000, maxE: 16000, description: "hohe Härte & Steifigkeit" },
  { id: "fichte", name: "Fichte / Tanne", category: "Massivholz", eModul: 11000, density: 460, minE: 10000, maxE: 12000, description: "Standard im Innenausbau" },
  { id: "kiefer", name: "Kiefer", category: "Massivholz", eModul: 10500, density: 520, minE: 9000, maxE: 11500, description: "leicht & weich, günstig" },
  { id: "laerche", name: "Lärche", category: "Massivholz", eModul: 12000, density: 590, minE: 11000, maxE: 13000, description: "sehr dauerhaft" },
  { id: "robinie", name: "Robinie", category: "Massivholz", eModul: 14000, density: 730, minE: 13000, maxE: 15000, description: "sehr hart, selten im Möbelbau" },
  { id: "kastanie", name: "Kastanie", category: "Massivholz", eModul: 10500, density: 560, minE: 10000, maxE: 11000, description: "ähnlich wie Eiche" },
  { id: "erle", name: "Erle", category: "Massivholz", eModul: 10000, density: 530, minE: 9000, maxE: 10500, description: "beliebt im Möbelbau" },
  { id: "nussbaum", name: "Nussbaum (europ.)", category: "Massivholz", eModul: 11500, density: 640, minE: 10500, maxE: 12000, description: "Premium-Möbel" },

  // Leimholzplatten
  { id: "lh_buche", name: "Leimholz Buche", category: "Leimholz", eModul: 14000, density: 720, description: "Standard im Möbelbau" },
  { id: "lh_eiche", name: "Leimholz Eiche", category: "Leimholz", eModul: 12000, density: 690, description: "sehr formstabil" },
  { id: "lh_fichte", name: "Leimholz Fichte", category: "Leimholz", eModul: 11000, density: 460, description: "häufig für Regale/Möbel" },
  { id: "lh_kiefer", name: "Leimholz Kiefer", category: "Leimholz", eModul: 10500, density: 520, description: "günstige Möbel" },
  { id: "lh_birke", name: "Leimholz Birke", category: "Leimholz", eModul: 12500, density: 650, description: "sehr geeignet für Möbel" },
  { id: "lh_ahorn", name: "Leimholz Ahorn", category: "Leimholz", eModul: 12500, density: 630, description: "hell, hochwertig" },

  // Mehrschichtplatten / 3-Schicht
  { id: "3s_fichte", name: "3-Schicht Fichte", category: "Mehrschichtplatte", eModul: 8000, density: 500, description: "gängige Bau- & Möbelplatte" },
  { id: "3s_laerche", name: "3-Schicht Lärche", category: "Mehrschichtplatte", eModul: 9000, density: 550, description: "langlebig & stabil" },
  { id: "3s_eiche", name: "3-Schicht Eiche", category: "Mehrschichtplatte", eModul: 10500, density: 700, description: "edel & sehr steif" },
  { id: "3s_kiefer", name: "3-Schicht Kiefer", category: "Mehrschichtplatte", eModul: 8500, density: 520, description: "günstig" },

  // Sperrholz / Multiplex
  { id: "tischlerplatte", name: "Tischlerplatte (Stäbchen)", category: "Sperrholz", eModul: 8000, density: 450, minE: 7000, maxE: 8500, description: "sehr biegefest für Möbelböden" },
  { id: "mpx_birke", name: "Birke Multiplex", category: "Sperrholz", eModul: 9500, density: 700, minE: 9000, maxE: 10000, description: "Premiumqualität" },
  { id: "mpx_buche", name: "Buche Multiplex", category: "Sperrholz", eModul: 10000, density: 750, description: "extrem belastbar" },
  { id: "pappel", name: "Pappelsperrholz", category: "Sperrholz", eModul: 5000, density: 450, description: "sehr leicht" },
  { id: "seekiefer", name: "Seekieferplatte", category: "Sperrholz", eModul: 7000, density: 580, minE: 6500, maxE: 7500, description: "robust & günstig" },

  // Spanplatte
  { id: "span_p1", name: "Spanplatte P1", category: "Spanplatte", eModul: 2100, density: 650, description: "Allgemeine Bauplatte" },
  { id: "span_p2", name: "Spanplatte P2", category: "Spanplatte", eModul: 2400, density: 650, minE: 2300, maxE: 2500, description: "Möbel innen (nicht tragend)" },
  { id: "span_p3", name: "Spanplatte P3", category: "Spanplatte", eModul: 2400, density: 670, description: "feuchtebeständig" },
  { id: "span_p4", name: "Spanplatte P4", category: "Spanplatte", eModul: 2500, density: 660, description: "Tragend" },
  { id: "span_p5", name: "Spanplatte P5", category: "Spanplatte", eModul: 2800, density: 680, description: "Tragend + feuchtebeständig" },
  { id: "span_p6", name: "Spanplatte P6", category: "Spanplatte", eModul: 3000, density: 700, description: "Hoch belastbar" },
  { id: "span_p7", name: "Spanplatte P7", category: "Spanplatte", eModul: 3000, density: 720, description: "Tragend + feuchtebeständig hoch" },

  // OSB
  { id: "osb1", name: "OSB/1", category: "OSB", eModul: 3000, density: 600, description: "Trockenbereich" },
  { id: "osb2", name: "OSB/2", category: "OSB", eModul: 3500, density: 600, description: "Tragend trocken" },
  { id: "osb3", name: "OSB/3", category: "OSB", eModul: 4100, density: 620, minE: 3800, maxE: 4500, description: "Standard" },
  { id: "osb4", name: "OSB/4", category: "OSB", eModul: 4750, density: 640, minE: 4500, maxE: 5000, description: "hochbelastbar" },

  // Faserplatten
  { id: "weichfaser", name: "Weichfaserplatte", category: "Faserplatten", eModul: 300, density: 250, minE: 100, maxE: 500 },
  { id: "mdf", name: "MDF", category: "Faserplatten", eModul: 2700, density: 750, description: "Mitteldichte Faserplatte" },
  { id: "hdf", name: "HDF", category: "Faserplatten", eModul: 3500, density: 850, description: "Hochdichte Faserplatte" },
  { id: "hartfaser", name: "Hartfaserplatte", category: "Faserplatten", eModul: 3000, density: 900 },

  // Sonderwerkstoffe
  { id: "hpl", name: "Compact/HPL Vollkern", category: "Sondermaterial", eModul: 9500, density: 1350, minE: 9000, maxE: 10000, description: "sehr steif" },
  { id: "aluverbund", name: "Aluverbund (Dibond)", category: "Sondermaterial", eModul: 70000, density: 1200, description: "Alu-Deckschichten" },
];

const LIMITS: Record<LimitStandard, { label: string; divisor: number; desc: string }> = {
  standard: { label: "L/200 (Regal/Lager)", divisor: 200, desc: "Funktional, sichtbare Durchbiegung möglich" },
  shelf: { label: "L/300 (Möbel Standard)", divisor: 300, desc: "Standard für Schrankböden" },
  visual: { label: "L/400 (Hochwertig)", divisor: 400, desc: "Optisch anspruchsvoll, kaum sichtbar" },
};

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";
const pillBase = "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors";

function tone(status: Status) {
  switch (status) {
    case "ok":
      return {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-400",
      };
    case "warning":
      return {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-400",
      };
    case "fail":
      return {
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
      };
  }
}

const CATEGORIES = Array.from(new Set(MATERIALS.map((m) => m.category)));

function MaterialSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-muted">Werkstoff</span>
      <select
        className={cn(fieldClass, "cursor-pointer")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {CATEGORIES.map((cat) => (
          <optgroup key={cat} label={cat}>
            {MATERIALS.filter((m) => m.category === cat).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function BeamVisualization({
  deflection,
  limit,
  isOverloaded,
  loadType,
}: {
  deflection: number;
  limit: number;
  isOverloaded: boolean;
  loadType: LoadType;
}) {
  const width = 600;
  const height = 300;
  const padding = 40;
  const beamY = 150;

  const colorPrimary = "var(--ink)";
  const colorAccent = "var(--accent)";
  const colorDanger = "#ef4444";
  const colorGhost = "var(--border-strong)";
  const colorGround = "var(--border)";

  const visualScale = limit > 0 ? 40 / limit : 1;
  const visualDeflection = Math.min(Math.max(deflection * visualScale, 0), 100);

  const startX = padding;
  const endX = width - padding;
  const midX = (startX + endX) / 2;
  const controlY = beamY + visualDeflection * 2;

  const supportSize = 14;
  const arrowY = beamY - 60;

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-paper">
      <svg width="100%" height="220" viewBox={`0 0 ${width} ${height}`}>
        <line
          x1={padding - 20}
          y1={beamY + supportSize}
          x2={width - padding + 20}
          y2={beamY + supportSize}
          stroke={colorGround}
          strokeWidth="2"
        />

        <path
          d={`M${startX} ${beamY} L${startX - supportSize} ${beamY + supportSize} L${startX + supportSize} ${beamY + supportSize} Z`}
          fill={colorPrimary}
        />
        <path
          d={`M${endX} ${beamY} L${endX - supportSize} ${beamY + supportSize} L${endX + supportSize} ${beamY + supportSize} Z`}
          fill={colorPrimary}
        />

        <line x1={startX} y1={beamY} x2={endX} y2={beamY} stroke={colorGhost} strokeDasharray="5,5" strokeWidth="2" />

        <path
          d={`M${startX} ${beamY} Q${midX} ${controlY} ${endX} ${beamY}`}
          stroke={isOverloaded ? colorDanger : colorPrimary}
          strokeWidth="6"
          fill="none"
        />

        {loadType === "point" ? (
          <g>
            <line
              x1={midX}
              y1={arrowY}
              x2={midX}
              y2={beamY + visualDeflection / 2 - 5}
              stroke={colorAccent}
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <text x={midX + 10} y={arrowY + 20} fill={colorAccent} fontSize="14" fontWeight="bold">
              F
            </text>
          </g>
        ) : (
          <g>
            <line
              x1={startX + 20}
              y1={arrowY}
              x2={startX + 20}
              y2={beamY + visualDeflection * 0.1}
              stroke={colorAccent}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1={midX}
              y1={arrowY}
              x2={midX}
              y2={beamY + visualDeflection * 0.5}
              stroke={colorAccent}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1={endX - 20}
              y1={arrowY}
              x2={endX - 20}
              y2={beamY + visualDeflection * 0.1}
              stroke={colorAccent}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line x1={startX + 20} y1={arrowY} x2={endX - 20} y2={arrowY} stroke={colorAccent} strokeWidth="1" />
            <text x={midX + 10} y={arrowY - 5} fill={colorAccent} fontSize="14" fontWeight="bold">
              q (gVL)
            </text>
          </g>
        )}

        <line x1={midX} y1={beamY} x2={midX} y2={beamY + visualDeflection} stroke={colorPrimary} strokeWidth="1" />
        <text x={midX + 5} y={beamY + visualDeflection / 2 + 5} fontSize="12" fill={colorPrimary}>
          f = {num(deflection, 2)}mm
        </text>

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colorAccent} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

export function DurchbiegungRechner() {
  const [materialId, setMaterialId] = useState("span_p2");
  const [loadType, setLoadType] = useState<LoadType>("distributed");
  const [length, setLength] = useState(800); // mm
  const [width, setWidth] = useState(500); // mm
  const [thickness, setThickness] = useState(19); // mm
  const [loadKg, setLoadKg] = useState(20); // kg
  const [useSelfWeight, setUseSelfWeight] = useState(true);
  const [limitStandard, setLimitStandard] = useState<LimitStandard>("shelf");
  const [persona, setPersona] = useState<Persona>("azubi");

  const material = useMemo(() => MATERIALS.find((m) => m.id === materialId) || MATERIALS[0], [materialId]);

  const calculations = useMemo<Calculations>(() => {
    // Flächenträgheitsmoment I = b * h³ / 12
    const I = (width * Math.pow(thickness, 3)) / 12; // mm^4
    // Widerstandsmoment W = b * h² / 6
    const W = (width * Math.pow(thickness, 2)) / 6; // mm^3

    const gravity = 9.81;
    const loadForceN = loadKg * gravity;

    const volumeM3 = (length / 1000) * (width / 1000) * (thickness / 1000);
    const massSelfKg = volumeM3 * material.density;
    const forceSelfN = useSelfWeight ? massSelfKg * gravity : 0;

    const E = material.eModul;

    let f_load = 0;
    if (loadType === "distributed") {
      // 5 * F * L³ / (384 * E * I)
      f_load = (5 * loadForceN * Math.pow(length, 3)) / (384 * E * I);
    } else {
      // Punktlast (mittig): F * L³ / (48 * E * I)
      f_load = (loadForceN * Math.pow(length, 3)) / (48 * E * I);
    }

    // Eigengewicht ist immer eine Flächenlast
    const f_self = (5 * forceSelfN * Math.pow(length, 3)) / (384 * E * I);

    const f_total = f_load + f_self;

    const limitVal = length / LIMITS[limitStandard].divisor;
    const usagePercent = (f_total / limitVal) * 100;

    let status: Status = "ok";
    if (usagePercent > 100) status = "fail";
    else if (usagePercent > 75) status = "warning";

    return { I, W, loadForceN, forceSelfN, massSelfKg, f_load, f_self, f_total, limitVal, usagePercent, status };
  }, [material, length, width, thickness, loadKg, loadType, useSelfWeight, limitStandard]);

  const getRecommendation = () => {
    if (calculations.status === "ok") return null;

    const suggestions: string[] = [];

    const idealI = calculations.I * (calculations.f_total / calculations.limitVal);
    const requiredThickness = Math.pow((12 * idealI) / width, 1 / 3);
    suggestions.push(`Dicke erhöhen auf mind. ${Math.ceil(requiredThickness)} mm.`);

    const strongerMaterials = MATERIALS.filter((m) => m.eModul > material.eModul * 1.2);
    if (strongerMaterials.length > 0) {
      const uniqueStronger = Array.from(new Set(strongerMaterials.map((m) => m.category))).slice(0, 2);
      const exampleMat = strongerMaterials.find((m) => m.category === uniqueStronger[0]);
      if (exampleMat) {
        suggestions.push(`Steiferes Material wählen: z.B. ${exampleMat.name} (E=${exampleMat.eModul}).`);
      }
    }

    if (length > 1000 && material.category.includes("Span")) {
      suggestions.push("Bei Spannweiten > 1000mm und Spanplatte ist eine Mittelwange oder Zarge dringend empfohlen.");
    } else {
      suggestions.push("Konstruktive Verstärkung: Massivholzanleimer, Zarge oder Rückwand einnuten.");
    }

    return suggestions;
  };

  const recommendations = getRecommendation();
  const statusTone = tone(calculations.status);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <MaterialSelector value={materialId} onChange={setMaterialId} />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Art der Belastung</span>
          <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
            <button
              type="button"
              onClick={() => setLoadType("distributed")}
              className={cn(
                pillBase,
                loadType === "distributed" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
              )}
            >
              Flächenlast
            </button>
            <button
              type="button"
              onClick={() => setLoadType("point")}
              className={cn(
                pillBase,
                loadType === "point" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
              )}
            >
              Punktlast
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Länge L</span>
            <div className="relative">
              <input
                type="number"
                className={fieldClass}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                mm
              </span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Tiefe b</span>
            <div className="relative">
              <input
                type="number"
                className={fieldClass}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                mm
              </span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Dicke h</span>
            <div className="relative">
              <input
                type="number"
                className={fieldClass}
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                mm
              </span>
            </div>
          </label>
        </div>

        <div>
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Nutzlast
            <InfoTooltip text="Das Gewicht, das auf den Boden gelegt wird." />
          </span>
          <div className="mb-2 flex items-center gap-3">
            <div className="relative w-28 shrink-0">
              <input
                type="number"
                className={fieldClass}
                value={loadKg}
                onChange={(e) => setLoadKg(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                kg
              </span>
            </div>
            <span className="text-sm text-ink-faint">≈ {(loadKg * 9.81).toFixed(0)} N</span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={loadKg}
            onChange={(e) => setLoadKg(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-full"
            style={{ accentColor: "var(--accent)" }}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={useSelfWeight}
            onChange={(e) => setUseSelfWeight(e.target.checked)}
            className="size-4"
            style={{ accentColor: "var(--accent)" }}
          />
          Eigengewicht berücksichtigen ({num(calculations.massSelfKg, 1)} kg)
        </label>

        <div>
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Anforderung / Grenzwert
            <InfoTooltip text={"Hier legst du fest, wie streng der Nachweis sein soll.\n• L/200: Lager/Keller (Funktional)\n• L/300: Standard Möbelbau\n• L/400: Hoher optischer Anspruch"} />
          </span>
          <select
            className={cn(fieldClass, "cursor-pointer")}
            value={limitStandard}
            onChange={(e) => setLimitStandard(e.target.value as LimitStandard)}
          >
            {Object.entries(LIMITS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label} - {val.desc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Ergebnis</h2>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wide",
              statusTone.border,
              statusTone.bg,
              statusTone.text,
            )}
          >
            {calculations.status === "ok" && "✔️ Tragfähig"}
            {calculations.status === "warning" && "⚠️ Grenzwertig"}
            {calculations.status === "fail" && "❌ Zu stark"}
          </span>
        </div>

        <BeamVisualization
          deflection={calculations.f_total}
          limit={calculations.limitVal}
          isOverloaded={calculations.status === "fail"}
          loadType={loadType}
        />

        <div
          className={cn(
            "rounded-[var(--radius)] border p-5 text-center",
            statusTone.border,
            statusTone.bg,
          )}
        >
          <div className="font-mono text-xs uppercase tracking-wider text-ink-faint">Durchbiegung</div>
          <div className={cn("mt-1.5 font-mono text-3xl font-bold", statusTone.text)}>
            {num(calculations.f_total, 2)} <span className="text-base font-normal text-ink-faint">mm</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 border-t border-border pt-4">
            <div className="flex-1 text-center">
              <div className="text-[0.68rem] uppercase tracking-wider text-ink-faint">Maximal erlaubt</div>
              <div className="mt-1 font-mono text-base font-semibold text-ink">
                {num(calculations.limitVal, 2)} mm
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 text-center">
              <div className="text-[0.68rem] uppercase tracking-wider text-ink-faint">Ausnutzung</div>
              <div className="mt-1 font-mono text-base font-semibold text-ink">
                {num(calculations.usagePercent, 0)} %
              </div>
            </div>
          </div>
        </div>

        {recommendations && (
          <div className="rounded-[var(--radius)] border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-700 dark:text-amber-400">
            <strong>💡 Handlungsempfehlung:</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="inline-flex w-full rounded-full border border-border bg-paper p-0.5">
            {(
              [
                ["azubi", "Grundlage"],
                ["meister", "Berechnung"],
                ["profi", "Erweiterte Details"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPersona(value)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  persona === value ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm leading-relaxed text-ink-muted">
            <ExplanationContent persona={persona} material={material} vals={calculations} length={length} loadType={loadType} />
          </div>
        </div>
      </div>

      {persona === "profi" && (
        <div>
          <h3 className="text-base font-semibold text-ink">Referenztabelle: Elastizitätsmodule (DIN EN)</h3>
          <div className="mt-3 overflow-x-auto rounded-[var(--radius)] border border-border">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left">
                  <th className="px-3 py-2 font-medium text-ink-muted">Material</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">E-Modul (N/mm²)</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Range (N/mm²)</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Dichte (kg/m³)</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Hinweis</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr
                    key={m.id}
                    className={cn(
                      "border-b border-border last:border-0",
                      m.id === materialId ? "bg-accent-soft" : "bg-paper",
                    )}
                  >
                    <td className="px-3 py-2 text-ink">{m.name}</td>
                    <td className="px-3 py-2 font-mono text-ink">{m.eModul}</td>
                    <td className="px-3 py-2 font-mono text-ink-faint">
                      {m.minE && m.maxE ? `${m.minE} – ${m.maxE}` : "-"}
                    </td>
                    <td className="px-3 py-2 font-mono text-ink-faint">{m.density}</td>
                    <td className="px-3 py-2 text-ink-faint">{m.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Explanation Component ---

function ExplanationContent({
  persona,
  material,
  vals,
  length,
  loadType,
}: {
  persona: Persona;
  material: Material;
  vals: Calculations;
  length: number;
  loadType: LoadType;
}) {
  if (persona === "azubi") {
    return (
      <div className="space-y-3">
        <p>
          <strong className="text-ink">Was passiert hier?</strong>
        </p>
        <p>
          Stell dir vor, der Boden biegt sich durch wie ein Lineal, wenn du in der Mitte drückst. Wir prüfen, ob
          er sich <em>zu stark</em> durchbiegt.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Du verwendest <strong className="text-ink">{material.name}</strong>.{" "}
            {material.description ? `(${material.description})` : ""}
          </li>
          <li>
            Bei {length}mm Länge biegt es sich um <strong className="text-ink">{num(vals.f_total, 2)} mm</strong>{" "}
            durch.
          </li>
          <li>
            Die Norm sagt, es darf sich maximal <strong className="text-ink">{num(vals.limitVal, 2)} mm</strong>{" "}
            biegen, damit es gut aussieht und hält.
          </li>
        </ul>
        <p>
          <strong className="text-ink">Tipp:</strong> Wenn der Wert rot ist, nimm eine dickere Platte oder eine
          Massivholzkante!
        </p>
      </div>
    );
  }

  if (persona === "meister") {
    return (
      <div className="space-y-3">
        <p>
          <strong className="text-ink">Technische Berechnung nach Euler-Bernoulli</strong>
        </p>
        <p>Die Durchbiegung f setzt sich zusammen aus der Nutzlast und dem Eigengewicht der Platte.</p>

        <div className="space-y-1 rounded-md border border-border bg-paper p-3 font-mono text-xs text-ink">
          <div>Gegeben: E = {material.eModul} N/mm²</div>
          <div>Trägheitsmoment I = b·h³/12 = {num(vals.I, 0)} mm⁴</div>
          <br />
          {loadType === "distributed" ? (
            <div>f = (5 · F · L³) / (384 · E · I)</div>
          ) : (
            <div>f = (F · L³) / (48 · E · I)</div>
          )}
        </div>

        <p className="text-xs text-ink-faint">
          Die Berechnung erfolgt gemäß den Prinzipien der DIN EN 1995-1-1 (Eurocode 5) für den
          Gebrauchstauglichkeitsnachweis (SLS). Das E-Modul für {material.name} wurde gemäß Materialtabelle
          angesetzt. Kriechverformungen (k_def) sind in dieser vereinfachten Betrachtung noch nicht enthalten.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p>
        <strong className="text-ink">Schnellcheck:</strong>{" "}
        {vals.status === "ok" ? "Konstruktion passt." : "Anpassung nötig!"}
      </p>
      <p>
        Bei einer Spannweite von {length}mm und {vals.loadForceN.toFixed(0)}N Last liegt die Durchbiegung bei{" "}
        {num(vals.f_total, 2)}mm. Grenzwert L/{Math.round(length / vals.limitVal)} wird{" "}
        {vals.status === "fail" ? "überschritten" : "eingehalten"}.
      </p>
      <p>
        <strong className="text-ink">Praxis-Alternativen:</strong>
      </p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Statt {material.name} (E={material.eModul}) evtl.{" "}
          {material.eModul < 9000 ? "Multiplex oder Leimholz" : "höhere Stärke"} nutzen.
        </li>
        <li>Rückwand einnuten erhöht die Steifigkeit signifikant (nicht im Rechner abgebildet).</li>
        <li>Bei Einlegeböden &gt; 1000mm immer Massivholzanleimer min. 40x20mm hochkant vorsehen.</li>
      </ul>
    </div>
  );
}
