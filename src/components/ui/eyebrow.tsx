import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase section label with an accent lead-in bar. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </span>
  );
}
