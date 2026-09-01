import { cn } from "@/lib/cn";

/**
 * The ruler strip that sits under ".digital" – the recurring brand motif.
 * Stretches to the width of its container; height scales with font-size.
 */
export function RulerBar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 12"
      preserveAspectRatio="none"
      role="presentation"
      className={cn("h-[0.42em] w-full", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="0.9" y="0.9" width="138.2" height="10.2" rx="1.4" />
      <path
        d="M14 1V7 M28 1V9 M42 1V7 M56 1V9 M70 1V7 M84 1V9 M98 1V7 M112 1V9 M126 1V7"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * "schreiner.digital" wordmark. Live text (crisp at any size, follows the
 * current text color) with the ruler motif aligned under ".digital".
 *
 * Scale it by setting a font-size / text-* class on the element.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-grid grid-cols-[auto_auto] items-baseline gap-x-[0.02em]",
        "font-display text-[1.1rem] font-bold lowercase leading-none tracking-[-0.03em] text-ink",
        className,
      )}
    >
      <span>schreiner</span>
      <span className="text-accent">.digital</span>
      <span aria-hidden="true" />
      <span aria-hidden="true" className="mt-[0.3em] w-[94%] justify-self-end text-ink/55">
        <RulerBar />
      </span>
    </span>
  );
}
