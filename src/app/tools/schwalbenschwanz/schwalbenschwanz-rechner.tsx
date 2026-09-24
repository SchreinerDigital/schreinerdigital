"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Layers,
  ListOrdered,
  Printer,
  Ruler,
  Scissors,
  Sliders,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { num } from "@/lib/format";
import { ANGLE_PRESETS, angleToRatio, calculateAutoTailCount, calculateDovetail } from "./dovetail-calculator";
import type { CalculationSummary, DovetailParams, UnitSystem } from "./types";

// Ported from the Drive reference "Schwalbenschwanz-Rechner" (AI Studio export: App.tsx +
// components/{Header,ParameterControls,JointVisualizer,MarkingTable,PrintTemplateModal}.tsx).
// Restyled to the site's design tokens; the three.js corner view lives in its own module
// (schwalbenschwanz-3d-visualizer.tsx) so it can be loaded client-only via next/dynamic.
//
// Two bugs from the reference were fixed while porting, not carried over:
// - the tail-board 2D "Tiefe" dimension label showed the raw pin-board thickness instead
//   of the reduced half-blind gauge depth (now read from summary.gaugeDepth everywhere);
// - the print template's pin-board waste-socket polygon referenced an undefined `pts`
//   variable, which threw as soon as the print modal rendered (now uses `points`).

const ThreeDCornerVisualizer = dynamic(() => import("./schwalbenschwanz-3d-visualizer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-b-[var(--radius)] bg-surface text-sm text-ink-faint">
      3D-Ansicht wird geladen…
    </div>
  ),
});

const DEFAULT_PARAMS_MM: DovetailParams = {
  unit: "mm",
  boardWidth: 150,
  boardThickness: 19,
  pinBoardThickness: 19,
  jointType: "through",
  halfBlindLap: 5,
  angleDegrees: 7.125,
  autoTailCount: true,
  tailCount: 4,
  tailToPinRatio: 1.8,
  halfPinRatio: 0.6,
  graduated: false,
  graduationAmount: 0.25,
  minPinWidth: 2.5,
};

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-2 py-1 text-right font-mono text-xs font-bold text-ink outline-none transition-colors focus:border-accent";

// --- Header -----------------------------------------------------------------

function Header({
  unit,
  onToggleUnit,
  onOpenPrintModal,
  onReset,
}: {
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  onOpenPrintModal: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-surface p-3">
      <div className="inline-flex items-center rounded-full border border-border bg-paper p-0.5 text-xs">
        <button
          type="button"
          onClick={() => onToggleUnit("mm")}
          className={cn(
            "rounded-full px-3 py-1 font-semibold transition-colors",
            unit === "mm" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
          )}
        >
          mm
        </button>
        <button
          type="button"
          onClick={() => onToggleUnit("inch")}
          className={cn(
            "rounded-full px-3 py-1 font-semibold transition-colors",
            unit === "inch" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
          )}
        >
          Zoll (in)
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPrintModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          <Printer className="size-3.5" />
          1:1 Druckschablone
        </button>
        <button
          type="button"
          onClick={onReset}
          title="Auf Standardwerte zurücksetzen"
          className="rounded-lg border border-border bg-paper px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

// --- Parameter controls ------------------------------------------------------

function ParameterControls({
  params,
  onChange,
  onApplyPreset,
}: {
  params: DovetailParams;
  onChange: (updated: Partial<DovetailParams>) => void;
  onApplyPreset: (presetKey: string) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    unit,
    boardWidth,
    boardThickness,
    jointType,
    halfBlindLap,
    angleDegrees,
    tailCount,
    tailToPinRatio,
    halfPinRatio,
    graduated,
    graduationAmount,
  } = params;

  const unitLabel = unit === "mm" ? "mm" : "in";
  const widthStep = unit === "mm" ? 1 : 0.0625;
  const thickStep = unit === "mm" ? 0.5 : 0.03125;

  return (
    <div className="space-y-5 rounded-[var(--radius)] border border-border bg-surface p-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-bold tracking-wider text-ink-faint uppercase">Vorlagen</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "drawer", label: "Schublade" },
            { key: "cabinet", label: "Möbel-Korpus" },
            { key: "small_box", label: "Zierkasten" },
          ].map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onApplyPreset(p.key)}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="board-width-input" className="text-xs font-semibold text-ink">
              Brettbreite ({unitLabel})
            </label>
            <input
              id="board-width-input"
              type="number"
              min={unit === "mm" ? 20 : 1}
              max={unit === "mm" ? 800 : 32}
              step={widthStep}
              value={boardWidth}
              onChange={(e) => onChange({ boardWidth: Number(e.target.value) })}
              className={cn(fieldClass, "w-20")}
            />
          </div>
          <input
            type="range"
            min={unit === "mm" ? 40 : 1.5}
            max={unit === "mm" ? 400 : 16}
            step={widthStep}
            value={boardWidth}
            onChange={(e) => onChange({ boardWidth: Number(e.target.value) })}
            className="w-full accent-accent"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="board-thickness-input" className="text-xs font-semibold text-ink">
              Holzstärke ({unitLabel})
            </label>
            <input
              id="board-thickness-input"
              type="number"
              min={unit === "mm" ? 4 : 0.2}
              max={unit === "mm" ? 60 : 2.5}
              step={thickStep}
              value={boardThickness}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChange({ boardThickness: val, pinBoardThickness: val });
              }}
              className={cn(fieldClass, "w-20")}
            />
          </div>
          <input
            type="range"
            min={unit === "mm" ? 6 : 0.25}
            max={unit === "mm" ? 40 : 1.5}
            step={thickStep}
            value={boardThickness}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange({ boardThickness: val, pinBoardThickness: val });
            }}
            className="w-full accent-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="angle-select" className="text-xs font-semibold text-ink">
              Zinkenwinkel
            </label>
            <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs font-bold text-accent">
              {num(angleDegrees, 1)}° ({angleToRatio(angleDegrees)})
            </span>
          </div>
          <div className="flex items-center gap-1">
            {ANGLE_PRESETS.map((preset) => {
              const isSelected = Math.abs(angleDegrees - preset.degrees) < 0.2;
              return (
                <button
                  key={preset.ratio}
                  type="button"
                  onClick={() => onChange({ angleDegrees: preset.degrees })}
                  title={`${preset.woodType} (${num(preset.degrees, 1)}°)`}
                  className={cn(
                    "flex-1 rounded-md border py-1.5 text-center text-xs transition-colors",
                    isSelected
                      ? "border-accent bg-accent-soft font-bold text-accent"
                      : "border-border text-ink-muted hover:bg-paper",
                  )}
                >
                  {preset.ratio}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="tail-count-slider" className="text-xs font-semibold text-ink">
              Anzahl Schwalben
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={tailCount <= 1}
                onClick={() => onChange({ tailCount: Math.max(1, tailCount - 1), autoTailCount: false })}
                className="flex size-5 items-center justify-center rounded bg-paper text-xs font-bold text-ink-muted transition-colors hover:bg-border disabled:opacity-30"
              >
                −
              </button>
              <span className="px-1.5 font-mono text-xs font-bold text-ink">{tailCount}</span>
              <button
                type="button"
                disabled={tailCount >= 14}
                onClick={() => onChange({ tailCount: Math.min(14, tailCount + 1), autoTailCount: false })}
                className="flex size-5 items-center justify-center rounded bg-paper text-xs font-bold text-ink-muted transition-colors hover:bg-border disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
          <input
            id="tail-count-slider"
            type="range"
            min="1"
            max="10"
            step="1"
            value={tailCount}
            onChange={(e) => onChange({ tailCount: Number(e.target.value), autoTailCount: false })}
            className="w-full accent-accent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-semibold text-ink">Zinkungsart:</span>
        <div className="inline-flex rounded-lg border border-border bg-paper p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onChange({ jointType: "through" })}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              jointType === "through" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
            )}
          >
            Offen
          </button>
          <button
            type="button"
            onClick={() => onChange({ jointType: "half_blind" })}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              jointType === "half_blind" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
            )}
          >
            Halbverdeckt (Schublade)
          </button>
        </div>
      </div>

      {jointType === "half_blind" && (
        <div className="flex items-center justify-between rounded-lg border border-accent/25 bg-accent-soft/70 p-2.5 text-xs">
          <span className="text-ink-muted">Decksteg an der Front (Front-Lap):</span>
          <div className="flex items-center gap-1 font-mono">
            <input
              type="number"
              min={2}
              max={boardThickness - 3}
              step={0.5}
              value={halfBlindLap}
              onChange={(e) => onChange({ halfBlindLap: Number(e.target.value) })}
              className="w-14 rounded border border-border bg-paper px-2 py-0.5 text-right text-xs font-bold"
            />
            <span className="text-ink-muted">{unitLabel}</span>
          </div>
        </div>
      )}

      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between py-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="size-3.5 text-ink-faint" />
            Erweiterte Einstellungen (Verhältnis & Halbzinken)
          </span>
          {showAdvanced ? <ChevronUp className="size-3.5 text-ink-faint" /> : <ChevronDown className="size-3.5 text-ink-faint" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 border-t border-dashed border-border pt-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-muted">Verhältnis Schwalbe zu Zinke:</span>
                <span className="font-mono font-bold text-ink">{num(tailToPinRatio, 1)} : 1</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={tailToPinRatio}
                onChange={(e) => onChange({ tailToPinRatio: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-muted">Halbzinken Außenkante:</span>
                <span className="font-mono font-bold text-ink">{Math.round(halfPinRatio * 100)} %</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.9"
                step="0.05"
                value={halfPinRatio}
                onChange={(e) => onChange({ halfPinRatio: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label htmlFor="graduated-toggle" className="flex items-center gap-1.5 text-ink-muted">
                Gestufte Schwalben (nach unten breiter, Zierkasten-Stil)
              </label>
              <input
                id="graduated-toggle"
                type="checkbox"
                checked={graduated}
                onChange={(e) => onChange({ graduated: e.target.checked })}
                className="rounded text-accent focus:ring-accent"
              />
            </div>

            {graduated && (
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Stufung:</span>
                  <span className="font-mono font-bold text-ink">{Math.round(graduationAmount * 100)} %</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.05"
                  value={graduationAmount}
                  onChange={(e) => onChange({ graduationAmount: Number(e.target.value) })}
                  className="w-full accent-accent"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Joint visualizer (2D SVG + 3D tab) --------------------------------------

type ViewMode = "assembled" | "tail_board" | "pin_board" | "side_by_side";
type PinBoardSubView = "face" | "endgrain" | "both";

function JointVisualizer({
  summary,
  params,
  hoveredElementId,
  onHoverElement,
}: {
  summary: CalculationSummary;
  params: DovetailParams;
  hoveredElementId: string | null;
  onHoverElement: (id: string | null) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("tail_board");
  const [pinSubView, setPinSubView] = useState<PinBoardSubView>("face");
  const [explosionProgress, setExplosionProgress] = useState(30);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showCenterlines, setShowCenterlines] = useState(false);
  const [showWasteHatching, setShowWasteHatching] = useState(true);

  const { unit } = params;
  const { boardWidth, boardThickness, gaugeDepth } = summary;
  const unitLabel = unit === "mm" ? "mm" : "in";

  const svgWidth = 760;
  const svgHeight = viewMode === "side_by_side" || (viewMode === "pin_board" && pinSubView === "both") ? 500 : 440;
  const paddingX = 70;
  const drawWidth = svgWidth - 2 * paddingX;
  const scale = drawWidth / boardWidth;
  const scaledThickness = boardThickness * scale;
  const scaledGaugeDepth = gaugeDepth * scale;
  const boardLength = Math.min(180, Math.max(120, scaledThickness * 4));

  const renderTailBoard2D = (offsetX = paddingX, offsetY = 80, showDims = true) => {
    const currentBoardLength = showDims ? boardLength : Math.min(boardLength, 80);
    const baselineY = offsetY + scaledGaugeDepth;
    const tipY = offsetY;
    const boardEndY = baselineY + currentBoardLength;

    return (
      <g>
        <rect x={offsetX} y={baselineY} width={boardWidth * scale} height={currentBoardLength} className="fill-accent-soft stroke-ink" strokeWidth="1.5" />
        <line x1={offsetX} y1={baselineY} x2={offsetX + boardWidth * scale} y2={baselineY} stroke="var(--ink-muted)" strokeWidth="1.5" strokeDasharray="4 2" />

        {summary.elements.map((el) => {
          const isHovered = hoveredElementId === el.id;
          const leftBase = offsetX + el.leftBase * scale;
          const rightBase = offsetX + el.rightBase * scale;
          const leftTip = offsetX + el.leftTip * scale;
          const rightTip = offsetX + el.rightTip * scale;
          const points = `${leftBase},${baselineY} ${leftTip},${tipY} ${rightTip},${tipY} ${rightBase},${baselineY}`;

          if (el.type === "tail") {
            return (
              <g key={el.id} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
                <polygon
                  points={points}
                  className={isHovered ? "fill-accent stroke-ink" : "fill-accent-soft stroke-ink hover:fill-accent/40"}
                  strokeWidth={isHovered ? 2 : 1.5}
                />
                {showCenterlines && (
                  <line x1={offsetX + el.centerline * scale} y1={tipY - 6} x2={offsetX + el.centerline * scale} y2={baselineY + 16} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                )}
                <text x={offsetX + el.centerline * scale} y={offsetY + scaledGaugeDepth * 0.65} textAnchor="middle" className="pointer-events-none fill-ink text-[11px] font-medium select-none">
                  {el.label}
                </text>
              </g>
            );
          }
          return (
            <g key={el.id} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
              <polygon points={points} fill={isHovered ? "var(--border-strong)" : "var(--paper)"} stroke="var(--ink-faint)" strokeWidth="1" />
              {showWasteHatching && <polygon points={points} fill="url(#wasteHatch)" opacity={isHovered ? 0.7 : 0.4} />}
              <text x={offsetX + el.centerline * scale} y={offsetY + scaledGaugeDepth * 0.6} textAnchor="middle" className="pointer-events-none fill-red-500 text-[12px] font-bold opacity-80 select-none">
                ✕
              </text>
            </g>
          );
        })}

        {showDims && showDimensions && (
          <g>
            <line x1={offsetX} y1={boardEndY + 18} x2={offsetX + boardWidth * scale} y2={boardEndY + 18} stroke="var(--ink-faint)" strokeWidth="1" />
            <text x={offsetX + (boardWidth * scale) / 2} y={boardEndY + 32} textAnchor="middle" className="fill-ink-muted text-[11px] font-semibold">
              Breite: {num(boardWidth, 1)} {unitLabel}
            </text>
            <text x={offsetX - 20} y={(tipY + baselineY) / 2 + 3} textAnchor="end" className="fill-ink-muted text-[10px] font-medium">
              Tiefe: {num(gaugeDepth, 1)} {unitLabel}
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderPinBoardFace = (offsetX = paddingX, offsetY = 80, showDims = true) => {
    const currentBoardLength = showDims ? boardLength : Math.min(boardLength, 80);
    const baselineY = offsetY + scaledThickness;
    const tipY = offsetY;

    return (
      <g>
        {showDims && pinSubView === "both" && (
          <text x={offsetX} y={offsetY - 14} className="fill-ink text-[12px] font-bold select-none">
            2. Seite des Zinkenbretts (Breitseite • 90°-Schnitt rechtwinklig zur Brüstungslinie)
          </text>
        )}
        <rect x={offsetX} y={baselineY} width={boardWidth * scale} height={currentBoardLength} className="fill-accent-soft stroke-ink" strokeWidth="1.5" />
        <line x1={offsetX} y1={baselineY} x2={offsetX + boardWidth * scale} y2={baselineY} stroke="var(--ink-muted)" strokeWidth="1.5" strokeDasharray="4 2" />

        {summary.elements.map((el) => {
          const isHovered = hoveredElementId === el.id;
          const leftX = offsetX + el.leftTip * scale;
          const rightX = offsetX + el.rightTip * scale;
          const centerX = (leftX + rightX) / 2;
          const points = `${leftX},${baselineY} ${leftX},${tipY} ${rightX},${tipY} ${rightX},${baselineY}`;

          if (el.type === "pin" || el.type === "half_pin") {
            return (
              <g key={`face_${el.id}`} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
                <polygon points={points} className={isHovered ? "fill-accent stroke-ink" : "fill-accent-soft stroke-ink hover:fill-accent/40"} strokeWidth={isHovered ? 2 : 1.5} />
                <text x={centerX} y={offsetY + scaledThickness * 0.58} textAnchor="middle" className="pointer-events-none fill-ink text-[11px] font-medium select-none">
                  {el.label}
                </text>
                <text x={centerX} y={offsetY + scaledThickness * 0.85} textAnchor="middle" className="pointer-events-none fill-ink-muted text-[8.5px] opacity-80 select-none">
                  {num(el.tipWidth, 1)} {unitLabel}
                </text>
              </g>
            );
          }
          return (
            <g key={`face_socket_${el.id}`} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
              <polygon points={points} fill={isHovered ? "var(--border-strong)" : "var(--paper)"} stroke="var(--ink-faint)" strokeWidth="1" />
              {showWasteHatching && <polygon points={points} fill="url(#wasteHatch)" opacity={isHovered ? 0.7 : 0.4} />}
              <text x={centerX} y={offsetY + scaledThickness * 0.6} textAnchor="middle" className="pointer-events-none fill-red-500 text-[12px] font-bold opacity-80 select-none">
                ✕
              </text>
            </g>
          );
        })}

        {showDims && showDimensions && (
          <text x={offsetX - 20} y={(tipY + baselineY) / 2 + 3} textAnchor="end" className="fill-ink-muted text-[10px] font-medium">
            Tiefe: {num(boardThickness, 1)} {unitLabel}
          </text>
        )}
      </g>
    );
  };

  const renderPinBoardEndgrain = (offsetX = paddingX, offsetY = 80, showDims = true) => {
    const effectiveThick = params.pinBoardThickness || boardThickness;
    const endgrainH = Math.max(50, Math.min(85, effectiveThick * scale * 1.6));
    const topY = offsetY;
    const botY = offsetY + endgrainH;

    return (
      <g>
        {showDims && pinSubView === "both" && (
          <text x={offsetX} y={offsetY - 14} className="fill-ink text-[12px] font-bold select-none">
            1. Stirnseite des Zinkenbretts (Hirnholz • Zinkenschmiege {num(summary.angleDegrees, 1)}° über {num(effectiveThick, 1)} {unitLabel} Brettstärke)
          </text>
        )}
        <rect x={offsetX} y={topY} width={boardWidth * scale} height={endgrainH} className="fill-paper stroke-ink" strokeWidth="1.2" />

        {summary.elements.map((el) => {
          const isHovered = hoveredElementId === el.id;
          const lBase = offsetX + el.leftBase * scale;
          const rBase = offsetX + el.rightBase * scale;
          const lTip = offsetX + el.leftTip * scale;
          const rTip = offsetX + el.rightTip * scale;
          const points = `${lBase},${topY} ${rBase},${topY} ${rTip},${botY} ${lTip},${botY}`;
          const centerX = (lBase + rBase + lTip + rTip) / 4;

          if (el.type === "pin" || el.type === "half_pin") {
            return (
              <g key={`endgrain_${el.id}`} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
                <polygon points={points} className={isHovered ? "fill-accent stroke-ink" : "fill-accent-soft stroke-ink hover:fill-accent/40"} strokeWidth={isHovered ? 2 : 1.3} />
                <text x={centerX} y={topY + endgrainH * 0.45} textAnchor="middle" className="pointer-events-none fill-ink text-[10px] font-semibold select-none">
                  {el.label}
                </text>
                <text x={centerX} y={topY + endgrainH * 0.72} textAnchor="middle" className="pointer-events-none fill-ink-muted text-[8.5px] font-medium select-none">
                  {num(el.tipWidth, 1)} / {num(el.baseWidth, 1)}
                </text>
              </g>
            );
          }
          return (
            <g key={`endgrain_waste_${el.id}`} onMouseEnter={() => onHoverElement(el.id)} onMouseLeave={() => onHoverElement(null)} className="cursor-pointer">
              <polygon points={points} fill={isHovered ? "var(--border-strong)" : "var(--paper)"} stroke="#ef4444" strokeWidth="0.8" />
              {showWasteHatching && <polygon points={points} fill="url(#wasteHatch)" opacity={isHovered ? 0.7 : 0.4} />}
              <text x={centerX} y={topY + endgrainH * 0.58} textAnchor="middle" className="pointer-events-none fill-red-500 text-[12px] font-bold opacity-80 select-none">
                ✕
              </text>
            </g>
          );
        })}

        <text x={offsetX + boardWidth * scale + 10} y={topY + 12} className="fill-ink-muted text-[9.5px] font-medium select-none">
          ▲ Innenseite ({num(summary.avgPinWidthBase, 1)} {unitLabel})
        </text>
        <text x={offsetX + boardWidth * scale + 10} y={botY - 4} className="fill-ink-muted text-[9.5px] font-medium select-none">
          ▼ Außenseite ({num(summary.avgPinWidthTip, 1)} {unitLabel})
        </text>
      </g>
    );
  };

  const renderPinBoard2D = (offsetX = paddingX, offsetY = 80, showDims = true) => {
    if (pinSubView === "endgrain") return renderPinBoardEndgrain(offsetX, offsetY + 20, showDims);
    if (pinSubView === "both") {
      return (
        <g>
          {renderPinBoardEndgrain(offsetX, 50, showDims)}
          {renderPinBoardFace(offsetX, 220, showDims)}
        </g>
      );
    }
    return renderPinBoardFace(offsetX, offsetY, showDims);
  };

  const activeElement = summary.elements.find((e) => e.id === hoveredElementId);

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-paper/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5 rounded-lg bg-paper p-1">
          {(
            [
              { key: "assembled", label: "3D Eckmodell", icon: Box },
              { key: "tail_board", label: "Schwalbenbrett (2D)" },
              { key: "pin_board", label: "Zinkenbrett (2D)" },
              { key: "side_by_side", label: "Gegenüberstellung (2D)" },
            ] as { key: ViewMode; label: string; icon?: typeof Box }[]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setViewMode(tab.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                viewMode === tab.key ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
              )}
            >
              {tab.icon && <tab.icon className="size-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {viewMode !== "assembled" && (
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} className="rounded text-accent" />
              <span>Maße</span>
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input type="checkbox" checked={showCenterlines} onChange={(e) => setShowCenterlines(e.target.checked)} className="rounded text-accent" />
              <span>Mittelachsen</span>
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input type="checkbox" checked={showWasteHatching} onChange={(e) => setShowWasteHatching(e.target.checked)} className="rounded text-accent" />
              <span>Verschnitt (✕)</span>
            </label>
          </div>
        )}
      </div>

      {viewMode === "pin_board" && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-paper/60 px-4 py-2 text-xs">
          <span className="font-semibold text-ink">Ansicht Zinkenbrett:</span>
          <div className="inline-flex rounded-lg border border-border bg-paper p-0.5">
            {(
              [
                { key: "face", label: "Breitseite (90°)" },
                { key: "endgrain", label: "Hirnholz (Schmiege)" },
                { key: "both", label: "Beide Ansichten" },
              ] as { key: PinBoardSubView; label: string }[]
            ).map((sub) => (
              <button
                key={sub.key}
                type="button"
                onClick={() => setPinSubView(sub.key)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs transition-colors",
                  pinSubView === sub.key ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink-muted hover:text-ink",
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === "assembled" ? (
        <ThreeDCornerVisualizer
          summary={summary}
          params={params}
          hoveredElementId={hoveredElementId}
          onHoverElement={onHoverElement}
          explosionProgress={explosionProgress}
          onExplosionChange={setExplosionProgress}
        />
      ) : (
        <div className="relative flex min-h-[380px] w-full items-center justify-center bg-paper/40 p-2">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-auto w-full max-h-[460px] select-none">
            <defs>
              <pattern id="wasteHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.2" />
              </pattern>
            </defs>

            {viewMode === "tail_board" && renderTailBoard2D(paddingX, 80, true)}
            {viewMode === "pin_board" && renderPinBoard2D(paddingX, 80, true)}
            {viewMode === "side_by_side" && (
              <g transform="scale(0.85) translate(60, 10)">
                <text x={paddingX} y={35} className="fill-ink text-[13px] font-bold">
                  1. Schwalbenbrett (Schwalben stehen, Zwischenräume werden ausgestemmt)
                </text>
                {renderTailBoard2D(paddingX, 50, false)}
                <text x={paddingX} y={225} className="fill-ink text-[13px] font-bold">
                  2. Zinkenbrett (90°-Schnitt rechtwinklig zur Brüstung)
                </text>
                {renderPinBoardFace(paddingX, 240, false)}
              </g>
            )}
          </svg>

          {activeElement && (
            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-ink/10 bg-ink px-3.5 py-2 text-xs text-paper shadow-lg">
              <span className="font-semibold text-accent">{activeElement.label}</span>
              <span>
                Grund: <strong>{num(activeElement.baseWidth, 1)} {unitLabel}</strong>
              </span>
              <span>
                Hirnholz: <strong>{num(activeElement.tipWidth, 1)} {unitLabel}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-paper/60 px-4 py-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-ink">
            <span className="inline-block size-3 rounded-xs border border-ink bg-accent-soft" />
            Schwalben ({summary.tailCount}x)
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="inline-block size-3 rounded-xs border border-red-400 bg-paper text-center text-[8px] font-bold text-red-500">✕</span>
            Auszustemmendes Holz (Verschnitt)
          </span>
        </div>
        {summary.minPinTipWidth < 3 ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
            <AlertTriangle className="size-3.5" />
            Schmale Zinken: {num(summary.minPinTipWidth, 1)} {unitLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
            <CheckCircle2 className="size-3.5" />
            Zinkenbreite optimal ({num(summary.minPinTipWidth, 1)} {unitLabel})
          </span>
        )}
      </div>
    </div>
  );
}

// --- Marking table ------------------------------------------------------------

function MarkingTable({
  summary,
  params,
  hoveredElementId,
  onHoverElement,
}: {
  summary: CalculationSummary;
  params: DovetailParams;
  hoveredElementId: string | null;
  onHoverElement: (id: string | null) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"tail_board" | "pin_board" | "marking_list">("tail_board");
  const [showAllRows, setShowAllRows] = useState(false);

  const { unit, jointType } = params;
  const unitLabel = unit === "mm" ? "mm" : "in";
  const fmt = (val: number) => num(val, unit === "mm" ? 1 : 3);

  const tailElements = summary.elements.filter((el) => showAllRows || !el.isWasteOnTailBoard);
  const pinElements = summary.elements.filter((el) => showAllRows || !el.isWasteOnPinBoard);

  const markingPoints = useMemo(() => {
    const points: { id: string; label: string; description: string; elementId: string }[] = [];
    points.push({ id: "pt_0", label: "0.0", description: "Linke Bezugskante (Anschlag)", elementId: "half_pin_left" });
    summary.elements.forEach((el) => {
      if (el.type !== "tail") return;
      points.push({ id: `pt_${el.id}_start`, label: fmt(el.leftTip), description: `${el.label} Beginn (Hirnholz)`, elementId: el.id });
      points.push({ id: `pt_${el.id}_mid`, label: fmt((el.leftTip + el.rightTip) / 2), description: `${el.label} Mitte / Achse`, elementId: el.id });
      points.push({ id: `pt_${el.id}_end`, label: fmt(el.rightTip), description: `${el.label} Ende (Hirnholz)`, elementId: el.id });
    });
    points.push({ id: "pt_end", label: fmt(summary.boardWidth), description: "Rechte Außenkante", elementId: "half_pin_right" });
    return points;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary, unit]);

  const handleCopy = () => {
    let text = `SCHWALBENSCHWANZ-SCHNITTMASSE (Werkstatt-Notiz)\n`;
    text += `${"=".repeat(50)}\n`;
    text += `Brettbreite: ${summary.boardWidth} ${unitLabel} | Stärke: ${summary.boardThickness} ${unitLabel}\n`;
    text += `Streichmaß-Tiefe (Brüstung): ${fmt(summary.gaugeDepth)} ${unitLabel} (${jointType === "half_blind" ? "Halbverdeckt" : "Offen"})\n`;
    text += `Zinkenwinkel: ${summary.ratioString} (${num(summary.angleDegrees, 1)}°)\n`;
    text += `Aufteilung: ${summary.tailCount} Schwalben, ${summary.pinCount} Zinken + 2 Randstege\n\n`;

    text += `1. SCHWALBENBRETT (Tails - zuerst sägen):\n${"-".repeat(45)}\n`;
    summary.elements
      .filter((el) => !el.isWasteOnTailBoard)
      .forEach((el) => {
        text += `• ${el.label}: Hirnholz ${fmt(el.tipWidth)} ${unitLabel} | Schulter ${fmt(el.baseWidth)} ${unitLabel} | Position: ${fmt(el.leftTip)} bis ${fmt(el.rightTip)} ${unitLabel}\n`;
      });

    text += `\n2. ZINKENBRETT (Pins - durch übertragen):\n${"-".repeat(45)}\n`;
    summary.elements
      .filter((el) => !el.isWasteOnPinBoard)
      .forEach((el) => {
        text += `• ${el.label}: Hirnholz ${fmt(el.baseWidth)} ${unitLabel} | Schulter ${fmt(el.tipWidth)} ${unitLabel} | Position: ${fmt(el.leftTip)} bis ${fmt(el.rightTip)} ${unitLabel}\n`;
      });

    text += `\n3. ANREISSPUNKTE VON LINKER KANTE (0.0 ${unitLabel}):\n${"-".repeat(45)}\n`;
    markingPoints.forEach((pt) => {
      text += `${pt.label.padStart(6, " ")} ${unitLabel}  →  ${pt.description}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-paper/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Scissors className="size-4 shrink-0 text-accent" />
          <h3 className="text-sm font-bold text-ink">Schnitt- & Anreißmaße</h3>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-paper px-3 py-1.5 text-xs font-semibold text-ink-muted shadow-2xs transition-colors hover:bg-surface"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-600" />
              <span className="text-emerald-700">Maße kopiert!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Werkstatt-Maße kopieren</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 border-b border-border bg-paper/40 p-3.5 text-xs sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-accent uppercase">
            <Ruler className="size-3" /> Streichmaß (Tiefe)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-ink">
            {fmt(summary.gaugeDepth)} <span className="text-xs font-normal text-ink-muted">{unitLabel}</span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">Zinkenwinkel</div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-ink">{summary.ratioString}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">{summary.tailCount} Schwalben</div>
          <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-ink">
            {fmt(summary.avgTailWidthTip)} <span className="text-[11px] font-normal text-ink-muted">Kopf</span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">{summary.pinCount} Zinkenlücken</div>
          <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-ink">
            {fmt(summary.avgPinWidthBase)} <span className="text-[11px] font-normal text-ink-muted">Fuß</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 pt-3 pb-2">
        <div className="inline-flex rounded-lg bg-paper p-1 text-xs font-medium">
          <button type="button" onClick={() => setActiveTab("tail_board")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors", activeTab === "tail_board" ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink-muted hover:text-ink")}>
            <Layers className="size-3.5 text-accent" />
            <span>1. Schwalbenbrett</span>
          </button>
          <button type="button" onClick={() => setActiveTab("pin_board")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors", activeTab === "pin_board" ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink-muted hover:text-ink")}>
            <Layers className="size-3.5 text-ink-faint" />
            <span>2. Zinkenbrett</span>
          </button>
          <button type="button" onClick={() => setActiveTab("marking_list")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors", activeTab === "marking_list" ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink-muted hover:text-ink")}>
            <ListOrdered className="size-3.5 text-ink-faint" />
            <span>Anreißpunkte (Lineal)</span>
          </button>
        </div>
        {activeTab !== "marking_list" && (
          <button
            type="button"
            onClick={() => setShowAllRows(!showAllRows)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition-colors",
              showAllRows ? "border-accent/40 bg-accent-soft font-medium text-accent" : "border-border bg-paper text-ink-muted hover:bg-surface",
            )}
          >
            {showAllRows ? "Alle Schnitte & Lücken" : "Nur wesentliche Maße"}
          </button>
        )}
      </div>

      <div className="p-4">
        {activeTab === "tail_board" && (
          <TableBody
            elements={tailElements}
            isWasteKey="isWasteOnTailBoard"
            fmt={fmt}
            unitLabel={unitLabel}
            hoveredElementId={hoveredElementId}
            onHoverElement={onHoverElement}
          />
        )}
        {activeTab === "pin_board" && (
          <TableBody
            elements={pinElements}
            isWasteKey="isWasteOnPinBoard"
            fmt={fmt}
            unitLabel={unitLabel}
            hoveredElementId={hoveredElementId}
            onHoverElement={onHoverElement}
          />
        )}
        {activeTab === "marking_list" && (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-paper text-[11px] text-ink-muted">
                  <th className="w-24 px-3 py-2 text-right font-mono font-semibold">Maß ({unitLabel})</th>
                  <th className="px-3 py-2 font-semibold">Anriss-Position & Bedeutung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {markingPoints.map((pt, idx) => {
                  const isHovered = hoveredElementId === pt.elementId;
                  const isEdge = idx === 0 || idx === markingPoints.length - 1;
                  return (
                    <tr
                      key={pt.id}
                      onMouseEnter={() => onHoverElement(pt.elementId)}
                      onMouseLeave={() => onHoverElement(null)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isHovered ? "bg-accent-soft font-semibold" : isEdge ? "bg-paper/80 font-semibold text-ink" : "hover:bg-paper/50",
                      )}
                    >
                      <td className="px-3 py-2 text-right font-bold text-accent tabular-nums">{pt.label}</td>
                      <td className="px-3 py-2 font-sans text-ink-muted">{pt.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TableBody({
  elements,
  isWasteKey,
  fmt,
  unitLabel,
  hoveredElementId,
  onHoverElement,
}: {
  elements: CalculationSummary["elements"];
  isWasteKey: "isWasteOnTailBoard" | "isWasteOnPinBoard";
  fmt: (v: number) => string;
  unitLabel: string;
  hoveredElementId: string | null;
  onHoverElement: (id: string | null) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-paper text-[11px] text-ink-muted">
            <th className="px-3 py-2.5 font-semibold">Bauteil</th>
            <th className="px-3 py-2.5 text-right font-mono font-semibold">Hirnholz</th>
            <th className="px-3 py-2.5 text-right font-mono font-semibold">Schulter</th>
            <th className="px-3 py-2.5 text-right font-mono font-semibold">Mitte</th>
            <th className="px-3 py-2.5 text-right font-mono font-semibold">Position ({unitLabel})</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border font-mono">
          {elements.map((el) => {
            const isWaste = el[isWasteKey];
            const isHovered = hoveredElementId === el.id;
            return (
              <tr
                key={el.id}
                onMouseEnter={() => onHoverElement(el.id)}
                onMouseLeave={() => onHoverElement(null)}
                className={cn(
                  "cursor-pointer transition-colors",
                  isHovered ? "bg-accent-soft font-semibold" : isWaste ? "bg-paper/60 text-ink-faint" : "hover:bg-accent-soft/40",
                )}
              >
                <td className="flex items-center gap-2 px-3 py-2.5 font-sans font-medium">
                  <span className={cn("inline-block size-2 shrink-0 rounded-full", isWaste ? "bg-border-strong" : "bg-accent")} />
                  {el.label}
                  {isWaste && <span className="text-[10px] font-normal text-ink-faint">(Lücke / Ausstemmen)</span>}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-ink tabular-nums">{fmt(el.tipWidth)} {unitLabel}</td>
                <td className="px-3 py-2.5 text-right font-semibold text-ink tabular-nums">{fmt(el.baseWidth)} {unitLabel}</td>
                <td className="px-3 py-2.5 text-right text-ink-muted tabular-nums">{fmt(el.centerline)}</td>
                <td className="px-3 py-2.5 text-right text-ink-muted tabular-nums">{fmt(el.leftTip)} – {fmt(el.rightTip)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- Print template modal -----------------------------------------------------

function PrintTemplateModal({
  isOpen,
  onClose,
  summary,
  params,
}: {
  isOpen: boolean;
  onClose: () => void;
  summary: CalculationSummary;
  params: DovetailParams;
}) {
  if (!isOpen) return null;

  const { unit, boardWidth, boardThickness } = params;
  const unitLabel = unit === "mm" ? "mm" : "in";
  const widthMm = unit === "inch" ? boardWidth * 25.4 : boardWidth;
  const thickMm = unit === "inch" ? boardThickness * 25.4 : boardThickness;
  const gaugeMm = unit === "inch" ? summary.gaugeDepth * 25.4 : summary.gaugeDepth;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-ink">
              <Printer className="size-5 text-accent" />
              1:1 Druckschablone (maßstabsgetreu zum Aufkleben)
            </h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              Drucken Sie diese Schablone im Druckdialog mit „Tatsächliche Größe / 100 % Skalierung“ aus.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <Printer className="size-4" />
              Jetzt drucken
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-surface hover:text-ink">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center overflow-y-auto bg-paper/60 p-6">
          <div className="mb-6 flex w-full max-w-2xl items-start gap-2.5 rounded-xl border border-accent/25 bg-accent-soft p-3.5 text-xs text-ink">
            <AlertIcon />
            <div>
              <span className="font-bold">Drucker-Kalibrierung prüfen:</span>
              <p className="mt-0.5 text-ink-muted">
                Messen Sie nach dem Ausdruck den aufgedruckten 50-mm-Kontrollbalken mit einem Lineal nach. Stimmt das
                Maß exakt überein, können Sie die Schablone direkt mit Sprühkleber auf Ihr Stirnholz aufkleben.
              </p>
            </div>
          </div>

          <div id="printable-template" className="w-full max-w-2xl rounded-lg border border-border bg-surface p-8 shadow-md">
            <div className="mb-6 flex items-end justify-between border-b-2 border-ink pb-3">
              <div>
                <h1 className="text-lg font-black tracking-tight text-ink">SCHWALBENSCHWANZ-SCHABLONE (1:1)</h1>
                <div className="mt-1 flex gap-3 text-xs text-ink-muted">
                  <span>Breite: <strong>{boardWidth} {unitLabel}</strong></span>
                  <span>Stärke: <strong>{boardThickness} {unitLabel}</strong></span>
                  <span>Winkel: <strong>{num(summary.angleDegrees, 1)}° ({summary.ratioString})</strong></span>
                  <span>Schwalben: <strong>{summary.tailCount}</strong></span>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 font-mono text-[10px] text-ink-muted uppercase">Kontroll-Maßstab (exakt 50 mm)</div>
                <div className="relative h-3 w-[50mm] bg-ink">
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-paper" />
                  <div className="absolute top-0 bottom-0 left-[25mm] w-px bg-paper" />
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-paper" />
                </div>
              </div>
            </div>

            <PrintSection title="1. Schwalbenbrett (Stirnholz & Schulter)" widthMm={widthMm} heightMm={gaugeMm + 20}>
              {summary.elements.map((el) => {
                const lBase = unit === "inch" ? el.leftBase * 25.4 : el.leftBase;
                const rBase = unit === "inch" ? el.rightBase * 25.4 : el.rightBase;
                const lTip = unit === "inch" ? el.leftTip * 25.4 : el.leftTip;
                const rTip = unit === "inch" ? el.rightTip * 25.4 : el.rightTip;
                const points = `${lBase},${gaugeMm} ${lTip},0 ${rTip},0 ${rBase},${gaugeMm}`;
                return (
                  <PrintPolygon key={el.id} points={points} isWaste={el.type !== "tail"} label={el.type === "tail" ? el.label : undefined} labelX={(lBase + rBase + lTip + rTip) / 4} labelY={gaugeMm / 2 + 2} />
                );
              })}
            </PrintSection>

            <PrintSection title="2. Zinkenbrett (1:1 Papierschablone)" widthMm={widthMm} heightMm={thickMm + 20} className="mt-6">
              {summary.elements.map((el) => {
                const lX = unit === "inch" ? el.leftTip * 25.4 : el.leftTip;
                const rX = unit === "inch" ? el.rightTip * 25.4 : el.rightTip;
                const points = `${lX},${thickMm} ${lX},0 ${rX},0 ${rX},${thickMm}`;
                const isWood = el.type === "pin" || el.type === "half_pin";
                return (
                  <PrintPolygon key={el.id} points={points} isWaste={!isWood} label={isWood ? el.label : undefined} labelX={(lX + rX) / 2} labelY={thickMm / 2 + 2} />
                );
              })}
            </PrintSection>

            <div className="mt-6 flex justify-between border-t border-border pt-3 text-[10px] text-ink-faint">
              <span>Erstellt mit Schwalbenschwanz-Rechner</span>
              <span>1:1 Maßstab • Keine Druckerskalierung anwenden</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintSection({
  title,
  widthMm,
  heightMm,
  children,
  className,
}: {
  title: string;
  widthMm: number;
  heightMm: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-bold tracking-wider text-ink uppercase">{title}</h4>
        <span className="text-[10px] text-ink-faint">✕ = Abfall / auszustemmen</span>
      </div>
      <div className="flex justify-center border border-border-strong bg-paper p-2">
        <svg width={`${widthMm}mm`} height={`${heightMm}mm`} viewBox={`0 0 ${widthMm} ${heightMm}`} className="max-w-full">
          <line x1="0" y1={heightMm - 20} x2={widthMm} y2={heightMm - 20} stroke="#000" strokeWidth="0.5" strokeDasharray="2 1" />
          <rect x="0" y="0" width={widthMm} height={heightMm} fill="none" stroke="#000" strokeWidth="0.5" />
          {children}
        </svg>
      </div>
    </div>
  );
}

function PrintPolygon({
  points,
  isWaste,
  label,
  labelX,
  labelY,
}: {
  points: string;
  isWaste: boolean;
  label?: string;
  labelX: number;
  labelY: number;
}) {
  return (
    <g>
      <polygon points={points} fill={isWaste ? "#f3f4f6" : "#fef3c7"} stroke="#000" strokeWidth={isWaste ? "0.5" : "0.6"} />
      {isWaste ? (
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="4" fontWeight="bold" fill="#ef4444">
          ✕
        </text>
      ) : (
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="3" fontFamily="monospace" fontWeight="bold" fill="#000">
          {label}
        </text>
      )}
    </g>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

// --- Root component -----------------------------------------------------------

/** Recomputes tailCount from the current width/thickness/unit when auto mode is on, so the
 *  displayed count stays in sync without a setState-in-effect round-trip. */
function withAutoTailCount(next: DovetailParams): DovetailParams {
  if (!next.autoTailCount) return next;
  const tailCount = calculateAutoTailCount(next.boardWidth, next.boardThickness, next.unit);
  return tailCount === next.tailCount ? next : { ...next, tailCount };
}

export function SchwalbenschwanzRechner() {
  const [params, setParams] = useState<DovetailParams>(() => withAutoTailCount({ ...DEFAULT_PARAMS_MM }));
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const summary = useMemo(() => calculateDovetail(params), [params]);

  const handleToggleUnit = (newUnit: UnitSystem) => {
    if (newUnit === params.unit) return;
    if (newUnit === "inch") {
      setParams((prev) =>
        withAutoTailCount({
          ...prev,
          unit: "inch",
          boardWidth: Math.round((prev.boardWidth / 25.4) * 100) / 100,
          boardThickness: Math.round((prev.boardThickness / 25.4) * 100) / 100,
          pinBoardThickness: Math.round((prev.pinBoardThickness / 25.4) * 100) / 100,
          halfBlindLap: Math.round((prev.halfBlindLap / 25.4) * 100) / 100,
          minPinWidth: 0.1,
        }),
      );
    } else {
      setParams((prev) =>
        withAutoTailCount({
          ...prev,
          unit: "mm",
          boardWidth: Math.round(prev.boardWidth * 25.4),
          boardThickness: Math.round(prev.boardThickness * 25.4),
          pinBoardThickness: Math.round(prev.pinBoardThickness * 25.4),
          halfBlindLap: Math.round(prev.halfBlindLap * 25.4),
          minPinWidth: 2.5,
        }),
      );
    }
  };

  const handleParamChange = (updated: Partial<DovetailParams>) => {
    setParams((prev) => withAutoTailCount({ ...prev, ...updated }));
  };

  const handleApplyPreset = (presetKey: string) => {
    const isMm = params.unit === "mm";
    switch (presetKey) {
      case "drawer":
        setParams((prev) => ({
          ...prev,
          boardWidth: isMm ? 120 : 4.75,
          boardThickness: isMm ? 15 : 0.6,
          pinBoardThickness: isMm ? 18 : 0.7,
          angleDegrees: 7.125,
          jointType: "half_blind",
          halfBlindLap: isMm ? 5 : 0.2,
          tailToPinRatio: 2.0,
          halfPinRatio: 0.6,
          autoTailCount: false,
          tailCount: 3,
          graduated: false,
        }));
        break;
      case "cabinet":
        setParams((prev) => ({
          ...prev,
          boardWidth: isMm ? 200 : 8,
          boardThickness: isMm ? 20 : 0.75,
          pinBoardThickness: isMm ? 20 : 0.75,
          angleDegrees: 7.125,
          jointType: "through",
          tailToPinRatio: 1.8,
          halfPinRatio: 0.6,
          autoTailCount: false,
          tailCount: 5,
          graduated: false,
        }));
        break;
      case "small_box":
        setParams((prev) => ({
          ...prev,
          boardWidth: isMm ? 80 : 3.25,
          boardThickness: isMm ? 12 : 0.5,
          pinBoardThickness: isMm ? 12 : 0.5,
          angleDegrees: 8.13,
          jointType: "through",
          tailToPinRatio: 2.2,
          halfPinRatio: 0.5,
          autoTailCount: false,
          tailCount: 3,
          graduated: false,
        }));
        break;
    }
  };

  const handleReset = () => {
    setParams((prev) =>
      withAutoTailCount({
        ...DEFAULT_PARAMS_MM,
        unit: prev.unit,
        boardWidth: prev.unit === "mm" ? 150 : 6,
        boardThickness: prev.unit === "mm" ? 19 : 0.75,
        pinBoardThickness: prev.unit === "mm" ? 19 : 0.75,
        halfBlindLap: prev.unit === "mm" ? 5 : 0.2,
      }),
    );
  };

  return (
    <div className="space-y-6">
      <Header unit={params.unit} onToggleUnit={handleToggleUnit} onOpenPrintModal={() => setIsPrintModalOpen(true)} onReset={handleReset} />

      {summary.warnings.length > 0 && (
        <div className="rounded-[var(--radius)] border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold tracking-wide text-amber-900 uppercase">Werkstatt-Hinweis zur Zinkung</h4>
              {summary.warnings.map((w, idx) => (
                <p key={idx} className="text-xs leading-relaxed text-amber-800">
                  {w}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <ParameterControls params={params} onChange={handleParamChange} onApplyPreset={handleApplyPreset} />
        </div>
        <div className="space-y-6 lg:col-span-7">
          <JointVisualizer summary={summary} params={params} hoveredElementId={hoveredElementId} onHoverElement={setHoveredElementId} />
          <MarkingTable summary={summary} params={params} hoveredElementId={hoveredElementId} onHoverElement={setHoveredElementId} />
        </div>
      </div>

      <PrintTemplateModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} summary={summary} params={params} />
    </div>
  );
}
