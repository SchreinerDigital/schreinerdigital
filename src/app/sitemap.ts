import type { MetadataRoute } from "next";
import { getAllMeta } from "@/lib/content";
import { tools } from "@/components/tools/tools.config";
import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [holzarten, plattenwerkstoffe, verbindungstechnik, beschlaege, oberflaechen, maschinenWerkzeuge] =
    await Promise.all([
      getAllMeta("holzarten"),
      getAllMeta("plattenwerkstoffe"),
      getAllMeta("verbindungstechnik"),
      getAllMeta("beschlaege"),
      getAllMeta("oberflaechen"),
      getAllMeta("maschinen-werkzeuge"),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/holzarten`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/holzarten/grundlagen`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/plattenwerkstoffe`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/verbindungstechnik`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/beschlaege`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/oberflaechen`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/maschinen-werkzeuge`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/digitalisierung`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/digitalisierung/cad-cam-software`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/kalkulationssoftware`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/aufmass-apps`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/cad-cam-einfuehrung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/stuecklisten-cnc-ausgabe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/fertigungsprozesse-optimieren`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/auftragskalkulation`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/aufmass-angebotserstellung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/projektplanung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/cloud-tools-dateiverwaltung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/schnittstellen-cad-erp-cnc`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/papierloses-buero`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/digitalisierung/datenmanagement-backups`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/betrieb-und-recht/gewaehrleistung-maengelhaftung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/meisterpflicht-handwerksordnung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/aufbewahrungspflichten-gobd`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/datenschutz-dsgvo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/e-rechnung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/zeitmanagement`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/arbeitsvorbereitung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/lagerverwaltung-materialfluss`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/qualitaetsmanagement`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/preisgestaltung-wirtschaftlichkeit`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/kundenkommunikation`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/betrieb-und-recht/marketing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/vorlagen`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cad`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tools`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const holzartenRoutes: MetadataRoute.Sitemap = holzarten.map((h) => ({
    url: `${BASE_URL}/holzarten/${h.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const plattenwerkstoffeRoutes: MetadataRoute.Sitemap = plattenwerkstoffe.map((p) => ({
    url: `${BASE_URL}/plattenwerkstoffe/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const verbindungstechnikRoutes: MetadataRoute.Sitemap = verbindungstechnik.map((v) => ({
    url: `${BASE_URL}/verbindungstechnik/${v.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const beschlaegeRoutes: MetadataRoute.Sitemap = beschlaege.map((b) => ({
    url: `${BASE_URL}/beschlaege/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const oberflaechenRoutes: MetadataRoute.Sitemap = oberflaechen.map((o) => ({
    url: `${BASE_URL}/oberflaechen/${o.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const maschinenWerkzeugeRoutes: MetadataRoute.Sitemap = maschinenWerkzeuge.map((m) => ({
    url: `${BASE_URL}/maschinen-werkzeuge/${m.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/tools/${t.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...holzartenRoutes,
    ...plattenwerkstoffeRoutes,
    ...verbindungstechnikRoutes,
    ...beschlaegeRoutes,
    ...oberflaechenRoutes,
    ...maschinenWerkzeugeRoutes,
    ...toolRoutes,
  ];
}
