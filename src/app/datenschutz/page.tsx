import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <Container className="py-16">
      <article className="prose prose-schreiner max-w-2xl">
        <h1>Datenschutzerklärung</h1>
        <p>Platzhalter – vollständige Datenschutzerklärung folgt.</p>
      </article>
    </Container>
  );
}
