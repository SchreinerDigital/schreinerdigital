import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Allow-list of pages that may request a signup, and where to send the confirmed visitor. */
const REDIRECTS: Record<string, string> = {
  homepage: "/",
  vorlagen: "/vorlagen/bestaetigt",
  cad: "/cad/bestaetigt",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { email, consent, source } =
    body as { email?: unknown; consent?: unknown; source?: unknown };

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." },
      { status: 400 },
    );
  }
  if (consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Bitte stimme der Datenschutzerklärung zu." },
      { status: 400 },
    );
  }
  if (typeof source !== "string" || !(source in REDIRECTS)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const result = await subscribeToNewsletter({
    email,
    source,
    redirectionUrl: `${siteUrl}${REDIRECTS[source]}`,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
