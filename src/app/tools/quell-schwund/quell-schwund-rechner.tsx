"use client";

import { useMemo, useState } from "react";
import { InfoTooltip } from "@/components/tools/info-tooltip";
import { cn } from "@/lib/cn";
import { calculateWoodMovement, formatDimension, type GrainCutType } from "./calculations";
import { WOOD_SPECIES } from "./wood-species";

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm font-mono text-ink outline-none transition-colors focus:border-accent";
const pillBase = "flex-1 rounded-full px-2 py-1.5 text-center text-xs font-medium transition-colors sm:text-sm";

const GRAIN_CUTS: { value: GrainCutType; label: string }[] = [
  { value: "flat", label: "Liegende Ringe" },
  { value: "quarter", label: "Stehende Ringe" },
  { value: "rift", label: "Mischschnitt (45°)" },
];

const MOISTURE_PRESETS = [
  { label: "Winter beheizt", val: 7.0 },
  { label: "Wohnraum normal", val: 9.5 },
  { label: "Sommer feucht", val: 12.5 },
  { label: "Außen überdacht", val: 15.0 },
];

const HARDWOODS = WOOD_SPECIES.filter((s) => s.category === "hardwood");
const SOFTWOODS = WOOD_SPECIES.filter((s) => s.category === "softwood");
const TROPICALS = WOOD_SPECIES.filter((s) => s.category === "tropical");

type Unit = "mm" | "cm" | "inch";

function toDisplay(valueMm: number, unit: Unit) {
  if (unit === "cm") return Number((valueMm / 10).toFixed(1));
  if (unit === "inch") return Number((valueMm / 25.4).toFixed(2));
  return valueMm;
}

function fromDisplay(value: number, unit: Unit) {
  if (unit === "cm") return Math.round(value * 10);
  if (unit === "inch") return Math.round(value * 25.4);
  return Math.round(value);
}

function CrossSectionVisualizer({
  species,
  initialWidth,
  finalWidth,
  deltaWidth,
  initialThickness,
  deltaThickness,
  isSwelling,
  effectiveCutAngle,
  unit,
}: {
  species: (typeof WOOD_SPECIES)[number];
  initialWidth: number;
  finalWidth: number;
  deltaWidth: number;
  initialThickness: number;
  deltaThickness: number;
  isSwelling: boolean;
  effectiveCutAngle: number;
  unit: Unit;
}) {
  const exaggeration = 3;
  const svgWidth = 560;
  const svgHeight = 220;

  const baseBoxW = 320;
  const baseBoxH = Math.max(28, Math.min(75, (initialThickness / initialWidth) * baseBoxW * 2.2));

  const widthRatio = deltaWidth / initialWidth;
  const thickRatio = deltaThickness / initialThickness;
  const visualDeltaW = baseBoxW * widthRatio * exaggeration;
  const visualDeltaH = baseBoxH * thickRatio * exaggeration;

  const newBoxW = Math.max(70, baseBoxW + visualDeltaW);
  const newBoxH = Math.max(18, baseBoxH + visualDeltaH);

  const startX = (svgWidth - baseBoxW) / 2;
  const startY = (svgHeight - baseBoxH) / 2 + 12;
  const newX = (svgWidth - newBoxW) / 2;
  const newY = (svgHeight - newBoxH) / 2 + 12;

  const angle = effectiveCutAngle;

  const formatVal = (val: number) => formatDimension(val, unit);
  const formatDelta = (val: number) => {
    const sign = val > 0 ? "+" : "";
    return `${sign}${formatDimension(val, unit).replace(/^-/, "-")}`;
  };

  return (
    <div className="space-y-2">
      <span className="flex items-center text-sm font-medium text-ink-muted">
        Hirnholz-Querschnitt (Stirnseite)
        <InfoTooltip text="Zeigt das Brett von der Stirnseite mit den charakteristischen Jahresringen. Die gestrichelte Kontur markiert die Ausgangsmaße vor der Feuchteänderung, die ausgefüllte Fläche den neuen Zustand." />
      </span>

      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-paper">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block h-auto max-h-[220px] w-full select-none"
        >
          <defs>
            <pattern id="qsGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.8" />
            </pattern>
            <clipPath id="qsBoardClip">
              <rect x={newX} y={newY} width={newBoxW} height={newBoxH} rx="2" />
            </clipPath>
          </defs>

          <rect width={svgWidth} height={svgHeight} fill="url(#qsGrid)" opacity="0.65" />

          <line
            x1="20"
            y1={startY + baseBoxH / 2}
            x2={svgWidth - 20}
            y2={startY + baseBoxH / 2}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2,3"
          />

          <rect
            x={startX}
            y={startY}
            width={baseBoxW}
            height={baseBoxH}
            rx="2"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          <g clipPath="url(#qsBoardClip)">
            <rect x={newX} y={newY} width={newBoxW} height={newBoxH} fill="var(--surface-2)" stroke="none" />
            <rect x={newX} y={newY} width={newBoxW} height={newBoxH} fill={species.colorTone} opacity="0.35" />

            {angle <= 25 && (
              <g stroke="var(--ink)" strokeWidth="1.2" opacity="0.35" fill="none">
                {[0, 18, 40, 68, 100, 138, 180, 230].map((r, i) => (
                  <ellipse
                    key={i}
                    cx={newX + newBoxW / 2}
                    cy={newY + newBoxH + 85}
                    rx={r * (newBoxW / 250) + 30}
                    ry={r * 0.65 + 15}
                  />
                ))}
              </g>
            )}

            {angle >= 65 && (
              <g stroke="var(--ink)" strokeWidth="1.2" opacity="0.35" fill="none">
                {Array.from({ length: 22 }).map((_, i) => {
                  const xPos = newX + (i * newBoxW) / 21;
                  return <line key={i} x1={xPos - 3} y1={newY - 5} x2={xPos + 3} y2={newY + newBoxH + 5} />;
                })}
              </g>
            )}

            {angle > 25 && angle < 65 && (
              <g stroke="var(--ink)" strokeWidth="1.2" opacity="0.35" fill="none">
                {Array.from({ length: 24 }).map((_, i) => {
                  const offset = i * 20 - 70;
                  return (
                    <line
                      key={i}
                      x1={newX + offset}
                      y1={newY - 5}
                      x2={newX + offset + newBoxH * 1.3}
                      y2={newY + newBoxH + 5}
                    />
                  );
                })}
              </g>
            )}
          </g>

          <rect x={newX} y={newY} width={newBoxW} height={newBoxH} rx="2" fill="none" stroke="var(--ink)" strokeWidth="1.5" />

          <g className="font-mono text-[11px]">
            <line x1={newX} y1={newY - 14} x2={newX + newBoxW} y2={newY - 14} stroke="var(--accent)" strokeWidth="1.5" />
            <line x1={newX} y1={newY - 18} x2={newX} y2={newY - 10} stroke="var(--accent)" strokeWidth="1.5" />
            <line x1={newX + newBoxW} y1={newY - 18} x2={newX + newBoxW} y2={newY - 10} stroke="var(--accent)" strokeWidth="1.5" />
            <text x={svgWidth / 2} y={newY - 20} fill="var(--ink)" textAnchor="middle" className="font-mono text-xs font-bold">
              Nachher: {formatVal(finalWidth)} ({formatDelta(deltaWidth)})
            </text>
          </g>

          <g className="font-mono text-[10px]">
            <line
              x1={startX}
              y1={startY + baseBoxH + 16}
              x2={startX + baseBoxW}
              y2={startY + baseBoxH + 16}
              stroke="var(--ink-faint)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <text x={svgWidth / 2} y={startY + baseBoxH + 30} fill="var(--ink-faint)" textAnchor="middle">
              Vorher: {formatVal(initialWidth)}
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 font-mono text-xs text-ink-faint">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-3 border-b border-dashed border-border-strong" />
          <span>Gestrichelt = Vorher ({formatVal(initialWidth)})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-xs border border-ink bg-surface-2" />
          <span>Gefüllt = Nachher ({isSwelling ? "gequollen" : deltaWidth < 0 ? "geschwunden" : "unverändert"})</span>
        </div>
      </div>
    </div>
  );
}

export function QuellSchwundRechner() {
  const [unit, setUnit] = useState<Unit>("mm");
  const [speciesId, setSpeciesId] = useState("eiche");
  const [width, setWidth] = useState(150);
  const [thickness, setThickness] = useState(25);
  const [length, setLength] = useState(1000);
  const [grainCut, setGrainCut] = useState<GrainCutType>("flat");
  const [initialMC, setInitialMC] = useState(9.0);
  const [finalMC, setFinalMC] = useState(12.0);

  const species = useMemo(
    () => WOOD_SPECIES.find((s) => s.id === speciesId) ?? WOOD_SPECIES[0],
    [speciesId],
  );

  const result = useMemo(
    () =>
      calculateWoodMovement({
        speciesId,
        width,
        thickness,
        length,
        grainCut,
        initialMC,
        finalMC,
        unit,
      }),
    [speciesId, width, thickness, length, grainCut, initialMC, finalMC, unit],
  );

  const grainCutLabel = GRAIN_CUTS.find((g) => g.value === grainCut)?.label ?? "";
  const deltaMC = Number((finalMC - initialMC).toFixed(1));
  const isSwellingMC = deltaMC > 0;
  const isShrinkingMC = deltaMC < 0;
  const isShrinkingWidth = result.deltaWidth < 0;

  function handleReset() {
    setSpeciesId("eiche");
    setWidth(150);
    setThickness(25);
    setLength(1000);
    setGrainCut("flat");
    setInitialMC(9.0);
    setFinalMC(12.0);
    setUnit("mm");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-muted">
            <span className="flex items-center">
              Holzart
              <InfoTooltip
                text={`• Tangential: ${species.tangentialCoef}% je 1% Feuchte (bei liegenden Ringen, arbeitet am stärksten)\n• Radial: ${species.radialCoef}% je 1% Feuchte (bei stehenden Ringen, sehr formstabil)\n• Fasersättigung: ca. ${species.fsp}% Holzfeuchte (Holz arbeitet nur unterhalb dieses Wertes)`}
              />
            </span>
            <span className="font-mono text-[11px] text-ink-faint">
              q: tang. {species.tangentialCoef}% · rad. {species.radialCoef}%
            </span>
          </span>
          <select
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
            className={cn(fieldClass, "cursor-pointer")}
          >
            <optgroup label="Laubhölzer">
              {HARDWOODS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameDe}
                </option>
              ))}
            </optgroup>
            <optgroup label="Nadelhölzer">
              {SOFTWOODS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameDe}
                </option>
              ))}
            </optgroup>
            <optgroup label="Edel- & Überseehölzer">
              {TROPICALS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameDe}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <div>
          <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
            Faserverlauf / Jahrringlage
            <InfoTooltip text="• Liegende Ringe (Flachschnitt): Jahrringe liegen flach im Brett. Maximale Breitenbewegung, neigt zum Verwerfen.&#10;• Stehende Ringe (Riftschnitt): Jahrringe stehen senkrecht. Hohe Formstabilität, bewegt sich in der Breite nur halb so stark!&#10;• Mischschnitt (45°): schräg verlaufende Jahrringe, mittleres Schwindmaß." />
          </span>
          <div className="inline-flex w-full rounded-full border border-border bg-paper p-0.5">
            {GRAIN_CUTS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGrainCut(g.value)}
                className={cn(
                  pillBase,
                  grainCut === g.value ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-muted">Abmessungen</span>
            <div className="inline-flex rounded-md border border-border bg-paper p-0.5 font-mono text-xs">
              {(["mm", "cm", "inch"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn(
                    "rounded px-2.5 py-0.5 font-medium transition-colors",
                    unit === u ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {u === "inch" ? "in" : u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1 flex items-center text-xs font-medium text-ink-muted">
                Breite B
                <InfoTooltip
                  align="left"
                  text="Hauptbewegung quer zur Faser. Hier quillt und schwindet Massivholz am stärksten."
                />
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step={unit === "inch" ? "0.1" : "1"}
                  value={toDisplay(width, unit) || ""}
                  onChange={(e) => setWidth(fromDisplay(Math.max(1, Number(e.target.value)), unit))}
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-ink-faint">
                  {unit}
                </span>
              </div>
            </label>
            <label className="block">
              <span className="mb-1 flex items-center text-xs font-medium text-ink-muted">
                Dicke D
                <InfoTooltip text="Bauteilstärke. Ändert sich ebenfalls spürbar mit der Holzfeuchte." />
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step={unit === "inch" ? "0.05" : "1"}
                  value={toDisplay(thickness, unit) || ""}
                  onChange={(e) => setThickness(fromDisplay(Math.max(1, Number(e.target.value)), unit))}
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-ink-faint">
                  {unit}
                </span>
              </div>
            </label>
            <label className="block">
              <span className="mb-1 flex items-center text-xs font-medium text-ink-muted">
                Länge L
                <InfoTooltip
                  align="right"
                  text="In Faserrichtung arbeitet Holz kaum (nur ca. 0,01% je 1% Feuchte)."
                />
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step={unit === "inch" ? "0.5" : "1"}
                  value={toDisplay(length, unit) || ""}
                  onChange={(e) => setLength(fromDisplay(Math.max(1, Number(e.target.value)), unit))}
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-ink-faint">
                  {unit}
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
                Ausgangsfeuchte u₁
                <InfoTooltip
                  align="left"
                  text="Die Feuchte des Holzes beim Zuschnitt in der Werkstatt. Möbelholz liegt meist bei 8–10 %, getrocknetes Bauholz bei ca. 15 %."
                />
              </span>
              <div className="relative mb-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={initialMC}
                  onChange={(e) => setInitialMC(Number(e.target.value))}
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-ink-faint">%</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="0.5"
                value={initialMC}
                onChange={(e) => setInitialMC(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer rounded-full"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>

            <div>
              <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
                Zielfeuchte u₂
                <InfoTooltip
                  align="right"
                  text="Die Ausgleichsfeuchte am späteren Aufstellort. Im geheizten Winterwohnraum sinkt sie auf ca. 6–8 %, im feuchten Sommer steigt sie auf ca. 11–13 %."
                />
              </span>
              <div className="relative mb-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={finalMC}
                  onChange={(e) => setFinalMC(Number(e.target.value))}
                  className={fieldClass}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-ink-faint">%</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="0.5"
                value={finalMC}
                onChange={(e) => setFinalMC(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer rounded-full"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs text-ink-faint">Typischer Einsatzort (Ziel-Holzfeuchte u₂):</span>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {MOISTURE_PRESETS.map((p) => {
                const isSelected = Math.abs(finalMC - p.val) < 0.05;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setFinalMC(p.val)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-colors",
                      isSelected
                        ? "border-accent bg-accent font-bold text-accent-contrast"
                        : "border-border bg-paper text-ink-muted hover:border-border-strong hover:text-ink",
                    )}
                  >
                    <span className="text-xs leading-tight">{p.label}</span>
                    <span className="mt-0.5 font-mono text-[11px]">{p.val.toString().replace(".", ",")} %</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-1.5 font-mono text-xs text-ink-muted">
            <span>Feuchteänderung:</span>
            <span
              className={cn(
                "font-semibold",
                isSwellingMC ? "text-sky-700 dark:text-sky-400" : isShrinkingMC ? "text-amber-700 dark:text-amber-400" : "text-ink",
              )}
            >
              {deltaMC > 0 ? `+${deltaMC}` : deltaMC}% ({isSwellingMC ? "Quellen" : isShrinkingMC ? "Schwinden" : "keine Änderung"})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-border pt-6">
        <CrossSectionVisualizer
          species={species}
          initialWidth={result.initialWidth}
          finalWidth={result.finalWidth}
          deltaWidth={result.deltaWidth}
          initialThickness={result.initialThickness}
          deltaThickness={result.deltaThickness}
          isSwelling={result.isSwelling}
          effectiveCutAngle={result.effectiveCutAngle}
          unit={unit}
        />

        <div className="space-y-4">
          <h2 className="flex items-center text-base font-medium text-ink">
            Ergebnis
            <InfoTooltip text="Berechnet die Maßänderung aus differentiellem Schwundmaß, Jahrringlage und Feuchteänderung nach DIN 52184." />
          </h2>

          <div
            className={cn(
              "rounded-[var(--radius)] border p-4 text-center transition-colors",
              result.isSwelling
                ? "border-sky-500/30 bg-sky-500/10"
                : isShrinkingWidth
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-border bg-surface-2",
            )}
          >
            <div className="font-mono text-xs font-semibold">
              {result.isSwelling ? (
                <span className="text-sky-800 dark:text-sky-400">↑ Quellen (Brett wird breiter)</span>
              ) : isShrinkingWidth ? (
                <span className="text-amber-800 dark:text-amber-400">↓ Schwinden (Brett wird schmaler)</span>
              ) : (
                <span className="text-ink-faint">Konstant (keine Breitenänderung)</span>
              )}
            </div>

            <div
              className={cn(
                "mt-0.5 font-mono text-3xl font-bold",
                result.isSwelling ? "text-sky-900 dark:text-sky-300" : isShrinkingWidth ? "text-amber-900 dark:text-amber-300" : "text-ink",
              )}
            >
              {result.deltaWidth > 0 ? `+${result.deltaWidth.toFixed(2)}` : result.deltaWidth.toFixed(2)}{" "}
              <span className="text-sm font-normal text-ink-faint">mm</span>
            </div>

            <div className="mt-1 text-xs text-ink-muted">
              Von <strong>{formatDimension(result.initialWidth, unit)}</strong> → auf{" "}
              <strong>{formatDimension(result.finalWidth, unit)}</strong>
            </div>

            <div className="mt-3 flex items-center justify-center gap-3 border-t border-border pt-3 sm:gap-6">
              <div className="flex-1 text-center">
                <div className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Neues Endmaß</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-ink">
                  {formatDimension(result.finalWidth, unit)}
                </div>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex-1 text-center">
                <div className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Dicke</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-ink">
                  {result.deltaThickness > 0 ? `+${result.deltaThickness.toFixed(2)}` : result.deltaThickness.toFixed(2)} mm
                </div>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex-1 text-center">
                <div className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Dehnungsfuge</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-ink">
                  mind. {formatDimension(result.recommendedExpansionGap, unit)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-xs leading-relaxed text-ink-muted">
            <strong className="text-ink">💡 Praxistipp: </strong>
            {result.isSwelling ? (
              <span>
                Bei +{deltaMC}% Feuchte wächst das Brett um +{Math.abs(result.deltaWidth).toFixed(1)} mm. Plane mind.{" "}
                {formatDimension(result.recommendedExpansionGap, unit)} Dehnungsfuge ein, damit Füllungen oder Böden
                nicht klemmen.
              </span>
            ) : isShrinkingWidth ? (
              <span>
                Bei {deltaMC}% Feuchte schwindet das Brett um {result.deltaWidth.toFixed(1)} mm. Füllungen ausreichend
                tief in die Nut einsetzen und Tischplatten mit Langlöchern befestigen.
              </span>
            ) : (
              <span>Feuchte bleibt konstant – das Bauteil behält seine nominellen Maße.</span>
            )}
          </div>

          {result.fspWarning && (
            <div className="rounded-[var(--radius)] border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs leading-relaxed text-amber-900 dark:text-amber-400">
              {result.fspWarning}
            </div>
          )}

          <details className="group overflow-hidden rounded-[var(--radius)] border border-border bg-surface text-xs">
            <summary className="flex cursor-pointer select-none items-center justify-between px-3.5 py-2.5 font-mono text-ink-muted transition-colors hover:text-ink">
              <span className="font-semibold text-ink">📐 Rechenweg &amp; Formel anzeigen (für Profis)</span>
              <svg
                className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="space-y-2 border-t border-border bg-paper p-3.5 font-mono text-ink">
              <div className="font-bold text-accent">DIN 52184: ΔB = B × (q / 100) × Δu</div>
              <div className="space-y-1 text-[11px] text-ink-muted">
                <div>• Bauteilbreite B = {result.initialWidth} mm</div>
                <div>
                  • Schwundbeiwert q = {result.effectiveWidthCoef} % je 1% Feuchte ({grainCutLabel})
                </div>
                <div>
                  • Wirksame Feuchteänderung Δu = {result.effectiveDeltaMC > 0 ? `+${result.effectiveDeltaMC}` : result.effectiveDeltaMC}{" "}
                  %
                </div>
                <div>• Fasersättigungsbereich = ca. {species.fsp} %</div>
              </div>
              <div className="border-t border-border pt-2 text-xs font-bold text-ink">
                Rechnung: {result.initialWidth} mm × ({result.effectiveWidthCoef} / 100) × {result.effectiveDeltaMC} ={" "}
                {result.deltaWidth > 0 ? `+${result.deltaWidth.toFixed(2)}` : result.deltaWidth.toFixed(2)} mm
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          title="Alle Eingaben auf Standardwerte zurücksetzen"
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
          </svg>
          <span>Zurücksetzen</span>
        </button>
      </div>
    </div>
  );
}
