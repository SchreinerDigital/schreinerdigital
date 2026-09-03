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
}: {
  columns: string[];
  rows: string[][];
  note?: ReactNode;
}) {
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-border">
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

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mt-6 divide-y divide-border rounded-[var(--radius)] border border-border">
      {items.map((item) => (
        <details key={item.q} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <h3 className="font-medium text-ink">{item.q}</h3>
            <ChevronIcon className="size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
