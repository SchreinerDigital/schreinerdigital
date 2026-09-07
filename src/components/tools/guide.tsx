import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared building blocks for the long-form guide content below each calculator. */

export function GuideShell({ children }: { children: ReactNode }) {
  return <div className="mt-16 space-y-14 border-t border-border pt-12">{children}</div>;
}

export function GuideSection({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl">{title}</h2>
      {intro && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{intro}</p>}
      {children}
    </section>
  );
}

export function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent">
            {i + 1}
          </span>
          <div>
            <h3 className="font-semibold text-ink">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SpecTable({
  columns,
  rows,
  note,
  titleColumn = 0,
}: {
  columns: string[];
  rows: string[][];
  note?: ReactNode;
  /** Index of the column that identifies a row (shown as the card heading on phones). */
  titleColumn?: number;
}) {
  const table = (
    <table
      className="w-full border-collapse text-sm"
      style={columns.length > 2 ? { minWidth: `${columns.length * 190}px` } : undefined}
    >
      <thead>
        <tr className="border-b border-border bg-surface text-left">
          {columns.map((col) => (
            <th
              key={col}
              className={cn(
                "px-4 py-2.5 font-medium text-ink-muted",
                columns.length > 2 && "text-nowrap",
              )}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i > 0 ? "border-t border-border" : undefined}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={cn(
                  "px-4 py-2.5 font-mono tabular-nums",
                  j === 0 ? "text-ink" : "text-ink-muted",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // A table with only 2 columns is already narrow enough to fit any screen
  // on its own – no need for the mobile card fallback below.
  if (columns.length <= 2) {
    return (
      <>
        <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-border">{table}</div>
        {note && <p className="mt-3 text-xs text-ink-faint">{note}</p>}
      </>
    );
  }

  return (
    <>
      {/* Phones: a data table with 3+ columns never fits without sideways scrolling,
          so each row becomes a small card of label/value pairs instead. */}
      <div className="mt-6 space-y-3 sm:hidden">
        {rows.map((row, i) => (
          <div key={i} className="rounded-[var(--radius)] border border-border p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-faint">
              {columns[titleColumn]}
            </p>
            <p className="mt-1 font-mono text-base font-semibold text-ink">
              {row[titleColumn]}
            </p>
            <dl className="mt-3 space-y-2.5 border-t border-border pt-3">
              {columns.map((col, j) =>
                j === titleColumn ? null : (
                  <div key={col}>
                    <dt className="text-xs text-ink-faint">{col}</dt>
                    <dd className="mt-0.5 font-mono text-sm text-ink-muted">{row[j]}</dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-[var(--radius)] border border-border sm:block">
        {table}
      </div>
      {note && <p className="mt-3 text-xs text-ink-faint">{note}</p>}
    </>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
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
  );
}

export function Accordion({ items }: { items: { title: ReactNode; content: ReactNode }[] }) {
  return (
    <div className="mt-6 divide-y divide-border rounded-[var(--radius)] border border-border">
      {items.map((item, i) => (
        <details key={i} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <h3 className="font-medium text-ink">{item.title}</h3>
            <ChevronIcon className="size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion
      items={items.map((item) => ({
        title: item.q,
        content: <p className="text-sm leading-relaxed text-ink-muted">{item.a}</p>,
      }))}
    />
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

export interface SoftwareProfile {
  /** Product or app name, shown as the accordion heading. */
  name: string;
  /** One or two letters for the monogram badge (no real product logos are used, see IndependenceNote). */
  kuerzel: string;
  /** Short, 2–4 sentence portrait – adds detail beyond the comparison table. */
  beschreibung: ReactNode;
  /** One sentence: who this is the best fit for. */
  geeignetFuer: string;
  /** 2–4 concrete advantages. */
  vorteile: string[];
  /** 2–4 concrete trade-offs or limitations. */
  nachteile: string[];
  /** Link to the provider's own site or product page. */
  website: string;
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function MinusCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  );
}

/** Expandable per-product portraits: monogram, short article, Vorteile/Nachteile, link to the provider's own site. */
export function SoftwareProfiles({ items }: { items: SoftwareProfile[] }) {
  return (
    <Accordion
      items={items.map((item) => ({
        title: (
          <span className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-semibold text-accent">
              {item.kuerzel}
            </span>
            {item.name}
          </span>
        ),
        content: (
          <div className="space-y-4 pl-11">
            <p className="text-sm leading-relaxed text-ink-muted">{item.beschreibung}</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              <strong className="text-ink">Besonders geeignet für:</strong> {item.geeignetFuer}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                  <PlusCircleIcon className="size-3.5 text-accent" />
                  Vorteile
                </h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-muted">
                  {item.vorteile.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                  <MinusCircleIcon className="size-3.5 text-ink-faint" />
                  Nachteile
                </h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-muted">
                  {item.nachteile.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href={item.website}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Website besuchen
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        ),
      }))}
    />
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3Z" />
      <path d="m9.5 12 2 2 3.5-4" />
    </svg>
  );
}

/** Discloses that the comparison is independent editorial research, not paid placement. */
export function IndependenceNote() {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius)] border border-border bg-surface-2/40 p-4">
      <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-accent" />
      <p className="text-sm leading-relaxed text-ink-muted">
        <strong className="text-ink">Unabhängige Einschätzung:</strong> Diese
        Übersicht ist eine unabhängige redaktionelle Recherche. Es gibt kein
        Sponsoring, keine Bezahlung und keine Provisionen durch die genannten
        Hersteller – Auswahl und Beschreibung beruhen auf frei zugänglichen
        Informationen der Anbieter.
      </p>
    </div>
  );
}
