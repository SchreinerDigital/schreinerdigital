import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { vorlagen } from "@/components/downloads/vorlagen.config";

export const metadata: Metadata = {
  title: "Vorlagen & Downloads",
  description:
    "Kostenlose Vorlagen für den Werkstattalltag – Aufmaßblätter, Checklisten und mehr. Einmal anmelden, alle Vorlagen nutzen.",
  alternates: { canonical: "/vorlagen" },
};

export default function VorlagenPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Für deinen Arbeitsalltag</Eyebrow>
      <h1 className="mt-4 text-4xl sm:text-5xl">Vorlagen &amp; Downloads</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Aufmaßblätter, Checklisten und weitere Vorlagen für die Werkstatt –
        kostenlos, aber nur mit einmaliger Newsletter-Anmeldung. Nach der
        Bestätigung per E-Mail hast du dauerhaft Zugriff auf alle Vorlagen.
      </p>

      <div className="mt-10 max-w-lg rounded-[var(--radius)] border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-ink">Zugang freischalten</h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Trag dich mit deiner E-Mail-Adresse ein – wir schicken dir sofort
          den Bestätigungslink.
        </p>
        <NewsletterForm source="vorlagen" submitLabel="Zugang freischalten" className="mt-5" />
      </div>

      <div className="mt-14">
        <h2 className="text-2xl">Verfügbare Vorlagen</h2>
        {vorlagen.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
            Die ersten Vorlagen sind in Arbeit und folgen in Kürze. Wer sich
            jetzt schon einträgt, bekommt per Newsletter Bescheid, sobald sie
            verfügbar sind.
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vorlagen.map((v) => (
              <li
                key={v.slug}
                className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg">{v.title}</h3>
                  <Badge>{v.format}</Badge>
                </div>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{v.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
