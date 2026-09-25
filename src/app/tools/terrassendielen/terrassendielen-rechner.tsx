"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import {
  CheckCircle,
  RotateCcw,
  Download,
  Sparkles,
  Eye,
  TrendingDown,
  Scissors,
  Layers,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { num } from "@/lib/format";
import { calculateTerrace } from "./calculator";
import { WOOD_PRESETS } from "./presets";
import { TerraceVisualizer } from "./terrassendielen-visualizer";
import type { CalculationResults, Orientation, TerraceInputs, WoodPreset } from "./types";

const DEFAULT_INPUTS: TerraceInputs = {
  length: 5.0,
  width: 4.0,
  boardWidth: 145,
  boardLength: 4.0,
  gap: 5,
  orientation: "lengthwise",
  reservePercent: 10,
  minOffcutLength: 0.3,
  joistSpacing: 45,
  screwsPerIntersection: 2,
  pricePerLinearMeter: 6.5,
  joistPricePerMeter: 3.8,
};

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm font-mono text-ink outline-none transition-colors focus:border-accent";

/* ---------------------------------------------------------------------- */
/*  Holzprofil-Schnellauswahl                                             */
/* ---------------------------------------------------------------------- */

function WoodPresetPicker({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (preset: WoodPreset) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-ink">
          <Sparkles className="size-3.5 text-accent" />
          Gängige Dielen-Profile
        </span>
        <span className="hidden sm:inline">Klick füllt Maße automatisch aus</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {WOOD_PRESETS.map((preset) => {
          const isSelected = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              className={cn(
                "rounded-lg border p-2.5 text-left text-xs transition-all",
                isSelected
                  ? "border-accent bg-accent-soft shadow-xs ring-1 ring-accent"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2/60",
              )}
            >
              <div className="truncate font-semibold text-ink">{preset.name}</div>
              <div className="mt-0.5 truncate text-[11px] text-ink-muted">{preset.subtitle}</div>
              <div className="mt-1.5 font-mono text-[11px] font-medium text-accent">
                {preset.boardWidth} mm × {preset.boardLength} m
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Eingabeformular                                                        */
/* ---------------------------------------------------------------------- */

function TerraceForm({
  inputs,
  onChange,
}: {
  inputs: TerraceInputs;
  onChange: (next: TerraceInputs) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNumberChange = (field: keyof TerraceInputs, value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    onChange({ ...inputs, [field]: isNaN(parsed) ? 0 : parsed });
  };

  const setOrientation = (orientation: Orientation) => {
    onChange({ ...inputs, orientation });
  };

  return (
    <div className="flex h-full flex-col space-y-6 rounded-[var(--radius)] border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-ink">Terrassen- &amp; Dielenmaße eingeben</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Berechnung nach den Fachregeln des Zimmerer- &amp; Schreinerhandwerks</p>
        </div>
        <div className="hidden font-mono text-xs text-ink-faint sm:block">
          Fläche: <span className="font-semibold text-ink-muted">{num(inputs.length * inputs.width, 2)} m²</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Terrassenlänge (m)</span>
          </span>
          <input
            type="number"
            step="0.05"
            min="0.5"
            max="50"
            value={inputs.length || ""}
            onChange={(e) => handleNumberChange("length", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Terrassenbreite (m)</span>
          </span>
          <input
            type="number"
            step="0.05"
            min="0.5"
            max="50"
            value={inputs.width || ""}
            onChange={(e) => handleNumberChange("width", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Sichtbare Dielenbreite (mm)</span>
          </span>
          <input
            type="number"
            step="1"
            min="40"
            max="300"
            value={inputs.boardWidth || ""}
            onChange={(e) => handleNumberChange("boardWidth", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Dielenlänge (m)</span>
            <span className="text-[11px] font-normal text-ink-faint">Lieferlänge</span>
          </span>
          <input
            type="number"
            step="0.1"
            min="1"
            max="12"
            value={inputs.boardLength || ""}
            onChange={(e) => handleNumberChange("boardLength", e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-3.5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Fuge zwischen Dielen (mm)</span>
            <span className="text-[11px] font-normal text-ink-faint">5–8 mm</span>
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            max="20"
            value={inputs.gap || ""}
            onChange={(e) => handleNumberChange("gap", e.target.value)}
            className={fieldClass}
          />
          <p className="mt-1 text-[11px] text-ink-faint">
            Reihen-Rastermaß: {inputs.boardWidth + inputs.gap} mm pro Reihe
          </p>
        </div>

        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Verlegerichtung</span>
            <span className="text-[11px] font-normal text-ink-faint">Gefälle beachten</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setOrientation("lengthwise")}
              className={cn(
                "rounded-md py-1.5 px-2 text-center text-xs font-medium transition-all",
                inputs.orientation === "lengthwise"
                  ? "bg-surface font-semibold text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              Längs ({inputs.length} m)
            </button>
            <button
              type="button"
              onClick={() => setOrientation("crosswise")}
              className={cn(
                "rounded-md py-1.5 px-2 text-center text-xs font-medium transition-all",
                inputs.orientation === "crosswise"
                  ? "bg-surface font-semibold text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              Quer ({inputs.width} m)
            </button>
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">
            {inputs.orientation === "lengthwise"
              ? `Dielen längs (${inputs.length} m), UK quer`
              : `Dielen quer (${inputs.width} m), UK längs`}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-1">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-ink-muted">Zusätzliche Reserve auf Dielen-Einkauf</label>
          <span className="rounded bg-accent-soft px-2 py-0.5 font-mono text-xs font-bold text-accent">
            +{inputs.reservePercent}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          step="1"
          value={inputs.reservePercent}
          onChange={(e) => handleNumberChange("reservePercent", e.target.value)}
          className="w-full cursor-pointer accent-accent"
        />
        <div className="flex justify-between font-mono text-[10px] text-ink-faint">
          <span>0 % (Knapp)</span>
          <span className="font-medium text-ink-muted">10 % (Empfohlen)</span>
          <span>25 % (Viele Schnitte)</span>
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between py-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-accent" />
            Erweiterte Handwerker-Parameter (Unterkonstruktion, Reststück-Grenze, Preise)
          </span>
          {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 gap-4 rounded-lg border border-border bg-paper p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">Mindest-Reststücklänge (cm)</label>
              <input
                type="number"
                step="5"
                min="15"
                max="100"
                value={Math.round(inputs.minOffcutLength * 100)}
                onChange={(e) =>
                  onChange({ ...inputs, minOffcutLength: parseFloat(e.target.value) / 100 || 0.3 })
                }
                className={cn(fieldClass, "px-2.5 py-1.5 text-xs")}
              />
              <p className="mt-1 text-[10px] text-ink-faint">Kürzere Stücke werden nicht wiederverwendet.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">Balkenabstand UK (cm)</label>
              <input
                type="number"
                step="5"
                min="25"
                max="70"
                value={inputs.joistSpacing}
                onChange={(e) => handleNumberChange("joistSpacing", e.target.value)}
                className={cn(fieldClass, "px-2.5 py-1.5 text-xs")}
              />
              <p className="mt-1 text-[10px] text-ink-faint">Nadelholz meist 45 cm, Hartholz 50 cm, WPC max. 40 cm.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">Richtpreis Diele (€ pro lfdm)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={inputs.pricePerLinearMeter || ""}
                onChange={(e) => handleNumberChange("pricePerLinearMeter", e.target.value)}
                placeholder="z. B. 6,50"
                className={cn(fieldClass, "px-2.5 py-1.5 text-xs")}
              />
              <p className="mt-1 text-[10px] text-ink-faint">Optional: für einen Kosten- &amp; Spar-Vergleich in Euro.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Vergleichskarten: Ohne vs. Mit Restnutzung                             */
/* ---------------------------------------------------------------------- */

function ComparisonCards({
  results,
  inputs,
  activeScrapMode,
  onSelectScrapMode,
}: {
  results: CalculationResults;
  inputs: TerraceInputs;
  activeScrapMode: "with" | "without";
  onSelectScrapMode: (mode: "with" | "without") => void;
}) {
  const { withoutScrap, withScrap, rowsCount, lastBoardTrimNeeded, lastBoardCutWidth, runLength, crossSpan } = results;

  const scrollToVisualizer = () => {
    document.getElementById("visualisierer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-4" id="vergleich">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/50 p-3.5 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="size-4 shrink-0 text-accent" />
          <span className="font-semibold text-ink">
            {rowsCount} Dielenreihen à {runLength.toFixed(2)} m Länge
          </span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink-muted">
            Netto-Dielenfläche: <strong className="text-ink">{results.terraceArea.toFixed(2)} m²</strong>
          </span>
        </div>
        {lastBoardTrimNeeded ? (
          <div className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] text-accent">
            <span>
              Letzte Diele: <strong>{lastBoardCutWidth} mm</strong> (Längsschnitt für exakt {crossSpan.toFixed(2)} m Breite)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="size-3.5 shrink-0" />
            <span>Volle Dielenbreite geht exakt auf (kein Längsschnitt)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Karte 1: Ohne Restnutzung */}
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-[var(--radius)] border p-5 transition-all",
            activeScrapMode === "without" ? "border-border-strong ring-2 ring-border-strong/40" : "border-border",
          )}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-ink-faint/40" />
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Klassisch / Konventionell
                </span>
                <h3 className="mt-0.5 text-lg font-bold text-ink">Ohne Reststück-Nutzung</h3>
              </div>
              <span className="rounded bg-surface-2 px-2 py-0.5 text-center text-xs text-ink-muted">Jeder Stoß neu</span>
            </div>

            <p className="mt-2 text-xs text-ink-muted">
              Jedes Teilstück wird von einer neuen vollen Diele abgeschnitten. Die anfallenden Abschnitte (
              {withoutScrap.wastedMetersPerRow.toFixed(2)} m pro Reihe) werden verworfen.
            </p>

            <div className="mt-5 space-y-3 rounded-lg border border-border bg-surface-2/40 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-ink-muted">Empfohlene Einkaufsmenge:</span>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold tabular-nums text-ink">
                    {withoutScrap.purchaseBoardsWithReserve}
                  </span>
                  <span className="ml-1 text-xs font-semibold text-ink-muted">Dielen</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-ink-muted">Gesamteinkauf (Laufmeter):</span>
                <span className="font-mono font-semibold tabular-nums text-ink-muted">
                  {withoutScrap.purchaseLinearMetersWithReserve.toFixed(1)} lfdm
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Dielenbedarf je Reihe:</span>
                <span className="font-mono tabular-nums text-ink-muted">
                  {withoutScrap.boardsPerRow} Stück ({inputs.boardLength} m Dielen)
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-border py-1">
                <span className="flex items-center gap-1 text-ink-muted">
                  <Scissors className="size-3 text-ink-faint" />
                  Reiner Verschnitt:
                </span>
                <span className="font-mono tabular-nums text-ink-muted">
                  {withoutScrap.scrapMeters.toFixed(1)} lfdm ({withoutScrap.scrapPercent.toFixed(1)}%)
                </span>
              </div>
              {inputs.pricePerLinearMeter > 0 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-ink-muted">Geschätzte Materialkosten:</span>
                  <span className="font-mono text-sm font-bold tabular-nums text-ink">
                    {withoutScrap.totalCostWithReserve.toFixed(2)} €
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectScrapMode("without");
              scrollToVisualizer();
            }}
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
              activeScrapMode === "without"
                ? "bg-ink text-paper shadow-xs"
                : "bg-surface-2 text-ink-muted hover:bg-surface-2/70",
            )}
          >
            <Eye className="size-3.5" />
            {activeScrapMode === "without" ? "Wird im Verlegeplan angezeigt" : "Diese Variante im Verlegeplan ansehen"}
          </button>
        </div>

        {/* Karte 2: Mit Restnutzung (Wilder Verband) */}
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-[var(--radius)] border-2 bg-accent-soft/40 p-5 transition-all",
            activeScrapMode === "with" ? "border-accent ring-2 ring-accent/30" : "border-accent/40",
          )}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-accent" />
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Fachgerecht &amp; nachhaltig
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-contrast">
                    Empfehlung
                  </span>
                </span>
                <h3 className="mt-0.5 text-lg font-bold text-ink">Mit Reststück-Nutzung</h3>
              </div>
              <span className="rounded border border-accent/40 bg-accent-soft px-2 py-0.5 text-center text-xs font-semibold text-accent">
                Wilder Verband
              </span>
            </div>

            <p className="mt-2 text-xs text-ink-muted">
              Der saubere Abschnitt am Reihenende wird als Anfangsstück der nächsten Reihe verwendet (Mindestlänge{" "}
              {Math.round(inputs.minOffcutLength * 100)} cm). Reduziert Verschnitt und spart bares Geld!
            </p>

            <div className="mt-5 space-y-3 rounded-lg border border-accent/30 bg-surface p-4 shadow-2xs">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-ink-muted">Empfohlene Einkaufsmenge:</span>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold tabular-nums text-accent">
                    {withScrap.purchaseBoardsWithReserve}
                  </span>
                  <span className="ml-1 text-xs font-semibold text-accent">Dielen</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-ink-muted">Gesamteinkauf (Laufmeter):</span>
                <span className="font-mono font-semibold tabular-nums text-ink">
                  {withScrap.purchaseLinearMetersWithReserve.toFixed(1)} lfdm
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Effektiver Verschnitt:</span>
                <span className="font-mono font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                  nur {withScrap.scrapMeters.toFixed(1)} lfdm ({withScrap.scrapPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-400">
                <TrendingDown className="size-4 text-emerald-700 dark:text-emerald-400" />
                <span>Deine Ersparnis durch Restnutzung:</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-emerald-200/60 pt-2 font-mono text-xs dark:border-emerald-900/40">
                <div>
                  <span className="block text-[11px] text-emerald-800 dark:text-emerald-500">Eingesparte Dielen:</span>
                  <strong className="text-sm tabular-nums text-emerald-900 dark:text-emerald-300">
                    {withScrap.savingsBoards > 0 ? `-${withScrap.savingsBoards} Dielen` : "0 Dielen"}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-emerald-800 dark:text-emerald-500">Eingesparte Laufmeter:</span>
                  <strong className="text-sm tabular-nums text-emerald-900 dark:text-emerald-300">
                    {withScrap.savingsLinearMeters > 0 ? `-${withScrap.savingsLinearMeters.toFixed(1)} lfdm` : "0 m"}
                  </strong>
                </div>
              </div>
              {inputs.pricePerLinearMeter > 0 && withScrap.savingsCost > 0 && (
                <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-500">
                  Geldersparnis: <strong className="font-mono text-xs text-emerald-950 dark:text-emerald-300">ca. {withScrap.savingsCost.toFixed(2)} €</strong>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectScrapMode("with");
              scrollToVisualizer();
            }}
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
              activeScrapMode === "with"
                ? "bg-accent text-accent-contrast shadow-xs"
                : "border border-accent/40 bg-accent-soft text-accent hover:bg-accent-soft/70",
            )}
          >
            <Eye className="size-3.5" />
            {activeScrapMode === "with" ? "Wird im Verlegeplan angezeigt" : "Diese Variante im Verlegeplan ansehen"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Stückliste / Materialauszug                                           */
/* ---------------------------------------------------------------------- */

function MaterialBill({
  results,
  inputs,
  activeScrapMode,
  onPrint,
  isGenerating,
}: {
  results: CalculationResults;
  inputs: TerraceInputs;
  activeScrapMode: "with" | "without";
  onPrint: () => void;
  isGenerating: boolean;
}) {
  const { withoutScrap, withScrap, substructure, fastening } = results;
  const active = activeScrapMode === "with" ? withScrap : withoutScrap;

  return (
    <div className="space-y-5 rounded-[var(--radius)] border border-border bg-surface p-5 sm:p-6" id="einkaufsliste">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-ink">
            <ShoppingCart className="size-4 text-accent" />
            Komplette Einkaufsliste &amp; Materialbedarf
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">Dielen, Unterkonstruktion, Schrauben und Zubehör für dein Projekt</p>
        </div>
        <button
          type="button"
          onClick={onPrint}
          disabled={isGenerating}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent shadow-2xs transition-colors hover:bg-accent-soft/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-3.5" />
          {isGenerating ? "Generiere PDF…" : "Als PDF drucken"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-2/60 font-semibold text-ink-muted">
            <tr>
              <th className="px-3 py-2.5">Position / Material</th>
              <th className="px-3 py-2.5">Spezifikation</th>
              <th className="px-3 py-2.5 text-right">Netto-Bedarf</th>
              <th className="px-3 py-2.5 text-right">Einkaufsempfehlung (+{inputs.reservePercent}%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-accent-soft/30">
              <td className="px-3 py-3 font-semibold text-ink">
                Terrassendielen (mit Resteverwertung)
                <span className="mt-0.5 block text-[11px] font-normal text-accent">◆ Handwerker-Empfehlung: Wilder Verband</span>
              </td>
              <td className="px-3 py-3 font-mono text-ink-muted">
                {inputs.boardWidth} mm Breite × {inputs.boardLength} m Länge
              </td>
              <td className="px-3 py-3 text-right font-mono tabular-nums text-ink-muted">
                {withScrap.totalBoards} Stk ({withScrap.totalLinearMeters.toFixed(1)} m)
              </td>
              <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-ink">
                {withScrap.purchaseBoardsWithReserve} Stück ({withScrap.purchaseLinearMetersWithReserve.toFixed(1)} lfdm)
              </td>
            </tr>

            <tr className="text-ink-faint">
              <td className="px-3 py-3">
                Terrassendielen (ohne Resteverwertung)
                <span className="mt-0.5 block text-[11px]">Alternative: Jeder Stoß mit neuer Diele</span>
              </td>
              <td className="px-3 py-3 font-mono">
                {inputs.boardWidth} mm Breite × {inputs.boardLength} m Länge
              </td>
              <td className="px-3 py-3 text-right font-mono tabular-nums">
                {withoutScrap.totalBoards} Stk ({withoutScrap.totalLinearMeters.toFixed(1)} m)
              </td>
              <td className="px-3 py-3 text-right font-mono font-semibold tabular-nums text-ink-muted">
                {withoutScrap.purchaseBoardsWithReserve} Stück ({withoutScrap.purchaseLinearMetersWithReserve.toFixed(1)} lfdm)
              </td>
            </tr>

            <tr>
              <td className="px-3 py-3 font-semibold text-ink">
                Unterkonstruktionsbalken (UK)
                <span className="mt-0.5 block text-[11px] font-normal text-ink-faint">
                  z. B. Hartholz oder Alu 45×70 mm ({substructure.spacingCm} cm Raster)
                </span>
              </td>
              <td className="px-3 py-3 font-mono text-ink-muted">{substructure.joistLength.toFixed(2)} m Länge je Träger</td>
              <td className="px-3 py-3 text-right font-mono tabular-nums text-ink-muted">{substructure.joistCount} Balken</td>
              <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-ink">
                {substructure.joistCount} Balken ({substructure.totalJoistMeters.toFixed(1)} lfdm)
              </td>
            </tr>

            <tr>
              <td className="px-3 py-3 font-semibold text-ink">
                Terrassenschrauben (Edelstahl A2/A4)
                <span className="mt-0.5 block text-[11px] font-normal text-ink-faint">2 Schrauben je Kreuzungspunkt Diele / UK</span>
              </td>
              <td className="px-3 py-3 text-ink-muted">z. B. 5,0 × 50/60 mm mit Bohrspitze</td>
              <td className="px-3 py-3 text-right font-mono tabular-nums text-ink-muted">{fastening.screwCount} Stück</td>
              <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-ink">
                {fastening.screwPackages} Packung(en) ({fastening.screwPackages * 200} Stück)
              </td>
            </tr>

            <tr>
              <td className="px-3 py-3 font-semibold text-ink">
                Gummigranulatpads (Terrassenpads)
                <span className="mt-0.5 block text-[11px] font-normal text-ink-faint">Unterlage für UK zum Untergrund (Holzschutz &amp; Entwässerung)</span>
              </td>
              <td className="px-3 py-3 text-ink-muted">8 mm oder 10 mm Stärke</td>
              <td className="px-3 py-3 text-right font-mono tabular-nums text-ink-muted">{substructure.padCount} Stück</td>
              <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-ink">
                ca. {Math.ceil(substructure.padCount * 1.05)} Stück
              </td>
            </tr>

            <tr>
              <td className="px-3 py-3 font-semibold text-ink">
                Fugenabstandshalter
                <span className="mt-0.5 block text-[11px] font-normal text-ink-faint">Sichern gleichmäßige {inputs.gap} mm Fugen &amp; Hinterlüftung</span>
              </td>
              <td className="px-3 py-3 font-mono text-ink-muted">{inputs.gap} mm Fugenbreite</td>
              <td className="px-3 py-3 text-right font-mono tabular-nums text-ink-muted">{fastening.spacerCount} Stück</td>
              <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-ink">{fastening.spacerCount} Stück</td>
            </tr>
          </tbody>
        </table>
      </div>

      {activeScrapMode === "with" && withScrap.savingsBoards > 0 && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
          <strong>Hinweis zum gewählten Verband:</strong> Durch die Resteverwertung (Wilder Verband) sparst du gegenüber dem
          starren Verlegen <strong>{active === withScrap ? withScrap.savingsBoards : 0} Dielen ({withScrap.savingsLinearMeters.toFixed(1)} lfdm Holz)</strong> ein!
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Branded PDF-Ausdruck: Standarddesign der Seite                         */
/* ---------------------------------------------------------------------- */

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

let brandFontBase64Cache: string | null = null;

async function registerBrandFont(doc: jsPDF) {
  if (!brandFontBase64Cache) {
    const res = await fetch("/fonts/SpaceGrotesk-Bold.ttf");
    brandFontBase64Cache = arrayBufferToBase64(await res.arrayBuffer());
  }
  doc.addFileToVFS("SpaceGrotesk-Bold.ttf", brandFontBase64Cache);
  doc.addFont("SpaceGrotesk-Bold.ttf", "SpaceGrotesk", "bold");
}

const PDF_INK: [number, number, number] = [27, 23, 18];
const PDF_MUTED: [number, number, number] = [108, 98, 82];
const PDF_MUTED_LIGHT: [number, number, number] = [146, 135, 119];
const PDF_BORDER: [number, number, number] = [230, 221, 206];
const PDF_ACCENT: [number, number, number] = [255, 122, 26];
const PDF_ACCENT_SOFT: [number, number, number] = [254, 243, 199];
const PDF_JOIST: [number, number, number] = [100, 116, 139];

async function generateTerracePdf(
  inputs: TerraceInputs,
  results: CalculationResults,
  activeScrapMode: "with" | "without",
): Promise<void> {
  const { substructure, fastening, rowsCount, runLength, crossSpan } = results;
  const active = activeScrapMode === "with" ? results.withScrap : results.withoutScrap;
  const activeRows = active.simulatedRows;
  const isLengthwise = inputs.orientation === "lengthwise";

  const pageMargin = 18;
  const pageWidth = 210;
  const contentWidth = pageWidth - 2 * pageMargin;
  const rightEdge = pageMargin + contentWidth;

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  await registerBrandFont(doc);

  // --- 1. Kopfzeile: Wortmarke + Lineal-Deko + Datums-Badge ---
  doc.setFont("SpaceGrotesk", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...PDF_INK);
  const brandWidth = doc.getTextWidth("schreiner");
  const domainWidth = doc.getTextWidth(".digital");
  doc.text("schreiner", pageMargin, 18);
  doc.setTextColor(...PDF_ACCENT);
  doc.text(".digital", pageMargin + brandWidth, 18);

  const rulerX = pageMargin + brandWidth + 0.3;
  const rulerWidth = domainWidth - 0.3;
  doc.setDrawColor(...PDF_INK);
  doc.setLineWidth(0.35);
  doc.rect(rulerX, 20, rulerWidth, 2.8, "D");
  doc.setLineWidth(0.25);
  for (let t = 0; t <= 10; t++) {
    const tickX = rulerX + (rulerWidth / 10) * t;
    let tickHeight = 0.7;
    if (t === 0 || t === 10) tickHeight = 0;
    else if (t === 5) tickHeight = 1.4;
    else if (t % 2 === 0) tickHeight = 1.0;
    if (tickHeight > 0) doc.line(tickX, 20, tickX, 20 + tickHeight);
  }

  doc.setFillColor(242, 237, 228);
  doc.setDrawColor(...PDF_BORDER);
  doc.roundedRect(rightEdge - 62, 12.5, 62, 10, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text("HOLZTECHNIK", rightEdge - 59, 16.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_MUTED);
  doc.text(`Datum: ${new Date().toLocaleDateString("de-DE")}`, rightEdge - 4, 16.8, { align: "right" });

  doc.setDrawColor(...PDF_BORDER);
  doc.setLineWidth(0.4);
  doc.line(pageMargin, 25.5, rightEdge, 25.5);

  // --- 2. Titel ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...PDF_INK);
  doc.text("TERRASSENBAU-AUSZUG: VERLEGEPLAN & MATERIALLISTE", pageMargin, 33.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...PDF_MUTED);
  doc.text(
    activeScrapMode === "with" ? "Dargestellte Verlegeart: Wilder Verband (mit Resteverwertung)" : "Dargestellte Verlegeart: Klassischer Stoß (ohne Resteverwertung)",
    pageMargin,
    38,
  );

  // --- 3. Parameter-Info-Badges (eingestellte Maße) ---
  const badgeY1 = 42;
  const badgeH = 8.5;
  const badgeGap = 3;
  const colW = (contentWidth - 2 * badgeGap) / 3;
  const badgesRow1: [string, string][] = [
    ["Terrassenmaß", `${num(inputs.length, 2)} × ${num(inputs.width, 2)} m`],
    ["Dielen", `${inputs.boardWidth} mm × ${inputs.boardLength} m`],
    ["Fuge / Verlegerichtung", `${inputs.gap} mm · ${isLengthwise ? "Längs" : "Quer"}`],
  ];
  const badgesRow2: [string, string][] = [
    ["Fläche", `${num(results.terraceArea, 2)} m²`],
    ["Dielenreihen", `${rowsCount} Reihen`],
    ["UK-Balkenabstand", `${substructure.spacingCm} cm`],
  ];
  [badgesRow1, badgesRow2].forEach((row, rowIdx) => {
    const y = badgeY1 + rowIdx * (badgeH + 2.5);
    row.forEach(([label, value], i) => {
      const x = pageMargin + i * (colW + badgeGap);
      doc.setFillColor(250, 248, 244);
      doc.setDrawColor(...PDF_BORDER);
      doc.roundedRect(x, y, colW, badgeH, 1.5, 1.5, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(...PDF_MUTED);
      doc.text(label, x + 3, y + 3.4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...PDF_INK);
      doc.text(value, x + 3, y + 6.7);
    });
  });

  // --- 4. Verlegeplan-Diagramm (Dielen + UK) ---
  const diagramTitleY = badgeY1 + 2 * (badgeH + 2.5) + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_INK);
  doc.text("MASSSTABSGETREUER VERLEGEPLAN (DIELEN + UNTERKONSTRUKTION)", pageMargin, diagramTitleY);

  const diagramBoxY = diagramTitleY + 3;
  const diagramBoxH = 78;
  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(...PDF_BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageMargin, diagramBoxY, contentWidth, diagramBoxH, 2, 2, "FD");

  const drawPadTop = 14;
  const drawPadBottom = 12;
  const drawPadLeft = 14;
  const drawPadRight = 10;
  const drawAreaW = contentWidth - drawPadLeft - drawPadRight;
  const drawAreaH = diagramBoxH - drawPadTop - drawPadBottom;
  const drawScale = Math.min(drawAreaW / runLength, drawAreaH / crossSpan);
  const drawOriginX = pageMargin + drawPadLeft;
  const drawOriginY = diagramBoxY + drawPadTop;

  // Terrassen-Rechteck
  doc.setDrawColor(...PDF_INK);
  doc.setLineWidth(0.3);
  doc.rect(drawOriginX, drawOriginY, runLength * drawScale, crossSpan * drawScale, "D");

  // Unterkonstruktion (Strichlinien)
  const joistSpacingM = Math.max(0.2, inputs.joistSpacing / 100);
  const joistPositions: number[] = [];
  for (let pos = 0; pos <= runLength + 0.05; pos += joistSpacingM) {
    joistPositions.push(Math.min(pos, runLength));
  }
  if (joistPositions[joistPositions.length - 1] < runLength - 0.05) joistPositions.push(runLength);
  doc.setDrawColor(...PDF_JOIST);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.4, 1], 0);
  joistPositions.forEach((pos) => {
    const jx = drawOriginX + pos * drawScale;
    doc.line(jx, drawOriginY, jx, drawOriginY + crossSpan * drawScale);
  });
  doc.setLineDashPattern([], 0);

  // Dielenreihen
  const boardWidthM = inputs.boardWidth / 1000;
  const gapM = inputs.gap / 1000;
  const rowHeightPx = boardWidthM * drawScale;
  const gapPx = gapM * drawScale;
  activeRows.forEach((row) => {
    const ry = drawOriginY + row.rowIndex * (rowHeightPx + gapPx);
    const isLastRow = row.rowIndex === rowsCount - 1;
    const currentBoardHeight =
      isLastRow && results.lastBoardTrimNeeded ? (results.lastBoardCutWidth / 1000) * drawScale : rowHeightPx;

    row.pieces.forEach((piece) => {
      const px = drawOriginX + piece.startX * drawScale;
      const pWidth = piece.length * drawScale;
      const isReused = piece.isOffcut && activeScrapMode === "with";
      const pieceFill: [number, number, number] = isReused ? PDF_ACCENT_SOFT : [255, 255, 255];
      doc.setFillColor(...pieceFill);
      doc.setDrawColor(...PDF_INK);
      doc.setLineWidth(0.2);
      doc.rect(px, ry, pWidth, currentBoardHeight, "FD");
    });
  });

  // UK-Strichlinien liegen unter den Dielen, deshalb hier als Overlay erneut
  // gezeichnet, damit sie durch die deckenden Dielenflächen sichtbar bleiben
  // (identisch zum zweistufigen Aufbau im Bildschirm-Visualizer).
  doc.setDrawColor(...PDF_JOIST);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.4, 1], 0);
  joistPositions.forEach((pos) => {
    const jx = drawOriginX + pos * drawScale;
    doc.line(jx, drawOriginY, jx, drawOriginY + crossSpan * drawScale);
  });
  doc.setLineDashPattern([], 0);

  // Maßpfeile
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...PDF_INK);
  doc.text(`${runLength.toFixed(2)} m`, drawOriginX + (runLength * drawScale) / 2, drawOriginY - 3.5, { align: "center" });
  doc.text(`${crossSpan.toFixed(2)} m`, drawOriginX + runLength * drawScale + 4, drawOriginY + (crossSpan * drawScale) / 2, {
    angle: 90,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...PDF_MUTED);
  doc.text(`Unterkonstruktion: ${substructure.joistCount} Balken im Achsabstand von ${substructure.spacingCm} cm (Strichlinien)`, pageMargin, diagramBoxY + diagramBoxH + 4.5);

  // Legende
  const legendY = diagramBoxY + diagramBoxH + 9.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...PDF_INK);
  doc.setLineWidth(0.25);
  doc.rect(pageMargin, legendY - 2.6, 4, 2.6, "FD");
  doc.setFontSize(6.8);
  doc.setTextColor(...PDF_MUTED);
  doc.text(`Terrassendiele (${inputs.boardWidth} mm Breite)`, pageMargin + 6, legendY);

  if (activeScrapMode === "with") {
    doc.setFillColor(...PDF_ACCENT_SOFT);
    doc.rect(pageMargin + 68, legendY - 2.6, 4, 2.6, "FD");
    doc.text("Wiederverwendetes Reststück", pageMargin + 74, legendY);
  }
  doc.setDrawColor(...PDF_JOIST);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.4, 1], 0);
  doc.line(pageMargin + 138, legendY - 1.3, pageMargin + 144, legendY - 1.3);
  doc.setLineDashPattern([], 0);
  doc.text("Unterkonstruktion", pageMargin + 147, legendY);

  // --- 5. Einkaufsliste (integriert unter dem Verlegeplan) ---
  const tableTitleY = legendY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_INK);
  doc.text("EINKAUFSLISTE & MATERIALBEDARF", pageMargin, tableTitleY);

  const tableY = tableTitleY + 3;
  const rowH = 7.2;
  const headerH = 6.5;
  const colPos = pageMargin;
  const colSpec = pageMargin + 62;
  const colNetto = pageMargin + 122;
  const colEinkauf = rightEdge;

  doc.setFillColor(242, 237, 228);
  doc.rect(pageMargin, tableY, contentWidth, headerH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...PDF_MUTED);
  doc.text("POSITION / MATERIAL", colPos + 2, tableY + 4.4);
  doc.text("SPEZIFIKATION", colSpec + 2, tableY + 4.4);
  doc.text("NETTO-BEDARF", colNetto, tableY + 4.4, { align: "right" });
  doc.text(`EINKAUF (+${inputs.reservePercent}%)`, colEinkauf, tableY + 4.4, { align: "right" });

  type Row = [string, string, string, string];
  const rows: Row[] = [
    [
      `Terrassendielen (${activeScrapMode === "with" ? "Wilder Verband" : "Klassisch"})`,
      `${inputs.boardWidth} mm × ${inputs.boardLength} m`,
      `${active.totalBoards} Stk (${active.totalLinearMeters.toFixed(1)} m)`,
      `${active.purchaseBoardsWithReserve} Stück (${active.purchaseLinearMetersWithReserve.toFixed(1)} lfdm)`,
    ],
    [
      "Unterkonstruktionsbalken (UK)",
      `${substructure.joistLength.toFixed(2)} m je Träger`,
      `${substructure.joistCount} Balken`,
      `${substructure.joistCount} Balken (${substructure.totalJoistMeters.toFixed(1)} lfdm)`,
    ],
    [
      "Terrassenschrauben A2/A4",
      "5,0 × 50/60 mm, Bohrspitze",
      `${fastening.screwCount} Stück`,
      `${fastening.screwPackages} Pckg. (${fastening.screwPackages * 200} Stk)`,
    ],
    [
      "Gummigranulatpads",
      "8 oder 10 mm Stärke",
      `${substructure.padCount} Stück`,
      `ca. ${Math.ceil(substructure.padCount * 1.05)} Stück`,
    ],
    [
      "Fugenabstandshalter",
      `${inputs.gap} mm Fugenbreite`,
      `${fastening.spacerCount} Stück`,
      `${fastening.spacerCount} Stück`,
    ],
  ];

  rows.forEach((row, i) => {
    const y = tableY + headerH + i * rowH;
    if (i % 2 === 1) {
      doc.setFillColor(250, 248, 244);
      doc.rect(pageMargin, y, contentWidth, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.3);
    doc.setTextColor(...PDF_INK);
    doc.text(row[0], colPos + 2, y + 4.6, { maxWidth: colSpec - colPos - 4 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...PDF_MUTED);
    doc.text(row[1], colSpec + 2, y + 4.6, { maxWidth: colNetto - colSpec - 26 });
    doc.text(row[2], colNetto, y + 4.6, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_INK);
    doc.text(row[3], colEinkauf, y + 4.6, { align: "right" });
  });

  const tableBottomY = tableY + headerH + rows.length * rowH;
  doc.setDrawColor(...PDF_BORDER);
  doc.setLineWidth(0.3);
  doc.rect(pageMargin, tableY, contentWidth, headerH + rows.length * rowH, "D");

  // --- 6. Kurzhinweis Montage ---
  const noteY = tableBottomY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.3);
  doc.setTextColor(...PDF_MUTED);
  doc.text(
    "Montagehinweis: Mind. 1–2 % Gefälle vom Gebäude weg · Dielenstöße immer auf doppelter UK · Hirnholz sofort versiegeln.",
    pageMargin,
    noteY,
  );

  // --- 7. Fußzeile ---
  const footerY = 279;
  doc.setDrawColor(...PDF_BORDER);
  doc.setLineWidth(0.35);
  doc.line(pageMargin, footerY, rightEdge, footerY);
  doc.setFont("SpaceGrotesk", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...PDF_INK);
  doc.text("schreiner", pageMargin, footerY + 6);
  doc.setTextColor(...PDF_ACCENT);
  doc.text(".digital", pageMargin + doc.getTextWidth("schreiner"), footerY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...PDF_MUTED);
  doc.text("Terrassendielen-Rechner für den Werkstattalltag", pageMargin, footerY + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_INK);
  doc.text("www.schreiner.digital", rightEdge, footerY + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...PDF_MUTED_LIGHT);
  doc.text("Alle Berechnungen ohne Gewähr. Vor Ort Aufmaß prüfen.", rightEdge, footerY + 10.5, { align: "right" });

  const fileName = `Terrassendielen_${num(inputs.length, 1)}x${num(inputs.width, 1)}m_${rowsCount}Reihen.pdf`;
  doc.save(fileName);
}

/* ---------------------------------------------------------------------- */
/*  Hauptkomponente                                                        */
/* ---------------------------------------------------------------------- */

export function TerrassendielenRechner() {
  const [inputs, setInputs] = useState<TerraceInputs>(DEFAULT_INPUTS);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>("douglasie");
  const [scrapMode, setScrapMode] = useState<"with" | "without">("with");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const results = useMemo(() => calculateTerrace(inputs), [inputs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePresetSelect = (preset: WoodPreset) => {
    setSelectedPresetId(preset.id);
    setInputs((prev) => ({
      ...prev,
      boardWidth: preset.boardWidth,
      boardLength: preset.boardLength,
      gap: preset.gap,
      joistSpacing: preset.recommendedJoistSpacing,
      pricePerLinearMeter: preset.defaultPricePerMeter,
    }));
    showToast(`Profil „${preset.name}“ angewendet`);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setSelectedPresetId("douglasie");
    showToast("Standardwerte wiederhergestellt");
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      await generateTerracePdf(inputs, results, scrapMode);
    } catch (err) {
      console.error("PDF-Generierung fehlgeschlagen:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <RotateCcw className="size-3.5" />
          Zurücksetzen
        </button>
      </div>

      <WoodPresetPicker selectedId={selectedPresetId} onSelect={handlePresetSelect} />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-5">
          <TerraceForm
            inputs={inputs}
            onChange={(next) => {
              setInputs(next);
              setSelectedPresetId(null);
            }}
          />
        </div>
        <div className="flex flex-col lg:col-span-7">
          <TerraceVisualizer results={results} inputs={inputs} activeScrapMode={scrapMode} onScrapModeChange={setScrapMode} />
        </div>
      </div>

      <ComparisonCards results={results} inputs={inputs} activeScrapMode={scrapMode} onSelectScrapMode={setScrapMode} />

      <MaterialBill
        results={results}
        inputs={inputs}
        activeScrapMode={scrapMode}
        onPrint={handleDownloadPdf}
        isGenerating={isGenerating}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-border bg-ink px-4 py-2.5 text-xs text-paper shadow-xl">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
