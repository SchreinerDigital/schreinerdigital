import { NextResponse } from "next/server";
import { runAuftragsabwicklungDrip } from "@/lib/newsletter-drip";

/**
 * Invoked daily by Vercel Cron (see vercel.json). Vercel injects
 * `Authorization: Bearer ${CRON_SECRET}` on its own invocations when
 * CRON_SECRET is set – anything else is rejected, and the route refuses to
 * run at all if the secret isn't configured (fail closed, since this sends
 * real emails).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET ist nicht konfiguriert." }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }

  const result = await runAuftragsabwicklungDrip();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
