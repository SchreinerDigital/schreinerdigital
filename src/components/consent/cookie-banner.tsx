"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  type BannerRequest,
  getBannerRequest,
  getConsent,
  openConsentSettings,
  saveConsent,
  subscribeConsent,
} from "@/lib/consent";

function getServerRequest(): BannerRequest {
  return "none";
}

export function CookieBanner() {
  const request = useSyncExternalStore(subscribeConsent, getBannerRequest, getServerRequest);

  // Re-seed the draft toggle whenever the settings panel is (re)opened –
  // React's "adjust state on a changed value" pattern, evaluated during
  // render instead of in an effect (see site-header.tsx for the same idiom).
  const [prevRequest, setPrevRequest] = useState(request);
  const [statistics, setStatistics] = useState(() => getConsent()?.statistics ?? false);
  if (request !== prevRequest) {
    setPrevRequest(request);
    if (request === "settings") {
      setStatistics(getConsent()?.statistics ?? false);
    }
  }

  if (request === "none") return null;
  const settingsOpen = request === "settings";

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-2xl rounded-[var(--radius)] border border-border bg-surface p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]">
        <p className="text-sm text-ink-muted">
          Wir verwenden nur technisch notwendige Speicherung – optional, mit
          deiner Einwilligung, auch Google Analytics zur anonymen
          Reichweitenmessung. Mehr dazu in unserer{" "}
          <Link href="/datenschutz" className="text-accent hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>

        {settingsOpen && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Notwendig</p>
                <p className="text-xs text-ink-muted">
                  Speichert z. B. deine Cookie-Auswahl. Immer aktiv.
                </p>
              </div>
              <div className="mt-0.5 shrink-0 font-mono text-xs uppercase tracking-wider text-ink-faint">
                Immer an
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Statistik</p>
                <p className="text-xs text-ink-muted">
                  Google Analytics – anonymisierte Auswertung der
                  Seitennutzung.
                </p>
              </div>
              <label className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={statistics}
                  onChange={(e) => setStatistics(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    statistics ? "bg-accent" : "bg-border-strong"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
                      statistics ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button size="sm" onClick={() => saveConsent(true)}>
            Alle akzeptieren
          </Button>
          {settingsOpen ? (
            <Button size="sm" variant="secondary" onClick={() => saveConsent(statistics)}>
              Auswahl speichern
            </Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => saveConsent(false)}>
                Nur notwendige
              </Button>
              <Button size="sm" variant="ghost" onClick={openConsentSettings}>
                Einstellungen
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
