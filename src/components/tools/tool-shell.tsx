import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

/** Consistent frame for a single calculator page. */
export function ToolShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <Link
        href="/tools"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Alle Rechner
      </Link>
      <h1 className="mt-6 text-3xl">{title}</h1>
      {description && (
        <p className="mt-3 text-ink-muted">{description}</p>
      )}
      <div className="mt-10">{children}</div>
      <p className="mt-12 border-t border-border pt-5 text-xs text-ink-faint">
        Alle Angaben ohne Gewähr. Die Ergebnisse sind Näherungswerte und ersetzen
        keine statische Berechnung.
      </p>
    </Container>
  );
}

/** Placeholder body for tools that are not implemented yet. */
export function ToolStub() {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
      Dieser Rechner ist noch nicht umgesetzt – folgt Schritt für Schritt.
    </div>
  );
}
