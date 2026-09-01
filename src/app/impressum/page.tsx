import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <Container className="py-16">
      <article className="prose prose-schreiner max-w-2xl">
        <h1>Impressum</h1>
        <p>Platzhalter – Angaben gemäß § 5 TMG folgen.</p>
      </article>
    </Container>
  );
}
