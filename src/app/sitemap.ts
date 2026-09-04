import type { MetadataRoute } from "next";
import { getAllMeta } from "@/lib/content";
import { tools } from "@/components/tools/tools.config";

const BASE_URL = "https://schreinerdigital.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [holzarten, plattenwerkstoffe] = await Promise.all([
    getAllMeta("holzarten"),
    getAllMeta("plattenwerkstoffe"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/holzarten`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/plattenwerkstoffe`, changeFrequency: "weekly", priority: 0.9 },
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

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/tools/${t.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...holzartenRoutes, ...plattenwerkstoffeRoutes, ...toolRoutes];
}
