/** Small hover-tooltip badge used to explain a calculator field inline. */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex">
      <span className="flex size-4 cursor-help items-center justify-center rounded-full bg-border font-mono text-[10px] font-bold text-ink-faint transition-colors group-hover:bg-accent group-hover:text-accent-contrast">
        i
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 whitespace-pre-line rounded-md bg-ink px-3 py-2 text-xs leading-snug font-normal text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}
