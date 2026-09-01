const de = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

/** Format a number with German thousands/decimal separators. */
export function num(value: number, fractionDigits?: number): string {
  if (!Number.isFinite(value)) return "–";
  if (fractionDigits === undefined) return de.format(value);
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Parse a user-entered number that may use a comma as the decimal separator. */
export function parseNum(input: string): number {
  const normalized = input.trim().replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}
