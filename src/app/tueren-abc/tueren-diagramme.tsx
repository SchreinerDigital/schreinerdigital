/** Clean schematic line diagrams for the Türen-Grundlagen section – deliberately
 * simplified (not to CAD-drawing fidelity), matching the site's thin-stroke icon
 * language so they read clearly at small size and in both themes. */

import type { ReactNode } from "react";

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-center text-xs text-ink-faint">{children}</p>;
}

function DiagramFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius)] border border-border bg-surface-2/40 p-4">
      <svg viewBox="0 0 160 130" className="h-auto w-full max-w-[220px]" aria-hidden>
        {children}
      </svg>
      <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
    </div>
  );
}

/** Gefälztes vs. stumpf einschlagendes Türblatt: top-down cross-section through frame + leaf. */
export function FalzVsStumpfDiagram() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DiagramFrame title="Gefälzt">
        {/* Zarge with a rebate step (Falzanschlag) */}
        <path
          d="M30 20 L30 110 L65 110 L65 78 L88 78 L88 20 Z"
          className="fill-surface-2 stroke-ink-muted"
          strokeWidth="2"
        />
        {/* Türblatt sitting into the rebate */}
        <path
          d="M88 30 L130 30 L130 100 L88 100 L88 78 L65 78 L65 88 L88 88 Z"
          className="fill-accent-soft stroke-accent"
          strokeWidth="2"
        />
      </DiagramFrame>
      <DiagramFrame title="Stumpf einschlagend">
        {/* Zarge: plain flat face, no rebate */}
        <rect x="30" y="20" width="35" height="90" className="fill-surface-2 stroke-ink-muted" strokeWidth="2" />
        {/* Türblatt: flush against the flat face */}
        <rect x="65" y="30" width="45" height="70" className="fill-accent-soft stroke-accent" strokeWidth="2" />
      </DiagramFrame>
      <p className="col-span-2 mt-1 flex items-center justify-center gap-4 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-ink-muted bg-surface-2" /> Zarge
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-accent bg-accent-soft" /> Türblatt
        </span>
      </p>
    </div>
  );
}

function DinRichtungPanel({ hingeLeft }: { hingeLeft: boolean }) {
  const hingeX = hingeLeft ? 45 : 115;
  return (
    <svg viewBox="0 0 160 130" className="h-auto w-full max-w-[220px]" aria-hidden>
      {/* Wall with door opening gap */}
      <line x1="10" y1="25" x2="45" y2="25" className="stroke-ink-muted" strokeWidth="3" />
      <line x1="115" y1="25" x2="150" y2="25" className="stroke-ink-muted" strokeWidth="3" />
      {/* Room the door swings into (viewer's side) */}
      <rect x="10" y="25" width="140" height="80" className="fill-surface-2/60" />
      {/* Door leaf open at ~90°, pivoting from the hinge jamb */}
      <line x1={hingeX} y1="25" x2={hingeX} y2="85" className="stroke-accent" strokeWidth="3" />
      {/* Hinge marks */}
      <circle cx={hingeX} cy="35" r="2.5" className="fill-accent" />
      <circle cx={hingeX} cy="55" r="2.5" className="fill-accent" />
      <circle cx={hingeX} cy="75" r="2.5" className="fill-accent" />
      {/* Viewer position/eye, looking up toward the hinge side */}
      <g transform="translate(80, 105)">
        <circle r="6" className="fill-none stroke-ink-muted" strokeWidth="2" />
        <path d="M0 -6 L0 -14" className="stroke-ink-muted" strokeWidth="2" markerEnd="url(#arrow)" />
      </g>
    </svg>
  );
}

/** DIN links / DIN rechts: plan view, viewed from the hinge (band) side the door swings toward. */
export function DinRichtungDiagram() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <svg width="0" height="0">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-ink-muted" />
          </marker>
        </defs>
      </svg>
      <div className="flex flex-col items-center rounded-[var(--radius)] border border-border bg-surface-2/40 p-4">
        <DinRichtungPanel hingeLeft />
        <p className="mt-2 text-sm font-semibold text-ink">DIN links</p>
      </div>
      <div className="flex flex-col items-center rounded-[var(--radius)] border border-border bg-surface-2/40 p-4">
        <DinRichtungPanel hingeLeft={false} />
        <p className="mt-2 text-sm font-semibold text-ink">DIN rechts</p>
      </div>
      <Caption>Bänder links, Tür schwingt zu dir</Caption>
      <Caption>Bänder rechts, Tür schwingt zu dir</Caption>
    </div>
  );
}

/** 2-teiliges (fest) vs. 3-teiliges (verstellbares Mittelteil) Band, seitliche Ansicht. */
export function BandTeileDiagram() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DiagramFrame title="Zweiteiliges Band">
        <rect x="60" y="20" width="10" height="35" rx="3" className="fill-accent-soft stroke-accent" strokeWidth="2" />
        <rect x="60" y="60" width="10" height="50" rx="3" className="fill-surface-2 stroke-ink-muted" strokeWidth="2" />
        <circle cx="65" cy="57" r="4" className="fill-none stroke-ink" strokeWidth="2" />
        <line x1="45" y1="30" x2="60" y2="30" className="stroke-ink-muted" strokeWidth="2" />
        <line x1="45" y1="95" x2="60" y2="95" className="stroke-ink-muted" strokeWidth="2" />
      </DiagramFrame>
      <DiagramFrame title="Dreiteiliges Band">
        <rect x="60" y="18" width="10" height="26" rx="3" className="fill-accent-soft stroke-accent" strokeWidth="2" />
        <rect x="58" y="48" width="14" height="26" rx="4" className="fill-surface stroke-ink" strokeWidth="2" />
        <rect x="60" y="78" width="10" height="30" rx="3" className="fill-accent-soft stroke-accent" strokeWidth="2" />
        <circle cx="65" cy="46" r="3" className="fill-none stroke-ink" strokeWidth="1.5" />
        <circle cx="65" cy="76" r="3" className="fill-none stroke-ink" strokeWidth="1.5" />
        {/* adjustment screw marks on the middle sleeve */}
        <path d="M52 61 h4 M50 61 v0" className="stroke-ink-faint" strokeWidth="1.5" />
        <path d="M78 61 h4" className="stroke-ink-faint" strokeWidth="1.5" />
        <line x1="42" y1="28" x2="58" y2="28" className="stroke-ink-muted" strokeWidth="2" />
        <line x1="42" y1="98" x2="60" y2="98" className="stroke-ink-muted" strokeWidth="2" />
      </DiagramFrame>
      <Caption>Fest, Standard bei Zimmertüren</Caption>
      <Caption>Mittelteil in 3 Achsen verstellbar</Caption>
    </div>
  );
}

/** Bandbezugslinien-Position und Standardbreiten am Türblatt. */
export function TuerblattMasseDiagram() {
  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <svg viewBox="0 0 140 200" className="mx-auto h-auto w-full max-w-[160px]" aria-hidden>
        <rect x="30" y="10" width="80" height="180" rx="2" className="fill-surface-2 stroke-ink-muted" strokeWidth="2" />
        {/* 1. Bandbezugslinie */}
        <line x1="12" y1="34" x2="128" y2="34" strokeDasharray="4 3" className="stroke-accent" strokeWidth="1.5" />
        <text x="70" y="30" textAnchor="middle" className="fill-accent" fontSize="8">
          241 mm
        </text>
        {/* 2. Bandbezugslinie (3-Band) */}
        <line x1="12" y1="84" x2="128" y2="84" strokeDasharray="4 3" className="stroke-ink-muted" strokeWidth="1.5" />
        <text x="70" y="80" textAnchor="middle" className="fill-ink-muted" fontSize="8">
          +350 mm
        </text>
        {/* dimension line: height */}
        <line x1="20" y1="10" x2="20" y2="190" className="stroke-ink-faint" strokeWidth="1" />
        <text x="8" y="102" textAnchor="middle" className="fill-ink-faint" fontSize="7" transform="rotate(-90 8 102)">
          1985 / 2110 mm
        </text>
      </svg>
      <div>
        <p className="text-sm leading-relaxed text-ink-muted">
          Die obere Bandbezugslinie liegt nach DIN 18268 bei 241 mm (±1 mm) ab
          Oberkante Türblatt; bei dreibändigen Türen folgt die mittlere
          Bandbezugslinie im Abstand von weiteren 350 mm (±0,1 mm).
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Standard-Türblattbreiten nach DIN 18101:{" "}
          <strong className="text-ink">610 · 735 · 860 · 985 · 1110 mm</strong>,
          Standardhöhen{" "}
          <strong className="text-ink">1985 mm oder 2110 mm</strong> (gefälzt).
          Liegt dein Bestandsmaß außerhalb dieser Reihe, handelt es sich um ein
          Sondermaß.
        </p>
      </div>
    </div>
  );
}
