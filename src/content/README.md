# Inhalte (`src/content`)

Materialkunde als MDX. Ein Eintrag = eine Datei `<slug>.mdx`.

```
src/content/
├── holzarten/
│   ├── _template.mdx        Vorlage – wird nicht als Seite ausgeliefert
│   └── eiche.mdx            → /holzarten/eiche
└── plattenwerkstoffe/
    ├── _template.mdx
    └── mdf.mdx              → /plattenwerkstoffe/mdf
```

## Regeln

- Dateiname = URL-Slug (Kleinbuchstaben, Bindestriche).
- Dateien mit `_` am Anfang werden ignoriert (Vorlagen, Entwürfe).
- Jede Datei exportiert ein `meta`-Objekt (siehe `src/types/content.ts`):
  `export const meta = { title, summary, ... }`.
- `draft: true` blendet den Eintrag in Produktion aus (in `next dev` sichtbar).
- Die technische Datentabelle wird über `<Datentabelle rows={meta.kennwerte} />`
  gerendert (`src/components/mdx/datentabelle.tsx`).

## Neue Holzart anlegen

1. `_template.mdx` nach `<slug>.mdx` kopieren.
2. `meta` ausfüllen, `draft` entfernen.
3. Abschnitte füllen: Herkunft, Holzbild, Eigenschaften, Verwendung,
   Praxistipps, Technische Daten, Fazit.
