"use client";

import { useMemo, useState } from "react";
import { num, parseNum } from "@/lib/format";

/** Typical bulk densities in kg/m³. */
const WERKSTOFFE = [
  { name: "Spanplatte", dichte: 650 },
  { name: "MDF", dichte: 750 },
  { name: "Rohspan / P2", dichte: 630 },
  { name: "Multiplex Birke", dichte: 680 },
  { name: "OSB/3", dichte: 600 },
  { name: "Tischlerplatte", dichte: 500 },
  { name: "Eiche (massiv)", dichte: 700 },
  { name: "Fichte (massiv)", dichte: 470 },
];

const field =
  "w-full rounded-md border border-holz-300 bg-background px-3 py-2 text-sm outline-none focus:border-holz-500";

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
    const volumen = l * b * d; // m³
    const stueck = volumen * rho; // kg
    return { stueck, gesamt: stueck * n, n };
  }, [laenge, breite, dicke, dichte, anzahl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Label text="Länge (mm)">
          <input
            className={field}
            inputMode="decimal"
            value={laenge}
            onChange={(e) => setLaenge(e.target.value)}
          />
        </Label>
        <Label text="Breite (mm)">
          <input
            className={field}
            inputMode="decimal"
            value={breite}
            onChange={(e) => setBreite(e.target.value)}
          />
        </Label>
        <Label text="Dicke (mm)">
          <input
            className={field}
            inputMode="decimal"
            value={dicke}
            onChange={(e) => setDicke(e.target.value)}
          />
        </Label>
        <Label text="Stückzahl">
          <input
            className={field}
            inputMode="numeric"
            value={anzahl}
            onChange={(e) => setAnzahl(e.target.value)}
          />
        </Label>
      </div>

      <Label text="Rohdichte (kg/m³)">
        <input
          className={field}
          inputMode="decimal"
          value={dichte}
          onChange={(e) => setDichte(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {WERKSTOFFE.map((w) => (
            <button
              key={w.name}
              type="button"
              onClick={() => setDichte(String(w.dichte))}
              className="rounded-full border border-holz-300 px-2.5 py-1 text-xs text-foreground/70 hover:border-holz-500 hover:text-holz-800"
            >
              {w.name}
            </button>
          ))}
        </div>
      </Label>

      <div className="rounded-lg border border-holz-200 bg-holz-50/50 p-4">
        {result ? (
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/60">Gewicht pro Platte</dt>
              <dd className="font-mono">{num(result.stueck, 1)} kg</dd>
            </div>
            {result.n > 1 && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">
                  Gesamt ({result.n} Stück)
                </dt>
                <dd className="font-mono">{num(result.gesamt, 1)} kg</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-foreground/50">
            Bitte alle Felder mit positiven Werten ausfüllen.
          </p>
        )}
      </div>
    </div>
  );
}

function Label({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-foreground/70">{text}</span>
      {children}
    </label>
  );
}
