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
        <table
          className="w-full border-collapse text-sm"
          style={{ minWidth: `${columns.length * 190}px` }}
        >
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              {columns.map((col) => (
                <th key={col} className="px-4 py-2.5 font-medium text-nowrap text-ink-muted">
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

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  return (
    <div className="mt-6 divide-y divide-border rounded-[var(--radius)] border border-border">
      {items.map((item) => (
        <details key={item.title} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
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
