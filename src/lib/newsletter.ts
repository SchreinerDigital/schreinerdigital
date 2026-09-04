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

function readConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  const templateId = process.env.BREVO_DOI_TEMPLATE_ID;
  if (!apiKey || !listId || !templateId) return null;
  return { apiKey, listId: Number(listId), templateId: Number(templateId) };
}

export async function subscribeToNewsletter({
  email,
  redirectionUrl,
  source,
}: NewsletterSignup): Promise<NewsletterResult> {
  const config = readConfig();
  if (!config) {
    console.error(
      "Newsletter-Anmeldung fehlgeschlagen: BREVO_API_KEY/BREVO_LIST_ID/BREVO_DOI_TEMPLATE_ID nicht gesetzt.",
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
