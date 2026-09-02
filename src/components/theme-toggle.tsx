"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

const options = [
  { value: "system", label: "System" },
  { value: "light", label: "Hell" },
  { value: "dark", label: "Dunkel" },
] as const;
type Choice = (typeof options)[number]["value"];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  // next-themes only knows the real value after mount; render a stable
  // placeholder until then to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount flag
    setMounted(true);
  }, []);

  const current: Choice =
    mounted && options.some((o) => o.value === theme) ? (theme as Choice) : "system";

  return (
    <div
      role="radiogroup"
      aria-label="Farbschema wählen"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-wider transition-colors",
              active
                ? "bg-accent text-accent-contrast"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
