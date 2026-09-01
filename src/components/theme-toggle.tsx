"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

const order = ["system", "light", "dark"] as const;
type Choice = (typeof order)[number];

const labels: Record<Choice, string> = {
  system: "System",
  light: "Hell",
  dark: "Dunkel",
};

function Icon({ choice }: { choice: Choice }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (choice === "light") {
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (choice === "dark") {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 22h8M12 18v4" />
    </svg>
  );
}

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
    mounted && order.includes(theme as Choice) ? (theme as Choice) : "system";

  function cycle() {
    setTheme(order[(order.indexOf(current) + 1) % order.length]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Farbschema: ${labels[current]}. Klicken zum Wechseln.`}
      title={`Farbschema: ${labels[current]}`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Icon choice={current} />
    </button>
  );
}
