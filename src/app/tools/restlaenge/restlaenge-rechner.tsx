"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { InfoTooltip } from "@/components/tools/info-tooltip";
import { cn } from "@/lib/cn";

type Unit = "mm" | "cm";

const STORAGE_KEY = "restlaenge-unit";

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit,
  tooltip,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unit: Unit;
  tooltip: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
        {label}
        <InfoTooltip text={tooltip} />
      </span>
      <div className="relative">
        <input
          id={id}
          type="number"
          min="0"
          step="any"
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
          {unit}
        </span>
      </div>
    </label>
  );
}

export function RestlaengeRechner() {
  const outerId = useId();
  const innerId = useId();
  const thicknessId = useId();

  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [thickness, setThickness] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [unit, setUnit] = useState<Unit>(() => {
    if (typeof window === "undefined") return "mm";
    return (localStorage.getItem(STORAGE_KEY) as Unit) || "mm";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit === unit) return;

    const conversionFactor = newUnit === "cm" ? 1 / 10 : 10;

    const convertAndFormat = (value: string) => {
      if (!value) return "";
      const n = parseFloat(value);
      if (isNaN(n)) return "";
      const converted = n * conversionFactor;
      return parseFloat(converted.toPrecision(15)).toString();
    };

    setOuterDiameter(convertAndFormat(outerDiameter));
    setInnerDiameter(convertAndFormat(innerDiameter));
    setThickness(convertAndFormat(thickness));

    setUnit(newUnit);
    setResult(null);
    setError("");
  };

  const handleCalculate = () => {
    setError("");

    let od = parseFloat(outerDiameter);
    let id = parseFloat(innerDiameter);
    let t = parseFloat(thickness);

    if (isNaN(od) || isNaN(id) || isNaN(t) || od <= 0 || id <= 0 || t <= 0) {
      setError("Bitte geben Sie für alle Felder gültige, positive Zahlen ein.");
      setResult(null);
      return;
    }

    if (unit === "cm") {
      od *= 10;
      id *= 10;
      t *= 10;
    }

    if (od <= id) {
      setError("Der Außendurchmesser muss größer als der Innendurchmesser sein.");
      setResult(null);
      return;
    }

    // Formel: L = (π × (D_außen² − D_innen²)) / (4 × Banddicke), Ergebnis in mm → m
    const lengthInMm = (Math.PI * (Math.pow(od, 2) - Math.pow(id, 2))) / (4 * t);
    const lengthInM = lengthInMm / 1000;

    setResult(lengthInM);
  };

  const isButtonDisabled = !outerDiameter || !innerDiameter || !thickness;

  const formattedResult = useMemo(() => {
    if (result === null) return "---";
    return result.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [result]);

  return (
    <div className="space-y-6">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-muted">Einheit</span>
        <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
          {(["mm", "cm"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitChange(u)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                unit === u
                  ? "bg-accent text-accent-contrast"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {u === "mm" ? "Millimeter (mm)" : "Zentimeter (cm)"}
            </button>
          ))}
        </div>
      </div>

      <Field
        id={outerId}
        label="Außendurchmesser"
        value={outerDiameter}
        onChange={setOuterDiameter}
        placeholder={unit === "mm" ? "z.B. 400" : "z.B. 40"}
        unit={unit}
        tooltip="Der gesamte Durchmesser der Rolle inklusive der Kante."
      />

      <Field
        id={innerId}
        label="Innendurchmesser"
        value={innerDiameter}
        onChange={setInnerDiameter}
        placeholder={unit === "mm" ? "z.B. 200" : "z.B. 20"}
        unit={unit}
        tooltip="Der Durchmesser des Kerns (Leerraum in der Mitte)."
      />

      <Field
        id={thicknessId}
        label="Kantendicke"
        value={thickness}
        onChange={setThickness}
        placeholder={unit === "mm" ? "z.B. 2" : "z.B. 0.2"}
        unit={unit}
        tooltip="Die Stärke einer einzelnen Lage des Kantenbands."
      />

      <button
        type="button"
        onClick={handleCalculate}
        disabled={isButtonDisabled}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Berechnen
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <div className="font-mono text-xs uppercase tracking-wider text-ink-faint">
          Geschätzte Restlänge
        </div>
        <div className="mt-1.5 font-mono text-3xl font-bold text-accent">
          {formattedResult} <span className="text-base font-normal text-ink-faint">m</span>
        </div>
      </div>

      <p className="text-xs text-ink-faint">
        Dieser Rechner liefert einen Schätzwert basierend auf geometrischen
        Berechnungen. Die tatsächliche Länge kann je nach Wicklungsdichte und
        Materialeigenschaften leicht variieren.
      </p>
    </div>
  );
}
