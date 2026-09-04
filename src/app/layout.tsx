import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";

const display = Space_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--ff-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "schreiner.digital – Wissen & Werkzeuge für die Schreinerei",
    template: "%s · schreiner.digital",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "schreiner.digital",
      url: "https://schreinerdigital.de",
      description:
        "Fundierte Steckbriefe zu Holzarten und Plattenwerkstoffen sowie praxisnahe Rechner-Tools für den Schreineralltag.",
    },
    {
      "@type": "WebSite",
      name: "schreiner.digital",
      url: "https://schreinerdigital.de",
      inLanguage: "de-DE",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
