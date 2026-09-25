"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { CalculationResults, TerraceInputs, BoardPiece } from "./types";

interface TerraceVisualizerProps {
  results: CalculationResults;
  inputs: TerraceInputs;
  activeScrapMode: "with" | "without";
  onScrapModeChange?: (mode: "with" | "without") => void;
}

const viewToggleBase =
  "px-2 py-1 rounded-md text-[11px] transition-all";

export function TerraceVisualizer({ results, inputs, activeScrapMode }: TerraceVisualizerProps) {
  const [viewMode, setViewMode] = useState<"both" | "decking" | "substructure">("both");
  const [highlightScrap, setHighlightScrap] = useState<boolean>(true);
  const [showWasteOverlay, setShowWasteOverlay] = useState<boolean>(true);
  const [hoveredPiece, setHoveredPiece] = useState<{
    rowIndex: number;
    piece: BoardPiece;
    isWaste?: boolean;
    wasteLength?: number;
  } | null>(null);

  const { runLength, crossSpan, rowsCount, withScrap, withoutScrap, substructure } = results;

  const activeRows = activeScrapMode === "with" ? withScrap.simulatedRows : withoutScrap.simulatedRows;

  // ViewBox Geometrie
  const padLeft = 65;
  const padTop = 45;
  const hasWasteZone = activeScrapMode === "without" && withoutScrap.wastedMetersPerRow > 0.05 && showWasteOverlay;
  const padRight = hasWasteZone ? 110 : 55;
  const padBottom = 55;

  const canvasWidth = 980;
  const availableWidth = canvasWidth - padLeft - padRight;
  const scale = availableWidth / runLength;
  const availableHeight = crossSpan * scale;
  const canvasHeight = Math.max(380, availableHeight + padTop + padBottom);

  const isLengthwise = inputs.orientation === "lengthwise";
  const boardWidthM = inputs.boardWidth / 1000;
  const gapM = inputs.gap / 1000;
  const rowHeightPx = boardWidthM * scale;
  const gapPx = gapM * scale;

  const joistSpacingM = inputs.joistSpacing / 100;
  const joistPositions: number[] = [];
  for (let pos = 0; pos <= runLength + 0.05; pos += joistSpacingM) {
    joistPositions.push(Math.min(pos, runLength));
  }
  if (joistPositions[joistPositions.length - 1] < runLength - 0.05) {
    joistPositions.push(runLength);
  }

  return (
    <div
      className="flex h-full flex-col justify-between space-y-3.5 rounded-[var(--radius)] border border-border bg-surface p-4 sm:p-5"
      id="visualisierer"
    >
      <div className="flex flex-col gap-2.5 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight text-ink sm:text-base">
              Verlegeplan-Vorschau (2D CAD)
            </h2>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-medium",
                activeScrapMode === "with"
                  ? "border border-accent/30 bg-accent-soft text-accent"
                  : "border border-border bg-surface-2 text-ink-muted",
              )}
            >
              {activeScrapMode === "with" ? "◆ Wilder Verband" : "Klassischer Stoß"}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            {activeScrapMode === "with"
              ? "Reststücke am Reihenende starten die Folgereihe (verschnittarm)."
              : `Jede Reihe startet starr (${withoutScrap.wastedMetersPerRow.toFixed(2)} m Verschnitt je Reihe).`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-0.5 rounded-lg bg-surface-2 p-0.5 text-xs">
            <button type="button" onClick={() => setViewMode("both")} className={cn(viewToggleBase, viewMode === "both" ? "bg-surface font-semibold text-ink shadow-sm" : "text-ink-muted hover:text-ink")}>
              Dielen + UK
            </button>
            <button type="button" onClick={() => setViewMode("decking")} className={cn(viewToggleBase, viewMode === "decking" ? "bg-surface font-semibold text-ink shadow-sm" : "text-ink-muted hover:text-ink")}>
              Nur Dielen
            </button>
            <button type="button" onClick={() => setViewMode("substructure")} className={cn(viewToggleBase, viewMode === "substructure" ? "bg-surface font-semibold text-ink shadow-sm" : "text-ink-muted hover:text-ink")}>
              Nur UK
            </button>
          </div>

          {activeScrapMode === "with" ? (
            <button
              type="button"
              onClick={() => setHighlightScrap(!highlightScrap)}
              className={cn(
                "rounded-lg border px-2 py-1 text-[11px] font-medium transition-all",
                highlightScrap
                  ? "border-accent/40 bg-accent-soft font-semibold text-accent"
                  : "border-border bg-surface text-ink-muted hover:bg-surface-2",
              )}
            >
              Reste markieren
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowWasteOverlay(!showWasteOverlay)}
              className={cn(
                "rounded-lg border px-2 py-1 text-[11px] font-medium transition-all",
                showWasteOverlay
                  ? "border-red-300 bg-red-50 font-semibold text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                  : "border-border bg-surface text-ink-muted hover:bg-surface-2",
              )}
            >
              Verschnittzone
            </button>
          )}
        </div>
      </div>

      <div className="relative flex min-h-[260px] flex-1 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border-strong bg-[#fcfaf7] shadow-inner dark:bg-[#1c1712]">
        <div className="w-full overflow-x-auto p-1.5">
          <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="block h-auto w-full select-none" style={{ maxHeight: "410px" }}>
            <defs>
              <pattern id="planGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ede7dc" strokeWidth="0.8" />
              </pattern>

              <linearGradient id="woodFull" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4bc8c" />
                <stop offset="50%" stopColor="#cfa26e" />
                <stop offset="100%" stopColor="#b68853" />
              </linearGradient>

              <linearGradient id="woodOffcut" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f4b760" />
                <stop offset="50%" stopColor="#df9739" />
                <stop offset="100%" stopColor="#bf7621" />
              </linearGradient>

              <linearGradient id="joistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              <pattern id="wastePattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#f87171" strokeWidth="2" opacity="0.65" />
              </pattern>

              <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                <polygon points="0 0.8, 7 3.5, 0 6.2" fill="#57534e" />
              </marker>
              <marker id="arrowhead-start" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse">
                <polygon points="0 0.8, 7 3.5, 0 6.2" fill="#57534e" />
              </marker>
            </defs>

            <rect width={canvasWidth} height={canvasHeight} fill="#fcfaf7" />
            <rect width={canvasWidth} height={canvasHeight} fill="url(#planGrid)" />

            <rect x={padLeft} y={padTop} width={runLength * scale} height={crossSpan * scale} fill="#f3eee5" stroke="#78716c" strokeWidth="1.2" rx="1" />

            {hasWasteZone && (
              <g id="waste-zone-background">
                <rect
                  x={padLeft + runLength * scale + 6}
                  y={padTop}
                  width={withoutScrap.wastedMetersPerRow * scale}
                  height={crossSpan * scale}
                  fill="#fee2e2"
                  fillOpacity="0.45"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  rx="1"
                />
                <text
                  x={padLeft + runLength * scale + (withoutScrap.wastedMetersPerRow * scale) / 2 + 6}
                  y={padTop - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#dc2626"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  Verschnitt ({withoutScrap.wastedMetersPerRow.toFixed(2)}m je Reihe)
                </text>
              </g>
            )}

            {(viewMode === "both" || viewMode === "substructure") && (
              <g id="joists-layer" opacity={viewMode === "both" ? 0.75 : 1}>
                {joistPositions.map((pos, idx) => {
                  const jx = padLeft + pos * scale;
                  const beamWidthPx = Math.max(3, 0.045 * scale);
                  return (
                    <g key={`joist-${idx}`}>
                      <rect x={jx - beamWidthPx / 2} y={padTop} width={beamWidthPx} height={crossSpan * scale} fill="url(#joistGrad)" stroke="#334155" strokeWidth="0.5" />
                      {viewMode === "substructure" && <circle cx={jx} cy={padTop + 15} r="2.5" fill="#d97706" />}
                    </g>
                  );
                })}
              </g>
            )}

            {(viewMode === "both" || viewMode === "decking") && (
              <g id="decking-layer" opacity={viewMode === "both" ? 0.98 : 1}>
                {activeRows.map((row) => {
                  const ry = padTop + row.rowIndex * (rowHeightPx + gapPx);
                  const isLastRow = row.rowIndex === rowsCount - 1;
                  const currentBoardHeight =
                    isLastRow && results.lastBoardTrimNeeded
                      ? (results.lastBoardCutWidth / 1000) * scale
                      : rowHeightPx;

                  return (
                    <g key={`row-${row.rowIndex}`}>
                      <text x={padLeft - 8} y={ry + currentBoardHeight / 2 + 3} textAnchor="end" fontSize="9" fill="#78716c" fontFamily="monospace" fontWeight="600">
                        R{row.rowIndex + 1}
                      </text>

                      {row.pieces.map((piece) => {
                        const px = padLeft + piece.startX * scale;
                        const pWidth = piece.length * scale;
                        const isOffcutHighlighted = highlightScrap && piece.isOffcut && activeScrapMode === "with";
                        const isHovered =
                          hoveredPiece?.rowIndex === row.rowIndex && hoveredPiece?.piece.id === piece.id && !hoveredPiece.isWaste;

                        return (
                          <g
                            key={piece.id}
                            onMouseEnter={() => setHoveredPiece({ rowIndex: row.rowIndex, piece, isWaste: false })}
                            onMouseLeave={() => setHoveredPiece(null)}
                            className="cursor-pointer"
                          >
                            <rect
                              x={px}
                              y={ry}
                              width={pWidth}
                              height={currentBoardHeight}
                              fill={isOffcutHighlighted ? "url(#woodOffcut)" : "url(#woodFull)"}
                              stroke={isHovered ? "#1c1917" : "#593616"}
                              strokeWidth={isHovered ? 1.8 : 0.8}
                              rx="1.5"
                            />
                            <line x1={px + pWidth} y1={ry} x2={px + pWidth} y2={ry + currentBoardHeight} stroke="#261403" strokeWidth="1.4" />
                            {pWidth > 45 && currentBoardHeight > 10 && (
                              <text
                                x={px + pWidth / 2}
                                y={ry + currentBoardHeight / 2 + 3}
                                textAnchor="middle"
                                fontSize={Math.min(9, Math.max(7, currentBoardHeight * 0.55))}
                                fill="#2b1704"
                                fontWeight="700"
                                fontFamily="monospace"
                                pointerEvents="none"
                              >
                                {piece.length.toFixed(2)}m
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {hasWasteZone && withoutScrap.wastedMetersPerRow > 0 && (
                        <g
                          onMouseEnter={() =>
                            setHoveredPiece({
                              rowIndex: row.rowIndex,
                              piece: { id: `waste-${row.rowIndex}`, length: withoutScrap.wastedMetersPerRow, startX: runLength, isOffcut: false, pieceIndex: 99 },
                              isWaste: true,
                              wasteLength: withoutScrap.wastedMetersPerRow,
                            })
                          }
                          onMouseLeave={() => setHoveredPiece(null)}
                          className="cursor-pointer"
                        >
                          <line x1={padLeft + runLength * scale} y1={ry} x2={padLeft + runLength * scale} y2={ry + currentBoardHeight} stroke="#ef4444" strokeWidth="1.8" strokeDasharray="2 2" />
                          <rect
                            x={padLeft + runLength * scale + 6}
                            y={ry}
                            width={withoutScrap.wastedMetersPerRow * scale}
                            height={currentBoardHeight}
                            fill="url(#wastePattern)"
                            stroke="#ef4444"
                            strokeWidth="0.9"
                            strokeDasharray="3 2"
                            rx="1"
                            opacity={hoveredPiece?.isWaste && hoveredPiece.rowIndex === row.rowIndex ? 1 : 0.8}
                          />
                          {withoutScrap.wastedMetersPerRow * scale > 35 && currentBoardHeight > 10 && (
                            <text
                              x={padLeft + runLength * scale + 6 + (withoutScrap.wastedMetersPerRow * scale) / 2}
                              y={ry + currentBoardHeight / 2 + 3}
                              textAnchor="middle"
                              fontSize="8"
                              fill="#991b1b"
                              fontWeight="bold"
                              fontFamily="monospace"
                              pointerEvents="none"
                            >
                              -{withoutScrap.wastedMetersPerRow.toFixed(2)}m
                            </text>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {viewMode === "both" && (
              <g id="joists-projection-overlay" pointerEvents="none">
                {joistPositions.map((pos, idx) => {
                  const jx = padLeft + pos * scale;
                  return (
                    <line key={`joist-axis-line-${idx}`} x1={jx} y1={padTop} x2={jx} y2={padTop + crossSpan * scale} stroke="#b45309" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.9" />
                  );
                })}
              </g>
            )}

            <g id="dimension-run">
              <line x1={padLeft} y1={padTop - 18} x2={padLeft + runLength * scale} y2={padTop - 18} stroke="#57534e" strokeWidth="1" markerStart="url(#arrowhead-start)" markerEnd="url(#arrowhead)" />
              <line x1={padLeft} y1={padTop - 25} x2={padLeft} y2={padTop - 4} stroke="#78716c" strokeWidth="1" />
              <line x1={padLeft + runLength * scale} y1={padTop - 25} x2={padLeft + runLength * scale} y2={padTop - 4} stroke="#78716c" strokeWidth="1" />
              <rect x={padLeft + (runLength * scale) / 2 - 45} y={padTop - 30} width="90" height="17" fill="#ffffff" stroke="#d6d3d1" strokeWidth="1" rx="4" />
              <text x={padLeft + (runLength * scale) / 2} y={padTop - 18} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1c1917" fontFamily="monospace">
                {runLength.toFixed(2)} m {isLengthwise ? "(Länge)" : "(Breite)"}
              </text>
            </g>

            <g id="dimension-cross">
              <line
                x1={padLeft + runLength * scale + (hasWasteZone ? withoutScrap.wastedMetersPerRow * scale + 16 : 20)}
                y1={padTop}
                x2={padLeft + runLength * scale + (hasWasteZone ? withoutScrap.wastedMetersPerRow * scale + 16 : 20)}
                y2={padTop + crossSpan * scale}
                stroke="#57534e"
                strokeWidth="1"
                markerStart="url(#arrowhead-start)"
                markerEnd="url(#arrowhead)"
              />
              <rect
                x={padLeft + runLength * scale + (hasWasteZone ? withoutScrap.wastedMetersPerRow * scale + 28 : 30)}
                y={padTop + (crossSpan * scale) / 2 - 8}
                width="56"
                height="16"
                fill="#ffffff"
                stroke="#d6d3d1"
                strokeWidth="1"
                rx="4"
              />
              <text
                x={padLeft + runLength * scale + (hasWasteZone ? withoutScrap.wastedMetersPerRow * scale + 56 : 58)}
                y={padTop + (crossSpan * scale) / 2 + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#1c1917"
                fontFamily="monospace"
              >
                {crossSpan.toFixed(2)} m
              </text>
            </g>

            <g id="dimension-joist-note">
              <text x={padLeft} y={padTop + crossSpan * scale + 28} fontSize="10" fill="#57534e" fontFamily="sans-serif" fontWeight="500">
                Unterkonstruktion: {substructure.joistCount} Balken im Abstand von {substructure.spacingCm} cm (Strichlinien)
              </text>
              <text x={padLeft + runLength * scale} y={padTop + crossSpan * scale + 28} textAnchor="end" fontSize="10" fill="#57534e" fontFamily="sans-serif" fontWeight="500">
                Modus: {activeScrapMode === "with" ? "Wilder Verband" : "Klassisch (ohne Verwertung)"} · {rowsCount} Reihen
              </text>
            </g>
          </svg>
        </div>

        {hoveredPiece && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-border-strong bg-surface/95 px-3.5 py-1.5 font-mono text-xs text-ink shadow-md backdrop-blur-xs">
            <span className={cn("inline-block size-2 rounded-full", hoveredPiece.isWaste ? "bg-red-500" : "bg-accent")} />
            {hoveredPiece.isWaste ? (
              <span>
                Reihe {hoveredPiece.rowIndex + 1}: <strong className="text-red-700 dark:text-red-400">Verworfenes Reststück: {hoveredPiece.wasteLength?.toFixed(2)} m</strong> (landet im Verschnitt)
              </span>
            ) : (
              <span>
                Reihe {hoveredPiece.rowIndex + 1}: Länge <strong>{hoveredPiece.piece.length.toFixed(2)} m</strong>
                <span className="mx-1.5 text-ink-faint">·</span>
                <span className={hoveredPiece.piece.isOffcut ? "font-semibold text-accent" : "text-ink-muted"}>
                  {hoveredPiece.piece.isOffcut ? "Wiederverwendetes Reststück" : "Vollholz-Diele"}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-ink-muted">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-3.5 rounded-xs border border-[#784c1b] bg-[#cfa26e]" />
            <span>Volle Diele / Hauptabschnitt</span>
          </div>

          {activeScrapMode === "with" ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-3.5 rounded-xs border border-[#a8651a] bg-[#df9739]" />
              <span>Wiederverwendetes Reststück (Wilder Verband)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-3.5 rounded-xs border border-red-500 bg-red-100 dark:border-red-800 dark:bg-red-950/40" />
              <span>Verworfenes Reststück (Verschnitt)</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-b-2 border-dashed border-accent/70" />
            <span>Unterkonstruktion (Strichlinie: {substructure.spacingCm} cm Raster)</span>
          </div>
        </div>

        <div className="text-[11px] text-ink-faint">Klick oben beim Rechenergebnis wechselt zwischen beiden Verlegearten</div>
      </div>
    </div>
  );
}
