import type { TechnicalDatum } from "@/types/content";

/**
 * Technical data table used inside Holzarten / Plattenwerkstoffe MDX files.
 *
 * Usage in MDX:
 *   <Datentabelle rows={meta.kennwerte} />
 */
export function Datentabelle({ rows }: { rows?: TechnicalDatum[] }) {
  if (!rows?.length) return null;

  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-holz-200/60">
              <th
                scope="row"
                className="py-2 pr-4 text-left font-medium text-foreground/70 align-top"
              >
                {row.label}
              </th>
              <td className="py-2 font-mono tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
