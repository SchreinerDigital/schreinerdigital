import "server-only";

/**
 * Newsletter signup via Brevo's double-opt-in contact endpoint. Brevo sends
 * the confirmation mail (using BREVO_DOI_TEMPLATE_ID) and only adds the
 * contact to BREVO_LIST_ID once the visitor clicks the link in that mail –
 * so this call never subscribes anyone by itself, it only starts the flow.
 *
 * https://developers.brevo.com/reference/create-doi-contact
 */

export interface NewsletterSignup {
  email: string;
  /** Where Brevo redirects the browser after a confirmed click. */
  redirectionUrl: string;
  /** Where the signup happened, e.g. "homepage" | "vorlagen" – stored as a contact attribute for later segmentation. */
  source: string;
}

export type NewsletterResult = { ok: true } | { ok: false; error: string };

/**
 * Sources with their own dedicated Brevo list + DOI template (separate from
 * the shared BREVO_LIST_ID/BREVO_DOI_TEMPLATE_ID "Newsletter" list) – e.g.
 * a themed email series that shouldn't mix into the general list. A source
 * not listed here falls back to the generic list/template below.
 */
const SOURCE_ENV_OVERRIDES: Record<string, { listIdEnv: string; templateIdEnv: string }> = {
  auftragsabwicklung: {
    listIdEnv: "BREVO_AUFTRAGSABWICKLUNG_LIST_ID",
    templateIdEnv: "BREVO_AUFTRAGSABWICKLUNG_DOI_TEMPLATE_ID",
  },
};

function readConfig(source: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const override = SOURCE_ENV_OVERRIDES[source];
  const listId = process.env[override?.listIdEnv ?? "BREVO_LIST_ID"];
  const templateId = process.env[override?.templateIdEnv ?? "BREVO_DOI_TEMPLATE_ID"];
  if (!apiKey || !listId || !templateId) return null;
  return { apiKey, listId: Number(listId), templateId: Number(templateId) };
}

export async function subscribeToNewsletter({
  email,
  redirectionUrl,
  source,
}: NewsletterSignup): Promise<NewsletterResult> {
  const config = readConfig(source);
  if (!config) {
    console.error(
      `Newsletter-Anmeldung fehlgeschlagen (source=${source}): Brevo-Konfiguration (API-Key/Liste/DOI-Vorlage) nicht gesetzt.`,
    );
    return { ok: false, error: "Newsletter ist derzeit nicht verfügbar." };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        "api-key": config.apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        includeListIds: [config.listId],
        templateId: config.templateId,
        redirectionUrl,
        attributes: { SIGNUP_SOURCE: source },
      }),
    });

    if (res.ok) return { ok: true };

    const body = await res.json().catch(() => null);
    console.error("Brevo-Fehler bei Newsletter-Anmeldung:", res.status, body);
    return { ok: false, error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." };
  } catch (err) {
    console.error("Netzwerkfehler bei Newsletter-Anmeldung:", err);
    return { ok: false, error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." };
  }
}
