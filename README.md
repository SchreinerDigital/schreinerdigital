# SchreinerDigital

Neue Website für **schreinerdigital.de** – Materialkunde (Holzarten,
Plattenwerkstoffe) und Rechner-Tools für die Schreinerei. Ersetzt die bisherige
WordPress/Elementor-Seite.

## Stack

| Bereich      | Technologie                                  |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router) + React 19           |
| Sprache      | TypeScript                                   |
| Styling      | Tailwind CSS v4 + `@tailwindcss/typography`  |
| Inhalte      | MDX (`@next/mdx`)                            |
| Konten / DB  | Supabase (`@supabase/ssr`) – noch nicht verdrahtet |
| Zahlungen    | Stripe – noch nicht implementiert            |

## Entwicklung

```bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                  # http://localhost:3000
```

Weitere Skripte: `npm run build`, `npm run start`, `npm run lint`.

## Projektstruktur

```
src/
├── app/
│   ├── page.tsx                     Startseite
│   ├── holzarten/                   Übersicht + /holzarten/[slug]
│   ├── plattenwerkstoffe/           Übersicht + /plattenwerkstoffe/[slug]
│   └── tools/                       Rechner-Übersicht + eine Seite pro Tool
├── components/
│   ├── site-header.tsx / site-footer.tsx
│   ├── mdx/                         Bausteine für MDX-Inhalte (Datentabelle …)
│   └── tools/                       tools.config.ts, ToolShell
├── content/
│   ├── holzarten/                   MDX-Dateien (siehe content/README.md)
│   └── plattenwerkstoffe/
├── lib/
│   ├── content.ts                  MDX-Einträge lesen / auflisten
│   ├── format.ts                   Zahlenformatierung (de-DE)
│   ├── env.ts                      Zugriff auf Umgebungsvariablen
│   └── supabase/                   client.ts (Browser) / server.ts (Server)
├── types/content.ts
└── mdx-components.tsx               Pflichtdatei für @next/mdx
```

## Status / nächste Schritte

- [x] Grundgerüst: Struktur, Tailwind, MDX-Pipeline, `.env.example`, `.gitignore`
- [x] Rechner „Plattengewicht" als Referenz-Implementierung
- [ ] Inhalte: Holzarten & Plattenwerkstoffe
- [ ] Rechner: Türenmaß, Restlänge, Durchbiegung, Stundensatz
- [ ] Supabase: Auth-Flows, Schema, RLS
- [ ] Stripe: Einmalkäufe, später Abo
- [ ] Impressum / Datenschutz
