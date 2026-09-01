import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
      <h1>Impressum</h1>
      <p>Platzhalter – Angaben gemäß § 5 TMG folgen.</p>
    </div>
  );
}
