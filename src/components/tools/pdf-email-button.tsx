"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { jsPDF } from "jspdf";
import { Mail, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "error";

/** Rechner, die diesen Button einbinden dürfen – muss zur Allow-Liste in src/app/api/pdf-email/route.ts passen. */
export type PdfEmailSource = "terrassendielen" | "schwalbenschwanz" | "falsche-gehrung" | "tuerenmass";

/**
 * Optionaler Zweit-Button neben dem direkten PDF-Download: statt (oder
 * zusätzlich zu) dem sofortigen Download kann sich der Nutzer das PDF an
 * seine E-Mail-Adresse schicken lassen und meldet sich dabei zum Newsletter
 * an. Der Download selbst bleibt überall kostenlos und ohne Anmeldung –
 * das hier ist ein Zusatzangebot, kein Gate.
 */
export function PdfEmailButton({
  getPdf,
  source,
  className,
  panelClassName,
}: {
  /** Erzeugt dasselbe PDF wie der Download-Button – wird erst bei Klick auf „Senden“ aufgerufen. */
  getPdf: () => Promise<{ doc: jsPDF; fileName: string }>;
  source: PdfEmailSource;
  className?: string;
  /** Ausrichtung des aufklappenden Panels, falls der Trigger nicht am rechten Rand seines Containers sitzt. */
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const consentId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const { doc, fileName } = await getPdf();
      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const res = await fetch("/api/pdf-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent, source, fileName, pdfBase64 }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.error ?? "Versand fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch {
      setStatus("error");
      setError("PDF konnte nicht erstellt werden. Bitte versuche es erneut.");
    }
  }

  function toggle() {
    setOpen((v) => !v);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-muted shadow-2xs transition-colors hover:border-accent hover:text-accent"
      >
        <Mail className="size-3.5" />
        Per E-Mail zusenden
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-paper p-4 text-left shadow-lg",
            panelClassName,
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Schließen"
            className="absolute right-3 top-3 rounded-md p-1 text-ink-faint transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="size-4" />
          </button>

          {status === "success" ? (
            <p className="pr-6 text-sm text-ink">
              PDF ist unterwegs zu <strong>{email}</strong>. Bitte bestätige zusätzlich die
              Newsletter-Anmeldung über den Link in der zweiten E-Mail.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="pr-6">
              <label className="text-xs font-semibold text-ink" htmlFor={`${consentId}-email`}>
                PDF per E-Mail erhalten
              </label>
              <input
                id={`${consentId}-email`}
                type="email"
                required
                autoComplete="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />

              <label
                htmlFor={consentId}
                className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink-muted"
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
                  Ich möchte das PDF per E-Mail erhalten und melde mich zum Newsletter an und
                  akzeptiere die{" "}
                  <Link href="/datenschutz" className="text-accent hover:underline">
                    Datenschutzerklärung
                  </Link>
                  . Ich kann meine Einwilligung jederzeit über den Abmeldelink widerrufen.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === "loading" || !consent}
                className="mt-3 flex h-9 w-full items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Sendet …" : "Senden"}
              </button>

              {status === "error" && (
                <p className="mt-2 text-[11px] font-medium text-red-700 dark:text-red-400">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
