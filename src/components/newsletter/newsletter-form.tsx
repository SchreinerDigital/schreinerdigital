"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  source,
  submitLabel = "Anmelden",
  className,
}: {
  source: "homepage" | "vorlagen";
  submitLabel?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const consentId = useId();

  if (status === "success") {
    return (
      <div className={className}>
        <p className="text-sm font-medium text-ink">
          Fast geschafft! Wir haben dir eine E-Mail geschickt – bitte
          bestätige darüber deine Anmeldung.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent, source }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.error ?? "Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch {
      setStatus("error");
      setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label className="sr-only" htmlFor={`${consentId}-email`}>
          E-Mail-Adresse
        </label>
        <input
          id={`${consentId}-email`}
          type="email"
          required
          autoComplete="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 flex-1 rounded-full border border-border-strong bg-surface px-4 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <Button type="submit" disabled={status === "loading" || !consent} className="shrink-0">
          {status === "loading" ? "Sendet …" : submitLabel}
        </Button>
      </div>

      <label
        htmlFor={consentId}
        className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-muted"
      >
        <input
          id={consentId}
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-3.5 shrink-0 rounded-sm border-border-strong accent-accent"
        />
        <span>
          Ich melde mich zum Newsletter an und akzeptiere die{" "}
          <Link href="/datenschutz" className="text-accent hover:underline">
            Datenschutzerklärung
          </Link>
          . Ich kann meine Einwilligung jederzeit über den Abmeldelink in
          jeder E-Mail widerrufen.
        </span>
      </label>

      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}
