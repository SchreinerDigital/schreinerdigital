import { NextResponse } from "next/server";
import { sendCalculatorPdfByEmail, subscribeToNewsletter } from "@/lib/newsletter";
import { siteConfig } from "@/lib/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Allow-list der Rechner, die diesen Button einbinden dürfen, mit Anzeigename fürs E-Mail-Template. */
const TOOL_NAMES: Record<string, string> = {
  terrassendielen: "Terrassendielen-Rechner",
  schwalbenschwanz: "Schwalbenschwanz-Rechner",
  "falsche-gehrung": "Falsche-Gehrung-Rechner",
  tuerenmass: "Türenmaß-Rechner",
};

// Anhang-Limit: PDFs dieser Rechner sind reine Vektor-Zeichnungen (kein Fotomaterial),
// üblicherweise wenige hundert KB. 8 MB Base64 lässt großzügig Luft, ohne Missbrauch
// (z. B. beliebige große Uploads über dieses Feld) zuzulassen.
const MAX_BASE64_LENGTH = 8 * 1024 * 1024;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { email, consent, source, fileName, pdfBase64 } = body as {
    email?: unknown;
    consent?: unknown;
    source?: unknown;
    fileName?: unknown;
    pdfBase64?: unknown;
  };

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
  if (typeof source !== "string" || !(source in TOOL_NAMES)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  // Erlaubt Komma, da die Rechner Zahlen im deutschen Format (z. B. "5,0x4,0m") in den Dateinamen einbauen.
  if (typeof fileName !== "string" || !/^[\w\-., ]{1,120}\.pdf$/i.test(fileName)) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (typeof pdfBase64 !== "string" || pdfBase64.length === 0 || pdfBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = await sendCalculatorPdfByEmail({
    email,
    fileName,
    pdfBase64,
    toolName: TOOL_NAMES[source],
  });

  if (result.ok) {
    // Best-effort: schlägt die Newsletter-Anmeldung fehl (z. B. Brevo kurzzeitig
    // nicht erreichbar), soll der Nutzer trotzdem als Erfolg sehen, dass sein
    // PDF unterwegs ist – das war die eigentliche Anfrage hinter diesem Klick.
    subscribeToNewsletter({
      email,
      source: `${source}-pdf`,
      redirectionUrl: `${siteConfig.url}/`,
    }).catch((err: unknown) => {
      console.error("Newsletter-Anmeldung nach PDF-Versand fehlgeschlagen:", err);
    });
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
