"use client";

import { useId, useMemo, useState } from "react";
import { num, parseNum } from "@/lib/format";

/** Typical bulk densities in kg/m³. */
const WERKSTOFFE = [
  { name: "Spanplatte", dichte: 650 },
  { name: "MDF", dichte: 750 },
  { name: "Rohspan P2", dichte: 630 },
  { name: "Multiplex Birke", dichte: 680 },
  { name: "OSB/3", dichte: 600 },
  { name: "Tischlerplatte", dichte: 500 },
  { name: "Eiche massiv", dichte: 700 },
  { name: "Fichte massiv", dichte: 470 },
];

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

function Field({
  label,
  value,
  onChange,
  suffix,
  mode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  mode?: "decimal" | "numeric";
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-muted">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          className={fieldClass}
          inputMode={mode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

export function PlattengewichtRechner() {
  const [laenge, setLaenge] = useState("2800");
  const [breite, setBreite] = useState("2070");
  const [dicke, setDicke] = useState("19");
  const [dichte, setDichte] = useState("650");
  const [anzahl, setAnzahl] = useState("1");

  const result = useMemo(() => {
    const l = parseNum(laenge) / 1000;
    const b = parseNum(breite) / 1000;
    const d = parseNum(dicke) / 1000;
    const rho = parseNum(dichte);
    const n = Math.max(1, Math.round(parseNum(anzahl) || 1));
    if ([l, b, d, rho].some((v) => !Number.isFinite(v) || v <= 0)) return null;
    const stueck = l * b * d * rho; // kg
    return { stueck, gesamt: stueck * n, n };
  }, [laenge, breite, dicke, dichte, anzahl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Länge" value={laenge} onChange={setLaenge} suffix="mm" />
        <Field label="Breite" value={breite} onChange={setBreite} suffix="mm" />
        <Field label="Dicke" value={dicke} onChange={setDicke} suffix="mm" />
        <Field
          label="Stückzahl"
          value={anzahl}
          onChange={setAnzahl}
          mode="numeric"
        />
      </div>

      <div>
        <Field
          label="Rohdichte"
          value={dichte}
          onChange={setDichte}
          suffix="kg/m³"
        />
        <div className="mt-2.5 flex flex-wrap gap-2">
          {WERKSTOFFE.map((w) => (
            <button
              key={w.name}
              type="button"
              onClick={() => setDichte(String(w.dichte))}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent"
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        {result ? (
          <dl className="space-y-2">
            <div className="flex items-baseline justify-between">
              <dt className="text-sm text-ink-muted">Gewicht pro Platte</dt>
              <dd className="font-mono text-lg font-semibold text-ink">
                {num(result.stueck, 1)} kg
              </dd>
            </div>
            {result.n > 1 && (
              <div className="flex items-baseline justify-between border-t border-border pt-2">
                <dt className="text-sm text-ink-muted">
                  Gesamt · {result.n} Stück
                </dt>
                <dd className="font-mono text-lg font-semibold text-accent">
                  {num(result.gesamt, 1)} kg
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-ink-faint">
            Bitte alle Felder mit positiven Werten ausfüllen.
          </p>
        )}
      </div>
    </div>
  );
}
