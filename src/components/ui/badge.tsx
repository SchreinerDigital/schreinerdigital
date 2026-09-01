import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "accent" | "neutral";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-wider",
        tone === "accent"
          ? "bg-accent-soft text-accent"
          : "bg-surface-2 text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
