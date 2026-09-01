import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  metadataBase: new URL("https://schreinerdigital.de"),
  title: {
    default: "schreiner.digital – Wissen & Werkzeuge für die Schreinerei",
    template: "%s · schreiner.digital",
  },
  description:
    "Fundierte Steckbriefe zu Holzarten und Plattenwerkstoffen sowie praxisnahe Rechner-Tools für den Schreineralltag.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "schreiner.digital",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
