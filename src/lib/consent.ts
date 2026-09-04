/**
 * Cookie-consent store shared between the banner, the footer link, and the
 * analytics loader. A tiny hand-rolled external store (module state +
 * `window` events) wired into React via `useSyncExternalStore`, so reading
 * localStorage never has to happen inside an effect.
 */

export interface ConsentState {
  /** Always true – technically required storage (e.g. this very choice) needs no consent. */
  necessary: true;
  /** Google Analytics. Only true once the visitor actively opted in. */
  statistics: boolean;
}

export type BannerRequest = "none" | "initial" | "settings";

const STORAGE_KEY = "schreinerdigital-consent";
const CHANGE_EVENT = "schreinerdigital-consent-changed";

/** Set only by openConsentSettings(); cleared again once a choice is saved. */
let forcedRequest: BannerRequest = "none";

function readStored(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.statistics === "boolean") {
      return { necessary: true, statistics: parsed.statistics };
    }
    return null;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentState | null {
  return readStored();
}

/** What the banner should currently show. Safe to call during render. */
export function getBannerRequest(): BannerRequest {
  if (forcedRequest !== "none") return forcedRequest;
  return readStored() === null ? "initial" : "none";
}

export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function saveConsent(statistics: boolean): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ necessary: true, statistics }));
    } catch {
      // localStorage unavailable (private mode, disabled storage) – the banner
      // will just keep asking on the next visit, which is an acceptable fallback.
    }
  }
  forcedRequest = "none";
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openConsentSettings(): void {
  forcedRequest = "settings";
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
