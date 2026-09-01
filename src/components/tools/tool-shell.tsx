import Link from "next/link";
import type { ReactNode } from "react";

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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/tools"
        className="text-sm text-foreground/50 hover:text-holz-700"
      >
        ← Alle Rechner
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-foreground/70">{description}</p>
      )}
      <div className="mt-8">{children}</div>
      <p className="mt-10 text-xs text-foreground/40">
        Alle Angaben ohne Gewähr. Ergebnisse sind Näherungswerte und ersetzen
        keine statische Berechnung.
      </p>
    </div>
  );
}

/** Placeholder body for tools that are not implemented yet. */
export function ToolStub() {
  return (
    <div className="rounded-lg border border-dashed border-holz-300 p-6 text-sm text-foreground/60">
      Dieser Rechner ist noch nicht umgesetzt – folgt Schritt für Schritt.
    </div>
  );
}
