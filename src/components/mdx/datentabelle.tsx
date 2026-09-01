import type { TechnicalDatum } from "@/types/content";

/**
 * Technical data table used inside Holzarten / Plattenwerkstoffe MDX files.
 *
 * Usage in MDX:  <Datentabelle rows={meta.kennwerte} />
 */
export function Datentabelle({ rows }: { rows?: TechnicalDatum[] }) {
  if (!rows?.length) return null;

  return (
    <div className="not-prose my-8 overflow-x-auto rounded-[var(--radius)] border border-border">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={i > 0 ? "border-t border-border" : undefined}
            >
              <th
                scope="row"
                className="w-1/2 bg-surface-2/60 px-4 py-2.5 text-left align-top font-medium text-ink-muted"
              >
                {row.label}
              </th>
              <td className="px-4 py-2.5 font-mono tabular-nums text-ink">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
