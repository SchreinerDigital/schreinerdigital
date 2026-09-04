import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { vorlagen } from "@/components/downloads/vorlagen.config";

export const metadata: Metadata = {
  title: "Anmeldung bestätigt",
  robots: { index: false },
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  );
}

export default function VorlagenBestaetigtPage() {
  return (
    <Container className="py-16 sm:py-20">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckIcon className="size-7" />
      </span>
      <h1 className="mt-5 text-4xl sm:text-5xl">Danke, du bist bestätigt!</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Deine Newsletter-Anmeldung ist bestätigt. Du kannst dich jederzeit
        über den Abmeldelink in jeder E-Mail wieder abmelden.
      </p>

      <div className="mt-10">
        {vorlagen.length === 0 ? (
          <div className="max-w-2xl rounded-[var(--radius)] border border-dashed border-border-strong bg-surface p-8 text-sm text-ink-muted">
            Die ersten Vorlagen sind in Arbeit und folgen in Kürze – du
            bekommst automatisch eine E-Mail, sobald sie verfügbar sind.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vorlagen.map((v) => (
              <li
                key={v.slug}
                className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg">{v.title}</h2>
                  <Badge>{v.format}</Badge>
                </div>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{v.description}</p>
                {v.file && (
                  <a
                    href={`/downloads/${v.file}`}
                    download
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Herunterladen
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ButtonLink href="/" size="lg" variant="secondary" className="mt-10">
        Zur Startseite
      </ButtonLink>
    </Container>
  );
}
