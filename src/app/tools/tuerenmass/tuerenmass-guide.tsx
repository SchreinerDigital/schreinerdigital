function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const steps = [
  {
    title: "Breite messen",
    body: "Messen Sie den Abstand von der linken bis zur rechten Mauerleibung an drei Stellen: oben, in der Mitte und unten. Das kleinste der drei Maße ist Ihre Rohbaubreite.",
  },
  {
    title: "Höhe messen",
    body: "Messen Sie vom fertigen Fußboden (Oberkante des Teppichs, Parketts oder der Fliesen) bis zur Unterkante des Türsturzes. Messen Sie links und rechts. Das kürzere Maß ist Ihre Rohbauhöhe.",
  },
  {
    title: "Wandstärke messen",
    body: "Messen Sie die Gesamtdicke der Wand an mehreren Stellen. Achten Sie darauf, Putz, Fliesen oder Trockenbau-Verkleidungen mitzumessen. Das größte ermittelte Maß bestimmt die benötigte Zargen-Wandstärke.",
  },
];

const massTabelle = [
  { breite: "635 – 660 mm", blattBreite: "610 mm", hoehe: "2000 – 2025 mm", blattHoehe: "1985 mm" },
  { breite: "760 – 785 mm", blattBreite: "735 mm", hoehe: "2125 – 2150 mm", blattHoehe: "2110 mm" },
  { breite: "885 – 910 mm", blattBreite: "860 mm", hoehe: "2250 – 2275 mm", blattHoehe: "2235 mm" },
  { breite: "1010 – 1035 mm", blattBreite: "985 mm", hoehe: "—", blattHoehe: "—" },
  { breite: "1135 – 1160 mm", blattBreite: "1110 mm", hoehe: "—", blattHoehe: "—" },
  { breite: "1260 – 1285 mm", blattBreite: "1235 mm", hoehe: "—", blattHoehe: "—" },
];

const faqs = [
  {
    q: "Wie messe ich die Maueröffnung (Rohbaumaß) richtig aus?",
    a: "Messen Sie stets die nackte Maueröffnung (ohne alte Zarge). Ermitteln Sie die Breite an mindestens drei Stellen (oben, mitte, unten) und nehmen Sie das schmalste Maß. Die Höhe messen Sie links und rechts von der fertig verlegten Fußbodenoberkante (OFF) bis zur Unterkante des Sturzes – nehmen Sie hier das kürzeste Maß. Die Wandstärke messen Sie an mehreren Stellen inklusive Putz, Fliesen oder Trockenbauwänden und wählen das dickste Maß.",
  },
  {
    q: "Was bedeutet DIN Links und DIN Rechts bei einer Tür?",
    a: "Die Anschlagsrichtung DIN Links oder DIN Rechts legt fest, auf welcher Seite die Scharniere (Bänder) sitzen und in welche Richtung sich die Tür öffnet. Stellen Sie sich vor die geschlossene Tür, und zwar auf die Seite, auf der Sie die Türbänder sehen können (die Tür öffnet sich auf Sie zu). Sind die Scharniere links, ist es eine DIN Links Tür. Sind die Scharniere rechts, ist es eine DIN Rechts Tür.",
  },
  {
    q: "Welchen Spielraum bieten die Standard-Zargen bei der Wandstärke?",
    a: "Moderne Türzargen verfügen über einen sogenannten Zierbekleidungs-Verstellbereich. In der Regel lässt sich die Zarge um ca. -5 mm bis +15 mm verstellen, um Toleranzen in der Wanddicke auszugleichen. Beispielsweise passt eine Standard-Zarge mit dem Nennmaß 145 mm für Wandstärken von 140 mm bis 160 mm.",
  },
  {
    q: "Warum weicht die Empfehlung im Grenzbereich ab?",
    a: "Wenn Ihre gemessenen Maße im „Grenzbereich“ liegen (gelbe Warnung), ist die Montage einer Standardzarge zwar physikalisch möglich, erfordert aber oft zusätzliche Fachkniffe – wie das Einstemmen der Bandtaschen oder das Unterfüttern der Leibung. Bei besonderen Funktionstüren (z. B. Wohnungseingangstüren mit Brand- oder Schallschutz) darf kein Grenzbereich ausgereizt werden, da sonst die Dichtigkeit verloren geht. Hier ist ein Sondermaß Pflicht.",
  },
  {
    q: "Was tun bei roten Ergebnissen (Sondermaß)?",
    a: "Wenn eine Dimension rot markiert ist, liegt das Maß weit außerhalb der DIN 18101 Norm. Sie haben zwei Möglichkeiten: Entweder passen Sie die Maueröffnung baulich an (z. B. Aufdoppeln des Sturzes, Beiputzen der Seiten oder Aufmauern) oder Sie bestellen eine maßgefertigte Tür samt Sonderzarge. Dies ist meist etwas teurer und hat längere Lieferzeiten, sorgt aber für ein perfektes, unkompliziertes Endergebnis.",
  },
];

export function TuerenmassGuide() {
  return (
    <div className="mt-16 space-y-14 border-t border-border pt-12">
      <section>
        <h2 className="text-2xl">Schritt-für-Schritt: Türen &amp; Zargen richtig ausmessen</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Das korrekte Aufmaß ist der wichtigste Schritt beim Kauf neuer Innentüren. Messen Sie
          stets das lichte Rohbaumaß (die nackte Maueröffnung) und nicht die alte Tür oder Zarge.
          Befolgen Sie diese drei Schritte, um Fehlbestellungen zu vermeiden:
        </p>

        <ol className="mt-6 space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl">DIN 18101 Maßtabelle für Standard-Innentüren</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Die DIN 18101 regelt das Verhältnis zwischen dem lichten Rohbaumaß der Wandöffnung und
          dem Türblattmaß. Hier sind die gängigsten Normmaße auf einen Blick:
        </p>

        <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-border">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="px-4 py-2.5 font-medium text-nowrap text-ink-muted">
                  Lichte Rohbaubreite (Maueröffnung)
                </th>
                <th className="px-4 py-2.5 font-medium text-nowrap text-ink-muted">Türblattbreite</th>
                <th className="px-4 py-2.5 font-medium text-nowrap text-ink-muted">
                  Lichte Rohbauhöhe (ab OFF)
                </th>
                <th className="px-4 py-2.5 font-medium text-nowrap text-ink-muted">Türblatthöhe</th>
              </tr>
            </thead>
            <tbody>
              {massTabelle.map((row, i) => (
                <tr key={row.breite} className={i > 0 ? "border-t border-border" : undefined}>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink">{row.breite}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink">{row.blattBreite}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink-muted">{row.hoehe}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink-muted">{row.blattHoehe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          * Hinweis: Für die Standard-Türblattbreite 860 mm (sehr häufig bei Wohnräumen) muss die
          Maueröffnung zwischen 885 mm und 910 mm breit sein.
        </p>
      </section>

      <section>
        <h2 className="text-2xl">Häufig gestellte Fragen (FAQ)</h2>

        <div className="mt-6 divide-y divide-border rounded-[var(--radius)] border border-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="font-medium text-ink">{faq.q}</h3>
                <ChevronIcon className="size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
