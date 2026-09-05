import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

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

export default function CadBestaetigtPage() {
  return (
    <Container className="py-16 sm:py-20">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckIcon className="size-7" />
      </span>
      <h1 className="mt-5 text-4xl sm:text-5xl">Danke, du bist bestätigt!</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Wir benachrichtigen dich per E-Mail, sobald du die CAD-Vorlagen
        tatsächlich kaufen kannst. Du kannst dich jederzeit über den
        Abmeldelink in jeder E-Mail wieder abmelden.
      </p>

      <ButtonLink href="/cad" size="lg" variant="secondary" className="mt-8">
        Zurück zu den CAD-Vorlagen
      </ButtonLink>
    </Container>
  );
}
