"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CalculationResults, TerraceInputs, BoardPiece } from "./types";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 900, height: 380 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setContainerSize({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Klick-und-Ziehen zum Verschieben (Pan): Start-Position + Start-Scroll in
  // einer Ref statt State, da mousemove sehr häufig feuert und wir dafür
  // keine Re-Renders auslösen wollen - die Scrollposition wird direkt am
  // DOM-Element gesetzt.
  const panStateRef = useRef<{ startX: number; startY: number; startScrollLeft: number; startScrollTop: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const pan = panStateRef.current;
      const el = scrollRef.current;
      if (!pan || !el) return;
      el.scrollLeft = pan.startScrollLeft - (e.clientX - pan.startX);
      el.scrollTop = pan.startScrollTop - (e.clientY - pan.startY);
    };
    const handlePointerUp = () => {
      if (panStateRef.current) {
        panStateRef.current = null;
        setIsPanning(false);
      }
    };
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, []);

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    panStateRef.current = { startX: e.clientX, startY: e.clientY, startScrollLeft: el.scrollLeft, startScrollTop: el.scrollTop };
    setIsPanning(true);
  };

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

  // "Zoom" ist relativ zur Einpassung in den sichtbaren Kasten (baseScale) zu
  // verstehen: 100 % zeigt den kompletten Plan ohne Scrollen (wie bisher),
  // Werte darüber vergrößern gezielt und erfordern dann Scrollen/Pannen -
  // genau dafür sind bei großen Terrassen die Zoom-Buttons gedacht.
  const baseScale =
    containerSize.width > 0 && containerSize.height > 0
      ? Math.min(containerSize.width / canvasWidth, containerSize.height / canvasHeight)
      : 1;
  const displayScale = baseScale * zoom;
  const svgDisplayWidth = canvasWidth * displayScale;
  const svgDisplayHeight = canvasHeight * displayScale;
  const canZoomIn = zoom < ZOOM_MAX - 0.001;
  const canZoomOut = zoom > ZOOM_MIN + 0.001;
  const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100));

  // Zoomt so, dass der Punkt unter dem Mauszeiger (bzw. bei Klick auf die
  // +/- Buttons: die Mitte der sichtbaren Fläche) an derselben Stelle bleiben
  // bleibt - die Scrollposition wird danach im Effekt unten passend
  // nachgezogen, sobald die neue Größe gerendert ist.
  const pendingAnchorRef = useRef<{ fracX: number; fracY: number; viewportX: number; viewportY: number } | null>(null);

  const applyZoomAt = (deltaZoom: number, clientX?: number, clientY?: number) => {
    const el = scrollRef.current;
    const newZoom = clampZoom(zoom + deltaZoom);
    if (!el || svgDisplayWidth <= 0 || svgDisplayHeight <= 0) {
      setZoom(newZoom);
      return;
    }
    const rect = el.getBoundingClientRect();
    const viewportX = clientX !== undefined ? clientX - rect.left : el.clientWidth / 2;
    const viewportY = clientY !== undefined ? clientY - rect.top : el.clientHeight / 2;
    const fracX = (el.scrollLeft + viewportX) / svgDisplayWidth;
    const fracY = (el.scrollTop + viewportY) / svgDisplayHeight;
    pendingAnchorRef.current = { fracX, fracY, viewportX, viewportY };
    setZoom(newZoom);
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    const anchor = pendingAnchorRef.current;
    if (!el || !anchor) return;
    el.scrollLeft = anchor.fracX * svgDisplayWidth - anchor.viewportX;
    el.scrollTop = anchor.fracY * svgDisplayHeight - anchor.viewportY;
    pendingAnchorRef.current = null;
  }, [svgDisplayWidth, svgDisplayHeight]);

  const zoomIn = () => applyZoomAt(ZOOM_STEP);
  const zoomOut = () => applyZoomAt(-ZOOM_STEP);
  const zoomReset = () => {
    pendingAnchorRef.current = { fracX: 0, fracY: 0, viewportX: 0, viewportY: 0 };
    setZoom(1);
  };

  // Zoom per Mausrad: nativer (nicht-passiver) Listener, damit preventDefault
  // zuverlässig funktioniert und die Seite dabei nicht mitscrollt. Über eine
  // Ref statt Dependency-Array angebunden, damit der Listener nicht bei
  // jedem Render neu (de)registriert werden muss.
  const applyZoomAtRef = useRef(applyZoomAt);
  useEffect(() => {
    applyZoomAtRef.current = applyZoomAt;
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      applyZoomAtRef.current(direction * ZOOM_STEP, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

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

  // Bemaßung der Terrassenbreite (rechts): hochkant statt liegend, sonst ragt
  // die Beschriftung bei der bisherigen liegenden Pille über den rechten
  // canvasWidth-Rand hinaus und wird abgeschnitten. Schmale/hohe Pille +
  // gedrehter Text lösen das (analog zur bereits gedrehten PDF-Beschriftung).
  const crossLabelBaseX = padLeft + runLength * scale + (hasWasteZone ? withoutScrap.wastedMetersPerRow * scale : 0);
  const crossLineX = crossLabelBaseX + (hasWasteZone ? 16 : 20);
  const crossPillW = 16;
  const crossPillH = 54;
  const crossPillX = crossLineX + 10;
  const crossPillY = padTop + (crossSpan * scale) / 2 - crossPillH / 2;
  const crossTextX = crossPillX + crossPillW / 2;
  const crossTextY = crossPillY + crossPillH / 2 + 3.5;

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

      <div
        className="terrace-plan relative min-h-[260px] flex-1 overflow-hidden rounded-[var(--radius)] border border-border-strong shadow-inner"
        style={{ backgroundColor: "var(--plan-paper)" }}
      >
        <div
          ref={scrollRef}
          onMouseDown={handlePanStart}
          className={cn(
            "absolute inset-0 flex overflow-auto p-1.5",
            isPanning ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <svg
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            width={svgDisplayWidth}
            height={svgDisplayHeight}
            className="m-auto block shrink-0 select-none"
          >
            <defs>
              <pattern id="planGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" style={{ stroke: "var(--plan-grid)" }} strokeWidth="0.8" />
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
                <polygon points="0 0.8, 7 3.5, 0 6.2" style={{ fill: "var(--plan-muted)" }} />
              </marker>
              <marker id="arrowhead-start" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse">
                <polygon points="0 0.8, 7 3.5, 0 6.2" style={{ fill: "var(--plan-muted)" }} />
              </marker>
            </defs>

            <rect width={canvasWidth} height={canvasHeight} style={{ fill: "var(--plan-paper)" }} />
            <rect width={canvasWidth} height={canvasHeight} fill="url(#planGrid)" />

            <rect
              x={padLeft}
              y={padTop}
              width={runLength * scale}
              height={crossSpan * scale}
              style={{ fill: "var(--plan-terrace-fill)", stroke: "var(--plan-muted)" }}
              strokeWidth="1.2"
              rx="1"
            />

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
                      <text x={padLeft - 8} y={ry + currentBoardHeight / 2 + 3} textAnchor="end" fontSize="9" style={{ fill: "var(--plan-muted)" }} fontFamily="monospace" fontWeight="600">
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
              <line x1={padLeft} y1={padTop - 18} x2={padLeft + runLength * scale} y2={padTop - 18} style={{ stroke: "var(--plan-muted)" }} strokeWidth="1" markerStart="url(#arrowhead-start)" markerEnd="url(#arrowhead)" />
              <line x1={padLeft} y1={padTop - 25} x2={padLeft} y2={padTop - 4} style={{ stroke: "var(--plan-muted)" }} strokeWidth="1" />
              <line x1={padLeft + runLength * scale} y1={padTop - 25} x2={padLeft + runLength * scale} y2={padTop - 4} style={{ stroke: "var(--plan-muted)" }} strokeWidth="1" />
              <rect x={padLeft + (runLength * scale) / 2 - 45} y={padTop - 30} width="90" height="17" style={{ fill: "var(--plan-pill-bg)", stroke: "var(--plan-pill-border)" }} strokeWidth="1" rx="4" />
              <text x={padLeft + (runLength * scale) / 2} y={padTop - 18} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: "var(--plan-pill-text)" }} fontFamily="monospace">
                {runLength.toFixed(2)} m {isLengthwise ? "(Länge)" : "(Breite)"}
              </text>
            </g>

            <g id="dimension-cross">
              <line
                x1={crossLineX}
                y1={padTop}
                x2={crossLineX}
                y2={padTop + crossSpan * scale}
                style={{ stroke: "var(--plan-muted)" }}
                strokeWidth="1"
                markerStart="url(#arrowhead-start)"
                markerEnd="url(#arrowhead)"
              />
              <rect
                x={crossPillX}
                y={crossPillY}
                width={crossPillW}
                height={crossPillH}
                style={{ fill: "var(--plan-pill-bg)", stroke: "var(--plan-pill-border)" }}
                strokeWidth="1"
                rx="4"
              />
              <text
                x={crossTextX}
                y={crossTextY}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                style={{ fill: "var(--plan-pill-text)" }}
                fontFamily="monospace"
                transform={`rotate(-90 ${crossTextX} ${crossTextY})`}
              >
                {crossSpan.toFixed(2)} m
              </text>
            </g>

            <g id="dimension-joist-note">
              <text x={padLeft} y={padTop + crossSpan * scale + 28} fontSize="10" style={{ fill: "var(--plan-muted)" }} fontFamily="sans-serif" fontWeight="500">
                Unterkonstruktion: {substructure.joistCount} Balken im Abstand von {substructure.spacingCm} cm (Strichlinien)
              </text>
              <text x={padLeft + runLength * scale} y={padTop + crossSpan * scale + 28} textAnchor="end" fontSize="10" style={{ fill: "var(--plan-muted)" }} fontFamily="sans-serif" fontWeight="500">
                Modus: {activeScrapMode === "with" ? "Wilder Verband" : "Klassisch (ohne Verwertung)"} · {rowsCount} Reihen
              </text>
            </g>
          </svg>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-0.5 rounded-lg border border-border-strong bg-surface/95 p-1 shadow-md backdrop-blur-xs">
          <button
            type="button"
            onClick={zoomOut}
            disabled={!canZoomOut}
            aria-label="Verlegeplan verkleinern"
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={zoomReset}
            aria-label="Zoom auf 100 % zurücksetzen"
            title="Zoom zurücksetzen"
            className="min-w-11 rounded-md px-1.5 py-1 text-center font-mono text-[11px] text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={!canZoomIn}
            aria-label="Verlegeplan vergrößern"
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {hoveredPiece && !isPanning && (
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
