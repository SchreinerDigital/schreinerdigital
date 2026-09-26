import type { Metadata } from "next";
import Link from "next/link";
import { getAllMeta } from "@/lib/content";
import { tools } from "@/components/tools/tools.config";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Alle Seiten von schreiner.digital auf einen Blick – Rechner, Materialkunde, Digitalisierung, Betrieb & Recht und Downloads.",
  alternates: { canonical: "/sitemap" },
};

interface SitemapLink {
  href: string;
  label: string;
}

interface SitemapSection {
  title: string;
  overview?: SitemapLink;
  links: SitemapLink[];
  dense?: boolean;
}

const digitalisierungArtikel: SitemapLink[] = [
  { href: "/digitalisierung/aufmass-apps", label: "Aufmaß-Apps" },
  { href: "/digitalisierung/aufmass-angebotserstellung", label: "Aufmaß & Angebotserstellung" },
  { href: "/digitalisierung/kalkulationssoftware", label: "Kalkulationssoftware" },
  { href: "/digitalisierung/auftragskalkulation", label: "Auftragskalkulation" },
  { href: "/digitalisierung/projektplanung", label: "Projektplanung" },
  { href: "/digitalisierung/fertigungsprozesse-optimieren", label: "Fertigungsprozesse optimieren" },
  { href: "/digitalisierung/cad-cam-software", label: "CAD/CAM-Software" },
  { href: "/digitalisierung/cad-cam-einfuehrung", label: "CAD/CAM-Einführung" },
  { href: "/digitalisierung/stuecklisten-cnc-ausgabe", label: "Stücklisten & CNC-Ausgabe" },
  { href: "/digitalisierung/schnittstellen-cad-erp-cnc", label: "Schnittstellen: CAD/ERP/CNC" },
  { href: "/digitalisierung/cloud-tools-dateiverwaltung", label: "Cloud-Tools & Dateiverwaltung" },
  { href: "/digitalisierung/datenmanagement-backups", label: "Datenmanagement & Backups" },
  { href: "/digitalisierung/papierloses-buero", label: "Papierloses Büro" },
];

const betriebUndRechtArtikel: SitemapLink[] = [
  { href: "/betrieb-und-recht/gewaehrleistung-maengelhaftung", label: "Gewährleistung & Mängelhaftung" },
  { href: "/betrieb-und-recht/meisterpflicht-handwerksordnung", label: "Meisterpflicht & Handwerksordnung" },
  { href: "/betrieb-und-recht/aufbewahrungspflichten-gobd", label: "Aufbewahrungspflichten & GoBD" },
  { href: "/betrieb-und-recht/datenschutz-dsgvo", label: "Datenschutz (DSGVO)" },
  { href: "/betrieb-und-recht/e-rechnung", label: "E-Rechnungspflicht" },
  { href: "/betrieb-und-recht/zeitmanagement", label: "Zeitmanagement & Arbeitszeiterfassung" },
  { href: "/betrieb-und-recht/mahnverfahren-inkasso-klage", label: "Mahnverfahren, Inkasso oder Klage?" },
  { href: "/betrieb-und-recht/arbeitsvorbereitung", label: "Arbeitsvorbereitung" },
  { href: "/betrieb-und-recht/lagerverwaltung-materialfluss", label: "Lagerverwaltung & Materialfluss" },
  { href: "/betrieb-und-recht/qualitaetsmanagement", label: "Qualitätsmanagement" },
  { href: "/betrieb-und-recht/preisgestaltung-wirtschaftlichkeit", label: "Preisgestaltung & Wirtschaftlichkeit" },
  { href: "/betrieb-und-recht/kundenkommunikation", label: "Kundenkommunikation" },
  { href: "/betrieb-und-recht/marketing", label: "Marketing für Schreinereien" },
];

export default async function SitemapPage() {
  const [holzarten, plattenwerkstoffe, verbindungstechnik, beschlaege, oberflaechen, maschinenWerkzeuge] =
    await Promise.all([
      getAllMeta("holzarten"),
      getAllMeta("plattenwerkstoffe"),
      getAllMeta("verbindungstechnik"),
      getAllMeta("beschlaege"),
      getAllMeta("oberflaechen"),
      getAllMeta("maschinen-werkzeuge"),
    ]);

  const sections: SitemapSection[] = [
    {
      title: "Rechner",
      overview: { href: "/tools", label: "Alle Rechner ansehen" },
      links: tools
        .filter((t) => t.ready)
        .map((t) => ({ href: `/tools/${t.slug}`, label: t.title })),
    },
    {
      title: "Holzarten",
      overview: { href: "/holzarten", label: "Holzarten-Lexikon ansehen" },
      links: [
        { href: "/holzarten/grundlagen", label: "Holzarten bestimmen – Grundlagen" },
        { href: "/holzarten/holzfeuchte-messen", label: "Holzfeuchte richtig messen" },
        ...holzarten.map((h) => ({ href: `/holzarten/${h.slug}`, label: h.title })),
      ],
      dense: true,
    },
    {
      title: "Plattenwerkstoffe",
      overview: { href: "/plattenwerkstoffe", label: "Alle Plattenwerkstoffe ansehen" },
      links: plattenwerkstoffe.map((p) => ({ href: `/plattenwerkstoffe/${p.slug}`, label: p.title })),
      dense: true,
    },
    {
      title: "Verbindungstechnik",
      overview: { href: "/verbindungstechnik", label: "Alle Verbindungstechniken ansehen" },
      links: verbindungstechnik.map((v) => ({ href: `/verbindungstechnik/${v.slug}`, label: v.title })),
      dense: true,
    },
    {
      title: "Beschläge",
      overview: { href: "/beschlaege", label: "Alle Beschläge ansehen" },
      links: beschlaege.map((b) => ({ href: `/beschlaege/${b.slug}`, label: b.title })),
      dense: true,
    },
    {
      title: "Oberflächen",
      overview: { href: "/oberflaechen", label: "Alle Oberflächen ansehen" },
      links: oberflaechen.map((o) => ({ href: `/oberflaechen/${o.slug}`, label: o.title })),
      dense: true,
    },
    {
      title: "Maschinen & Werkzeuge",
      overview: { href: "/maschinen-werkzeuge", label: "Alle Maschinen & Werkzeuge ansehen" },
      links: maschinenWerkzeuge.map((m) => ({ href: `/maschinen-werkzeuge/${m.slug}`, label: m.title })),
      dense: true,
    },
    {
      title: "Türenwissen",
      links: [{ href: "/tueren-abc", label: "Türen-ABC" }],
    },
    {
      title: "Digitalisierung",
      overview: { href: "/digitalisierung", label: "Digitalisierung im Überblick" },
      links: digitalisierungArtikel,
      dense: true,
    },
    {
      title: "Betrieb & Recht",
      overview: { href: "/betrieb-und-recht", label: "Betrieb & Recht im Überblick" },
      links: betriebUndRechtArtikel,
      dense: true,
    },
    {
      title: "Vorlagen & Downloads",
      links: [
        { href: "/vorlagen", label: "Vorlagen & Downloads" },
        { href: "/vorlagen/auftragsabwicklung", label: "Lehrzettel-Serie „Auftragsabwicklung“" },
        { href: "/cad", label: "CAD-Vorlagen" },
      ],
    },
    {
      title: "Rechtliches",
      links: [
        { href: "/impressum", label: "Impressum" },
        { href: "/datenschutz", label: "Datenschutz" },
      ],
    },
  ];

  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Alle Seiten</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Sitemap</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Jede Seite von schreiner.digital an einem Ort – nützlich, wenn du
        gezielt etwas suchst, statt dich durch die Navigation zu klicken.
      </p>

      <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{section.title}</h2>
            <ul className={section.dense ? "mt-3 text-sm sm:columns-2 sm:gap-x-6" : "mt-3 text-sm"}>
              {section.overview && (
                <li className="mb-2 break-inside-avoid">
                  <Link
                    href={section.overview.href}
                    className="break-words font-medium text-accent hover:underline"
                  >
                    {section.overview.label}
                  </Link>
                </li>
              )}
              {section.links.map((link) => (
                <li key={link.href} className="mb-2 break-inside-avoid">
                  <Link
                    href={link.href}
                    className="break-words text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
