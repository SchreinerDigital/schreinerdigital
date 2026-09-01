import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
      <h1>Datenschutzerklärung</h1>
      <p>Platzhalter – vollständige Datenschutzerklärung folgt.</p>
    </div>
  );
}
