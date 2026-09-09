import "server-only";
import { getAllMeta } from "@/lib/content";
import { tools } from "@/components/tools/tools.config";
import { vorlagen } from "@/components/downloads/vorlagen.config";
import { cadPakete, cadProdukte, CATEGORY_LABELS as CAD_CATEGORY_LABELS } from "@/components/downloads/cad.config";
import { siteConfig } from "@/lib/site";

/** One entry in the site-wide search index. */
export interface SearchDoc {
  title: string;
  description: string;
  url: string;
  /** Short display label, e.g. "Holzart", "Rechner", "Übersicht". */
  category: string;
  /** Extra terms matched against but not shown (synonyms, Kurzname, Norm, …). */
  keywords?: string[];
}

function truthy<T>(value: T | undefined | null | false): value is T {
  return Boolean(value);
}

/**
 * Assembles the full search index from every content source the site has –
 * the same universe of pages `sitemap.ts` enumerates, plus a few in-page
 * catalog items (CAD-Vorlagen, Vorlagen) that don't have their own route.
 * Mirrors sitemap.ts's draft-filtering rules so unpublished content never
 * becomes searchable before it's live.
 */
export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const [holzarten, plattenwerkstoffe, verbindungstechnik, beschlaege, oberflaechen] =
    await Promise.all([
      getAllMeta("holzarten"),
      getAllMeta("plattenwerkstoffe"),
      getAllMeta("verbindungstechnik"),
      getAllMeta("beschlaege"),
      getAllMeta("oberflaechen"),
    ]);

  const docs: SearchDoc[] = [
    {
      title: "schreiner.digital",
      description: siteConfig.description,
      url: "/",
      category: "Startseite",
    },
    {
      title: "Holzarten-Lexikon",
      description:
        "Massivholz-Lexikon für die Werkstatt: Herkunft, Holzbild, Rohdichte, Festigkeit und Verarbeitungstipps – von Ahorn bis Zwetschge.",
      url: "/holzarten",
      category: "Übersicht",
    },
    {
      title: "Plattenwerkstoffe im Überblick",
      description:
        "Span-, MDF-, OSB-, Multiplex- und Tischlerplatten im Vergleich: Aufbau, Rohdichte, Einsatzgrenzen und Hinweise zur Verarbeitung.",
      url: "/plattenwerkstoffe",
      category: "Übersicht",
    },
    {
      title: "Holzverbindungen im Überblick",
      description:
        "Zapfen, Zinken, Dübel, Lamello, Domino und Möbelverbinder: wie die Verbindungen aufgebaut sind, was sie aushalten und wann sich welche eignet.",
      url: "/verbindungstechnik",
      category: "Übersicht",
    },
    {
      title: "Möbelbeschläge im Überblick",
      description:
        "Topfscharniere, Auszüge, Griffe und Funktionsbeschläge: Einbaumaße, Tragkraft, Bohrbilder und Auswahlhilfen für den Möbelbau.",
      url: "/beschlaege",
      category: "Übersicht",
    },
    {
      title: "Oberflächenbehandlung von Holz",
      description:
        "Öl, Wachs, Lack, Beize und Lasur im Vergleich: Zusammensetzung, Schutzwirkung, Trockenzeiten und Verarbeitung – innen wie außen.",
      url: "/oberflaechen",
      category: "Übersicht",
    },
    {
      title: "Rechner-Tools",
      description:
        "Praxisnahe Rechner für den Schreineralltag: Plattengewichtsrechner, Türenmaß-Rechner, Restlängenrechner, Durchbiegungsrechner und Stundensatzrechner.",
      url: "/tools",
      category: "Übersicht",
    },
    {
      title: "Digitalisierung im Schreinerhandwerk",
      description:
        "Wie du Aufmaß, Kalkulation und Planung in deiner Schreinerei Schritt für Schritt digitalisierst – mit welchem Bereich du anfängst und worauf du bei der Software-Auswahl achten solltest.",
      url: "/digitalisierung",
      category: "Übersicht",
    },
    {
      title: "Digitale Aufmaß-Apps",
      description: "Laser-Messgeräte mit App-Anbindung im Vergleich.",
      url: "/digitalisierung/aufmass-apps",
      category: "Digitalisierung",
    },
    {
      title: "Kalkulations- & Auftragssoftware",
      description: "Von der Angebotserstellung bis zur Rechnung.",
      url: "/digitalisierung/kalkulationssoftware",
      category: "Digitalisierung",
    },
    {
      title: "CAD/CAM-Software",
      description: "3D-Planung und CNC-Anbindung im Vergleich.",
      url: "/digitalisierung/cad-cam-software",
      category: "Digitalisierung",
    },
    {
      title: "Betrieb & Recht",
      description:
        "Gewährleistung, Meisterpflicht, Aufbewahrungsfristen, Datenschutz und E-Rechnung: die wichtigsten rechtlichen Pflichten für Schreinerei- und Tischlereibetriebe im Überblick.",
      url: "/betrieb-und-recht",
      category: "Übersicht",
    },
    {
      title: "Gewährleistung & Mängelhaftung",
      description:
        "Werkvertrag, Kaufvertrag oder Werklieferungsvertrag: welches Recht gilt, welche Fristen greifen und wie die Nacherfüllung abläuft.",
      url: "/betrieb-und-recht/gewaehrleistung-maengelhaftung",
      category: "Betrieb & Recht",
    },
    {
      title: "Meisterpflicht & Handwerksordnung",
      description:
        "Warum Tischler zulassungspflichtig ist, welche Wege es neben dem Meisterbrief gibt und wie die Eintragung in die Handwerksrolle abläuft.",
      url: "/betrieb-und-recht/meisterpflicht-handwerksordnung",
      category: "Betrieb & Recht",
    },
    {
      title: "Aufbewahrungspflichten & GoBD",
      description:
        "Wie lange Rechnungen und Geschäftsbriefe aufbewahrt werden müssen und was die GoBD für die digitale Archivierung vorschreiben.",
      url: "/betrieb-und-recht/aufbewahrungspflichten-gobd",
      category: "Betrieb & Recht",
    },
    {
      title: "Datenschutz (DSGVO)",
      description:
        "Verzeichnis von Verarbeitungstätigkeiten, Datenschutzbeauftragter, Auftragsverarbeitung bei Cloud-Software und Projektfotos richtig veröffentlichen.",
      url: "/betrieb-und-recht/datenschutz-dsgvo",
      category: "Betrieb & Recht",
    },
    {
      title: "E-Rechnungspflicht",
      description:
        "Was seit 2025 im Geschäftsverkehr zwischen Unternehmen gilt, welche Formate erlaubt sind und welche Übergangsfristen es gibt.",
      url: "/betrieb-und-recht/e-rechnung",
      category: "Betrieb & Recht",
    },
    {
      title: "Vorlagen & Downloads",
      description:
        "Kostenlose Vorlagen für den Werkstattalltag – Aufmaßblätter, Checklisten und mehr. Einmal anmelden, alle Vorlagen nutzen.",
      url: "/vorlagen",
      category: "Downloads",
    },
    {
      title: "CAD-Vorlagen für Schreiner",
      description:
        "Fertige 2D-Zeichenvorlagen im DWG-Format für die DIN-gerechte Zeichnung: Einbauschrank, Möbelbau und Innenausbau. Kauf startet in Kürze.",
      url: "/cad",
      category: "Downloads",
    },
    {
      title: "Impressum",
      description: "Anbieterkennzeichnung und Kontaktdaten von schreiner.digital gemäß § 5 DDG.",
      url: "/impressum",
      category: "Rechtliches",
    },
    {
      title: "Datenschutzerklärung",
      description:
        "Wie schreiner.digital mit deinen Daten umgeht: Hosting, Cookies, Google Analytics, Newsletter und deine Rechte nach DSGVO.",
      url: "/datenschutz",
      category: "Rechtliches",
    },
  ];

  for (const h of holzarten) {
    docs.push({
      title: h.title,
      description: h.summary,
      url: `/holzarten/${h.slug}`,
      category: "Holzart",
      keywords: [h.botanical, h.gruppe, h.klasse, h.dinCode, ...(h.synonyms ?? [])].filter(truthy),
    });
  }
  for (const p of plattenwerkstoffe) {
    docs.push({
      title: p.title,
      description: p.summary,
      url: `/plattenwerkstoffe/${p.slug}`,
      category: "Plattenwerkstoff",
      keywords: [p.kurzname, p.kategorie, p.norm, ...(p.synonyms ?? [])].filter(truthy),
    });
  }
  for (const v of verbindungstechnik) {
    docs.push({
      title: v.title,
      description: v.summary,
      url: `/verbindungstechnik/${v.slug}`,
      category: "Verbindungstechnik",
      keywords: [v.kurzname, v.kategorie, v.norm, ...(v.synonyms ?? [])].filter(truthy),
    });
  }
  for (const b of beschlaege) {
    docs.push({
      title: b.title,
      description: b.summary,
      url: `/beschlaege/${b.slug}`,
      category: "Beschlag",
      keywords: [b.kurzname, b.kategorie, b.norm, ...(b.synonyms ?? [])].filter(truthy),
    });
  }
  for (const o of oberflaechen) {
    docs.push({
      title: o.title,
      description: o.summary,
      url: `/oberflaechen/${o.slug}`,
      category: "Oberfläche",
      keywords: [o.kurzname, o.kategorie, o.norm, ...(o.synonyms ?? [])].filter(truthy),
    });
  }

  for (const t of tools.filter((t) => t.ready)) {
    docs.push({
      title: t.title,
      description: t.description,
      url: `/tools/${t.slug}`,
      category: "Rechner",
    });
  }

  for (const v of vorlagen) {
    docs.push({
      title: v.title,
      description: v.description,
      url: "/vorlagen",
      category: "Vorlage",
    });
  }

  for (const p of cadProdukte.filter((p) => !p.draft)) {
    docs.push({
      title: p.titel,
      description: p.beschreibung,
      url: "/cad",
      category: `CAD-Vorlage · ${CAD_CATEGORY_LABELS[p.kategorie]}`,
    });
  }
  for (const p of cadPakete) {
    docs.push({
      title: p.titel,
      description: p.beschreibung,
      url: "/cad",
      category: "CAD-Paket",
    });
  }

  return docs;
}
