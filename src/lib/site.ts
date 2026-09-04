/**
 * Canonical base URL of the site.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL   – set this once the custom domain is live
 *  2. VERCEL_PROJECT_PRODUCTION_URL – the stable *.vercel.app production URL
 *  3. localhost fallback for `next dev`
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "schreiner.digital",
  url: resolveSiteUrl(),
  description:
    "Fundierte Steckbriefe zu Holzarten und Plattenwerkstoffen sowie praxisnahe Rechner-Tools für den Schreineralltag.",
} as const;
