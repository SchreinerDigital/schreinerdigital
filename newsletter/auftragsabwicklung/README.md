# Newsletter-Serie "Auftragsabwicklung für Schreinereien"

10 "Lehrzettel"-Ausgaben, die die zehn Auftragsabwicklung-Vorlagen (`/vorlagen`)
begleiten – ein Dokument pro Ausgabe, in der Reihenfolge, in der sie in einem
echten Auftrag typischerweise anfallen. Geschrieben in der Du-Ansprache, wie
der Rest von schreiner.digital (siehe `newsletter-form.tsx`); die
Dokumentvorlagen selbst bleiben Sie-Form, weil sie an die Kunden der
Schreinerei gerichtet sind, nicht an die Schreinerei selbst.

## Reihenfolge & Betreffzeilen

| # | Datei | Dokument | Betreff |
|---|-------|----------|---------|
| 1 | `01-angebot.md` | Angebot | Das Angebot – ab wann bist du eigentlich daran gebunden? |
| 2 | `02-auftragsbestaetigung.md` | Auftragsbestätigung | Die Auftragsbestätigung – Formsache oder der eigentliche Vertragsschluss? |
| 3 | `03-anzahlungsrechnung.md` | Anzahlungsrechnung | Anzahlungsrechnung – der Steuertermin, den viele übersehen |
| 4 | `04-lieferschein.md` | Lieferschein | Der Lieferschein – von niemandem vorgeschrieben, trotzdem dein bester Beweis |
| 5 | `05-rechnung.md` | Rechnung | Die Rechnung – 10 Pflichtangaben, ohne die es teuer werden kann |
| 6 | `06-zahlungserinnerung.md` | Zahlungserinnerung | Die Zahlungserinnerung – freundlich bleiben, ohne dein Geld zu vergessen |
| 7 | `07-mahnung-1.md` | 1. Mahnung | Die 1. Mahnung – was jetzt rechtlich passiert und was sie kosten darf |
| 8 | `08-mahnung-2.md` | 2. Mahnung | Die 2. Mahnung – und der weit verbreitete Irrtum über "drei Mahnungen" |
| 9 | `09-gutschrift.md` | Gutschrift | Gutschrift – das Wort, das im Handwerk fast immer falsch benutzt wird |
| 10 | `10-storno-rechnung.md` | Stornorechnung | Stornorechnung – warum "einfach löschen" die schlechteste Idee ist |

Reihenfolge bewusst so gewählt: 1–5 der normale Ablauf eines Auftrags,
6–8 die Zahlungsverzug-Eskalation, 9–10 die beiden Korrekturfälle als
Abschluss der Serie.

Jede Datei enthält im Frontmatter Betreff, Preheader und die verlinkte
Vorlage; im Fließtext einen Verweis auf die passende, bereits gebaute Vorlage
unter `/vorlagen` (die einzelnen Vorlagen haben keine eigene Detailseite,
deshalb verlinken alle Ausgaben einheitlich auf die Übersichtsseite).

**Wichtig:** `/vorlagen` ist aktuell komplett als „Coming Soon" gebaut (siehe
`src/components/downloads/vorlagen.config.ts`) – kein Download-Button
funktioniert, es gibt nur eine „Benachrichtige mich"-Anmeldung, da der Kauf
(kein Stripe) noch nicht live ist. Die Newsletter-Texte versprechen deshalb
bewusst keinen sofortigen/kostenlosen Download, sondern kündigen nur an, dass
die passende Vorlage mit den Vorlagen-Paketen erscheint. Sobald der Kauf
freigeschaltet wird, kann diese Formulierung in allen 10 Dateien noch einmal
angepasst werden.

## Format

Bewusst als reines Markdown geschrieben, noch nicht als HTML-E-Mail-Template:
Inhalt und Wortwahl sollten erst freigegeben sein, bevor Aufwand in
E-Mail-taugliches HTML (inline CSS, Client-Kompatibilität) fließt. Sobald
Aufgabe „eigene Brevo-Liste + Landingpage" umgesetzt ist, können diese Texte
1:1 in Brevo-Templates überführt werden (`mcp__Brevo__templates_create_smtp_template`).
Die geplante Versandlogik (personalisiert, 7-Tage-Kadenz) ist ein eigener,
noch offener Schritt.

## Rechtliche Absicherung

Jede Ausgabe endet mit dem Standardhinweis "Alle Angaben ohne Gewähr und
keine Rechts-/Steuerberatung im Einzelfall" – dieselbe Formulierung, die
bereits in den bestehenden Artikeln unter `/betrieb-und-recht` verwendet wird.

## Recherchequellen (Auswahl, alle per Websuche gegengeprüft)

Der vom Nutzer genannte Link https://rechnungen-muster.de/ war über den
Netzwerk-Egress-Proxy dieser Umgebung nicht erreichbar (EGRESS_BLOCKED) und
konnte nicht direkt eingesehen werden. Stattdessen wurden mehrere unabhängige
Quellen abgeglichen:

- § 14 UStG Pflichtangaben (10 Punkte ab 250 €) – u. a. steuer-erklaerer.de,
  invoice-creator.fr, kostenlose-erechnung.de
- § 33 UStDV Kleinbetragsrechnung (250-€-Grenze, 5 vereinfachte Angaben) –
  sevdesk.de, ordio.com, scopevisio.com
- § 14b UStG (6-Monats-Rechnungsfrist bei Grundstücksleistungen,
  2-Jahres-Aufbewahrungshinweis für Privatkunden) – rechnungswesen-info.de,
  buzer.de
- § 286, § 288 BGB (Verzug, Verzugszinsen 5/9 Prozentpunkte, 40-€-Pauschale) –
  schuldnerberatung.de, hwk-leipzig.de, lecturio.de
- § 145, § 147, § 148 BGB (Bindung an den Antrag, Annahmefrist) –
  jurahilfe.de, lecturio.de, servanda.ai
- § 650 BGB (Kostenanschlag, Überschreitung, Anzeigepflicht) –
  baurechtsiegen.de, baurechtsuche.de
- § 13 Abs. 1 Nr. 1a UStG (Sollversteuerung von Anzahlungen) – Haufe,
  onlinebilanz.de
- § 14c UStG / Stornorechnung-Praxis – rechnungswesen-portal.de, lexware.de
- Lieferschein-Beweisfunktion, § 147 AO – kanzlei-herfurtner.de, IHK Südthüringen
- Bereits vorhandene, eigene Recherche im Repo: `/betrieb-und-recht/e-rechnung`
  (E-Rechnungspflicht 2025–2028) und `/betrieb-und-recht/aufbewahrungspflichten-gobd`
  (8-Jahres-Frist seit 1.1.2025) – dort verlinkt statt dupliziert.

Direkter Zugriff auf gesetze-im-internet.de und dejure.org war in dieser
Umgebung ebenfalls durch den Egress-Proxy blockiert; die Gesetzestexte wurden
daher über die oben genannten Sekundärquellen inhaltlich gegengeprüft
(mehrere unabhängige Treffer pro Norm, keine widersprüchlichen Angaben).
