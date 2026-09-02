"use client";

import { useId, useMemo, type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import { num } from "@/lib/format";
import { InfoTooltip } from "@/components/tools/info-tooltip";

const currency = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const NON_WAGE_TOOLTIP = `Typische Lohnnebenkosten im Handwerk

• 1-Mann-Schreiner: 20–30 %
• Kleiner Handwerksbetrieb: 25–40 %
• Mittelgroßer Betrieb: 30–50 %
• Spezialgewerke / Ladenbau: 35–55 %

Hinweis: Werte über 60 % sind selten und deuten auf hohe Ausfallzeiten oder besondere Anforderungen hin.`;

const UNPRODUCTIVE_TOOLTIP =
  "Zeiten, in denen nicht direkt am Kundenauftrag gearbeitet wird – z. B. Büroarbeit, Wege, Rüstzeiten, Aufräumen oder Wartezeiten. Im Handwerk liegen realistische Werte meist zwischen 20–40 %.";

const PROFIT_TOOLTIP =
  "Aufschlag für unternehmerisches Risiko und Gewinn. Die Farbe des Reglers gibt eine Indikation für übliche Werte je nach Betriebsgröße.";

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

function Field({
  label,
  value,
  onChange,
  suffix,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  tooltip?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </span>
      <div className="relative">
        <input
          id={id}
          type="number"
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
  color,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  tooltip?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-muted">
        <span className="flex items-center">
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer rounded-full"
        style={{ accentColor: color }}
      />
    </div>
  );
}

function Hint({ color, children }: { color: string; children: ReactNode }) {
  return (
    <p className="mt-1.5 text-xs font-medium" style={{ color }}>
      {children}
    </p>
  );
}

function WarningBox({ danger, children }: { danger?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "mt-2 flex items-start gap-2 rounded-md border px-3 py-2 text-xs leading-snug",
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      )}
    >
      <span aria-hidden>⚠️</span>
      <span>{children}</span>
    </div>
  );
}

function Row({
  label,
  value,
  indent,
  strong,
  accent,
}: {
  label: string;
  value: string;
  indent?: boolean;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-2 text-sm">
      <span className={cn("text-ink-muted", indent && "pl-4 text-ink-faint")}>
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-ink",
          strong && "font-semibold",
          accent && "text-base font-bold text-accent",
        )}
      >
        {value}
      </span>
    </div>
  );
}

// --- Status colors & messages, ported 1:1 from the reference calculator ---

function nonWageColor(pct: number) {
  if (pct < 20) return "#e67e22";
  if (pct > 60) return "#c0392b";
  return "#27ae60";
}

function nonWageMessage(pct: number) {
  if (pct < 20) {
    return {
      danger: false,
      text: "Unrealistisch niedrig: Lohnnebenkosten fallen in Deutschland selten unter 20 %.",
    };
  }
  if (pct > 60) {
    return {
      danger: true,
      text: "Sehr hoch: Möglicherweise Spezialgewerk, hohe Ausfallzeiten oder ineffiziente Struktur.",
    };
  }
  return null;
}

function unproductiveColor(pct: number) {
  if (pct <= 40) return "#27ae60";
  if (pct <= 50) return "#e67e22";
  return "#c0392b";
}

function unproductiveMessage(pct: number) {
  if (pct <= 25) {
    return { kind: "hint" as const, color: "#27ae60", text: "✔️ Effizienter Bereich (≤25%)" };
  }
  if (pct <= 40) {
    return {
      kind: "hint" as const,
      color: "#27ae60",
      text: "✔️ Normaler Bereich im Handwerk (25–40%)",
    };
  }
  if (pct <= 50) {
    return {
      kind: "hint" as const,
      color: "#e67e22",
      text: "⚠️ Erhöht (40-50%) - kann Rentabilität beeinträchtigen.",
    };
  }
  return {
    kind: "box" as const,
    danger: true,
    text: "Wirtschaftlich kritisch: Über 50% ist meist unrealistisch und nicht tragbar.",
  };
}

function profitColor(pct: number) {
  if (pct < 5) return "#c0392b";
  if (pct <= 15) return "#27ae60";
  if (pct <= 18) return "#2980b9";
  if (pct <= 25) return "#8e44ad";
  if (pct <= 40) return "#e67e22";
  return "#c0392b";
}

function profitMessage(pct: number) {
  if (pct < 5) {
    return { kind: "box" as const, danger: true, text: "Zu niedrig: Evtl. nicht kostendeckend." };
  }
  if (pct <= 10) {
    return { kind: "hint" as const, color: "#27ae60", text: "✔️ 1-Mann-Bereich (5–10%)" };
  }
  if (pct <= 15) {
    return { kind: "hint" as const, color: "#27ae60", text: "✔️ Kleiner Betrieb (10–15%)" };
  }
  if (pct <= 18) {
    return { kind: "hint" as const, color: "#2980b9", text: "✔️ Mittelgroßer Betrieb (15–18%)" };
  }
  if (pct <= 25) {
    return {
      kind: "hint" as const,
      color: "#8e44ad",
      text: "✔️ Spezialgewerk / Ladenbau (18–25%)",
    };
  }
  if (pct <= 40) {
    return {
      kind: "hint" as const,
      color: "#e67e22",
      text: "✔️ Hoch / Spezial (25-40%) – evtl. prüfen",
    };
  }
  return {
    kind: "box" as const,
    danger: true,
    text: "Sehr hoch: Nur bei Speziallleistungen realistisch.",
  };
}

export function StundensatzRechner() {
  // --- Arbeitszeit ---
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [vacationDays, setVacationDays] = useState(30);
  const [sickDays, setSickDays] = useState(10);

  // --- Lohn & Kosten ---
  const [wageMode, setWageMode] = useState<"yearly" | "hourly">("yearly");
  const [grossWage, setGrossWage] = useState(40000);
  const [nonWagePercent, setNonWagePercent] = useState(35);
  const [overheadYearly, setOverheadYearly] = useState(15000);

  // --- Produktivität ---
  const [unproductivePercent, setUnproductivePercent] = useState(20);

  // --- Wagnis & Gewinn ---
  const [profitMargin, setProfitMargin] = useState(10);

  const calc = useMemo(() => {
    const workDaysPerWeek = 5;
    const weeksPerYear = 52;
    const hoursPerDay = weeklyHours / workDaysPerWeek;

    const totalPotentialDays = weeksPerYear * workDaysPerWeek;
    const presentDays = totalPotentialDays - vacationDays - sickDays;

    const annualPresenceHours = presentDays * hoursPerDay;
    const productiveHours = annualPresenceHours * (1 - unproductivePercent / 100);

    let baseGrossWageYearly = 0;
    if (wageMode === "yearly") {
      baseGrossWageYearly = grossWage;
    } else {
      const paidHoursYearly = weeksPerYear * weeklyHours;
      baseGrossWageYearly = grossWage * paidHoursYearly;
    }

    const nonWageCosts = baseGrossWageYearly * (nonWagePercent / 100);
    const totalPersonnelCosts = baseGrossWageYearly + nonWageCosts;
    const totalCosts = totalPersonnelCosts + overheadYearly;

    const hourlyRate = productiveHours > 0 ? totalCosts / productiveHours : 0;

    const wagnisFactor = profitMargin / 100;
    const mwst = 0.19;

    const hourlyRateWithProfit = hourlyRate * (1 + wagnisFactor);
    const customerRate = hourlyRateWithProfit * (1 + mwst);

    return {
      annualPresenceHours,
      productiveHours,
      totalPersonnelCosts,
      totalCosts,
      hourlyRate,
      hourlyRateWithProfit,
      customerRate,
      baseGrossWageYearly,
      nonWageCosts,
    };
  }, [
    weeklyHours,
    vacationDays,
    sickDays,
    wageMode,
    grossWage,
    nonWagePercent,
    overheadYearly,
    unproductivePercent,
    profitMargin,
  ]);

  const nwColor = nonWageColor(nonWagePercent);
  const nwMessage = nonWageMessage(nonWagePercent);
  const upColor = unproductiveColor(unproductivePercent);
  const upMessage = unproductiveMessage(unproductivePercent);
  const pfColor = profitColor(profitMargin);
  const pfMessage = profitMessage(profitMargin);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <Field
          label="Wochenarbeitszeit"
          value={weeklyHours}
          onChange={setWeeklyHours}
          suffix="Std."
          tooltip="Ihre vertragliche Arbeitszeit pro Woche (Standard: 40 Std)."
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">
            Urlaub &amp; Krankheit (Tage pro Jahr)
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                className={fieldClass}
                value={vacationDays}
                onChange={(e) => setVacationDays(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                Urlaub
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                className={fieldClass}
                value={sickDays}
                onChange={(e) => setSickDays(Number(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                Krank
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">
            Lohnmodell
          </span>
          <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
            <button
              type="button"
              onClick={() => {
                setWageMode("yearly");
                setGrossWage(40000);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                wageMode === "yearly"
                  ? "bg-accent text-accent-contrast"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              Jahresgehalt
            </button>
            <button
              type="button"
              onClick={() => {
                setWageMode("hourly");
                setGrossWage(20);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                wageMode === "hourly"
                  ? "bg-accent text-accent-contrast"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              Stundenlohn
            </button>
          </div>
        </div>

        <Field
          label={wageMode === "yearly" ? "Bruttojahreslohn" : "Bruttostundenlohn"}
          value={grossWage}
          onChange={setGrossWage}
          suffix="€"
        />

        <div>
          <Slider
            label="Lohnnebenkosten"
            value={nonWagePercent}
            onChange={setNonWagePercent}
            color={nwColor}
            tooltip={NON_WAGE_TOOLTIP}
          />
          {nwMessage && <WarningBox danger={nwMessage.danger}>{nwMessage.text}</WarningBox>}
        </div>

        <Field
          label="Gemeinkosten pro Jahr"
          value={overheadYearly}
          onChange={setOverheadYearly}
          suffix="€"
          tooltip="Fixkosten: Miete, Fahrzeuge, Verwaltung, Versicherung etc."
        />

        <div className="border-t border-border pt-5">
          <Slider
            label="Unproduktive Zeit"
            value={unproductivePercent}
            onChange={setUnproductivePercent}
            color={upColor}
            tooltip={UNPRODUCTIVE_TOOLTIP}
          />
          {upMessage.kind === "hint" ? (
            <Hint color={upMessage.color}>{upMessage.text}</Hint>
          ) : (
            <WarningBox danger={upMessage.danger}>{upMessage.text}</WarningBox>
          )}
        </div>

        <div className="border-t border-border pt-5">
          <Slider
            label="Wagnis & Gewinn"
            value={profitMargin}
            onChange={setProfitMargin}
            color={pfColor}
            tooltip={PROFIT_TOOLTIP}
          />
          {pfMessage.kind === "hint" ? (
            <Hint color={pfMessage.color}>{pfMessage.text}</Hint>
          ) : (
            <WarningBox danger={pfMessage.danger}>{pfMessage.text}</WarningBox>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[var(--radius)] border border-border bg-surface p-5 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Stundenverrechnungssatz (Brutto)
          </div>
          <div className="mt-1.5 font-mono text-3xl font-bold text-accent">
            {currency.format(calc.customerRate)}
            <span className="text-base font-normal text-ink-faint"> /h</span>
          </div>
          <div className="mt-1 text-sm text-ink-muted">
            Netto: {currency.format(calc.hourlyRateWithProfit)}
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-border bg-paper p-4 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Interner Stundensatz
          </div>
          <div className="text-xs text-ink-faint">Ihre Kosten pro produktive Stunde</div>
          <div className="mt-1 font-mono text-xl font-semibold text-ink">
            {currency.format(calc.hourlyRate)}{" "}
            <span className="text-sm font-normal text-ink-faint">/h</span>
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-border bg-surface">
          <div className="border-b border-border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
            Jahresübersicht
          </div>
          <Row label="Gesamtkosten p.a." value={currency.format(calc.totalCosts)} strong />
          <Row
            label="Produktive Stunden p.a."
            value={`${num(calc.productiveHours, 0)} Std.`}
            strong
          />
          <div className="border-y border-border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
            Aufschlüsselung Stundensatz
          </div>
          <Row label="Basis (Ihre Kosten / h)" value={currency.format(calc.hourlyRate)} strong />
          <Row
            label={`+ Wagnis & Gewinn (${profitMargin}%)`}
            value={currency.format(calc.hourlyRate * (profitMargin / 100))}
            indent
          />
          <Row
            label="= Netto-Verrechnungssatz"
            value={currency.format(calc.hourlyRateWithProfit)}
            strong
          />
          <Row
            label="+ MwSt. (19%)"
            value={currency.format(calc.hourlyRateWithProfit * 0.19)}
            indent
          />
          <div className="border-t border-border">
            <Row
              label="= Endpreis / h (Kunde)"
              value={currency.format(calc.customerRate)}
              accent
            />
          </div>
        </div>
      </div>
    </div>
  );
}
