"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { InfoTooltip } from "@/components/tools/info-tooltip";
import { cn } from "@/lib/cn";
import { num } from "@/lib/format";
import { DENSITIES_IMPERIAL, DENSITIES_METRIC, KG_M3_TO_LBS_IN3, MATERIALS_METRIC } from "./materials";

const CUSTOM_MATERIAL_KEY = "custom";

type Shape = "rechteck" | "rundstab";
type UnitSystem = "metric" | "imperial";

const fieldClass =
  "w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";
const pillBase = "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors";

export function PlattengewichtRechner() {
  const [material, setMaterial] = useState("Spanplatte");
  const [densityInput, setDensityInput] = useState(String(DENSITIES_METRIC["Spanplatte"]));
  const [shape, setShape] = useState<Shape>("rechteck");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    thickness: "",
    diameter: "",
  });

  const [weight, setWeight] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: value }));
    setWeight(null);
    setError("");
  };

  const handleShapeChange = (newShape: Shape) => {
    setShape(newShape);
    setWeight(null);
    setError("");
  };

  const handleMaterialChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newMaterial = e.target.value;
    setMaterial(newMaterial);

    if (newMaterial === CUSTOM_MATERIAL_KEY) {
      setDensityInput("");
    } else {
      const densities = unitSystem === "metric" ? DENSITIES_METRIC : DENSITIES_IMPERIAL;
      const newDensity = densities[newMaterial];
      const densityString =
        unitSystem === "metric" ? newDensity.toString() : newDensity.toPrecision(6);
      setDensityInput(densityString);
    }

    setWeight(null);
    setError("");
  };

  const handleDensityInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDensityInput(e.target.value);
    setMaterial(CUSTOM_MATERIAL_KEY);
    setWeight(null);
    setError("");
  };

  const setSystem = (newSystem: UnitSystem) => {
    if (newSystem === unitSystem) return;

    const currentDensity = parseFloat(densityInput);

    if (!isNaN(currentDensity)) {
      if (newSystem === "imperial") {
        setDensityInput((currentDensity * KG_M3_TO_LBS_IN3).toPrecision(6));
      } else {
        setDensityInput(Math.round(currentDensity / KG_M3_TO_LBS_IN3).toString());
      }
    }

    setUnitSystem(newSystem);
    setWeight(null);
    setError("");
  };

  const isFormValid = useMemo(() => {
    const d = parseFloat(densityInput);
    if (isNaN(d) || d <= 0) return false;

    const { length, width, thickness, diameter } = dimensions;
    if (shape === "rechteck") {
      return Boolean(
        length &&
          width &&
          thickness &&
          !isNaN(parseFloat(length)) &&
          !isNaN(parseFloat(width)) &&
          !isNaN(parseFloat(thickness)),
      );
    }
    return Boolean(
      length && diameter && !isNaN(parseFloat(length)) && !isNaN(parseFloat(diameter)),
    );
  }, [dimensions, shape, densityInput]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    const density = parseFloat(densityInput);
    if (isNaN(density) || density <= 0) {
      setError("Ungültige Rohdichte.");
      return;
    }

    let volume = 0;
    const { length, width, thickness, diameter } = dimensions;

    if (unitSystem === "metric") {
      const l = parseFloat(length) / 1000; // mm to m
      const w = parseFloat(width) / 1000; // mm to m
      const t = parseFloat(thickness) / 1000; // mm to m
      const d = parseFloat(diameter) / 1000; // mm to m

      if (shape === "rechteck") {
        volume = l * w * t; // m³
      } else {
        const radius = d / 2;
        volume = Math.PI * radius * radius * l; // m³
      }
    } else {
      const l = parseFloat(length); // in
      const w = parseFloat(width); // in
      const t = parseFloat(thickness); // in
      const d = parseFloat(diameter); // in

      if (shape === "rechteck") {
        volume = l * w * t; // in³
      } else {
        const radius = d / 2;
        volume = Math.PI * radius * radius * l; // in³
      }
    }

    setWeight(volume * density);
  };

  const unitLabel = unitSystem === "metric" ? "mm" : "in";
  const weightUnit = unitSystem === "metric" ? "kg" : "lbs";
  const densityUnit = unitSystem === "metric" ? "kg/m³" : "lbs/in³";
  const placeholderValue = unitSystem === "metric" ? "z.B. 1000" : "z.B. 40";
  const placeholderSmall = unitSystem === "metric" ? "z.B. 19" : "z.B. 0.75";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-muted">
          Material auswählen
        </span>
        <select
          className={cn(fieldClass, "cursor-pointer")}
          value={material}
          onChange={handleMaterialChange}
        >
          {Object.entries(MATERIALS_METRIC).map(([groupName, materials]) => (
            <optgroup label={groupName} key={groupName}>
              {Object.keys(materials).map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </optgroup>
          ))}
          <option value={CUSTOM_MATERIAL_KEY}>Freie Eingabe...</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center text-sm font-medium text-ink-muted">
          Rohdichte
          <InfoTooltip
            text={`Dichte des Materials in ${densityUnit}. Wichtig für die Gewichtsberechnung.`}
          />
        </span>
        <div className="relative">
          <input
            type="number"
            className={fieldClass}
            value={densityInput}
            onChange={handleDensityInputChange}
            min="0"
            step="any"
            placeholder="Dichte"
            required
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
            {densityUnit}
          </span>
        </div>
      </label>

      <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
        <button
          type="button"
          onClick={() => setSystem("metric")}
          className={cn(
            pillBase,
            unitSystem === "metric" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
          )}
        >
          Metrisch (mm/kg)
        </button>
        <button
          type="button"
          onClick={() => setSystem("imperial")}
          className={cn(
            pillBase,
            unitSystem === "imperial" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
          )}
        >
          Imperial (in/lbs)
        </button>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-muted">Form auswählen</span>
        <div className="inline-flex rounded-full border border-border bg-paper p-0.5">
          <button
            type="button"
            onClick={() => handleShapeChange("rechteck")}
            className={cn(
              pillBase,
              shape === "rechteck" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
            )}
          >
            Rechteck
          </button>
          <button
            type="button"
            onClick={() => handleShapeChange("rundstab")}
            className={cn(
              pillBase,
              shape === "rundstab" ? "bg-accent text-accent-contrast" : "text-ink-muted hover:text-ink",
            )}
          >
            Rundstab
          </button>
        </div>
      </div>

      {shape === "rechteck" ? (
        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Länge</span>
            <div className="relative">
              <input
                type="number"
                name="length"
                className={fieldClass}
                placeholder={placeholderValue}
                value={dimensions.length}
                onChange={handleInputChange}
                min="0"
                step="any"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                {unitLabel}
              </span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Breite</span>
            <div className="relative">
              <input
                type="number"
                name="width"
                className={fieldClass}
                placeholder={unitSystem === "metric" ? "z.B. 500" : "z.B. 20"}
                value={dimensions.width}
                onChange={handleInputChange}
                min="0"
                step="any"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                {unitLabel}
              </span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Stärke</span>
            <div className="relative">
              <input
                type="number"
                name="thickness"
                className={fieldClass}
                placeholder={placeholderSmall}
                value={dimensions.thickness}
                onChange={handleInputChange}
                min="0"
                step="any"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                {unitLabel}
              </span>
            </div>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Durchmesser</span>
            <div className="relative">
              <input
                type="number"
                name="diameter"
                className={fieldClass}
                placeholder={placeholderSmall}
                value={dimensions.diameter}
                onChange={handleInputChange}
                min="0"
                step="any"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                {unitLabel}
              </span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Länge</span>
            <div className="relative">
              <input
                type="number"
                name="length"
                className={fieldClass}
                placeholder={placeholderValue}
                value={dimensions.length}
                onChange={handleInputChange}
                min="0"
                step="any"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-faint">
                {unitLabel}
              </span>
            </div>
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid}
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
          Gesamtgewicht
        </div>
        <div className="mt-1.5 font-mono text-3xl font-bold text-accent">
          {weight !== null ? (
            <>
              {num(weight, 2)}{" "}
              <span className="text-base font-normal text-ink-faint">{weightUnit}</span>
            </>
          ) : (
            "--"
          )}
        </div>
      </div>

      <p className="text-xs text-ink-faint">
        Hinweis: Die Rohdichte der Platten kann je nach Hersteller variieren. Das berechnete
        Gewicht dient daher nur als Richtwert. Passen Sie die Rohdichte bei Bedarf manuell an, um
        ein genaueres Ergebnis zu erhalten.
      </p>
    </form>
  );
}
