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
const SOURCE_ENV_OVERRIDES: Record<
  string,
  {
    listIdEnv: string;
    templateIdEnv: string;
    alsoJoinGeneralList?: boolean;
    /**
     * Starts the contact at episode 0 of a drip series (see
     * src/app/api/cron/auftragsabwicklung-drip/route.ts), which picks up
     * contacts whose AA_NEXT_SEND has passed – i.e. once they actually
     * confirm the double opt-in and land on the list.
     */
    startsDrip?: boolean;
  }
> = {
  auftragsabwicklung: {
    listIdEnv: "BREVO_AUFTRAGSABWICKLUNG_LIST_ID",
    templateIdEnv: "BREVO_AUFTRAGSABWICKLUNG_DOI_TEMPLATE_ID",
    // One confirmation click enrolls the contact in both lists at once, so
    // the themed series and the general newsletter run in parallel from
    // the same signup instead of requiring a second opt-in later.
    alsoJoinGeneralList: true,
    startsDrip: true,
  },
};

function readConfig(source: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const override = SOURCE_ENV_OVERRIDES[source];
  const listId = process.env[override?.listIdEnv ?? "BREVO_LIST_ID"];
  const templateId = process.env[override?.templateIdEnv ?? "BREVO_DOI_TEMPLATE_ID"];
  if (!apiKey || !listId || !templateId) return null;

  const listIds = [Number(listId)];
  if (override?.alsoJoinGeneralList) {
    const generalListId = process.env.BREVO_LIST_ID;
    if (generalListId) listIds.push(Number(generalListId));
  }

  return { apiKey, listIds, templateId: Number(templateId) };
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

  const attributes: Record<string, string | number> = { SIGNUP_SOURCE: source };
  if (SOURCE_ENV_OVERRIDES[source]?.startsDrip) {
    // Picked up by the drip cron once the contact actually lands on the
    // list (i.e. after the double opt-in click) – see startsDrip above.
    attributes.AA_EPISODE = 0;
    attributes.AA_NEXT_SEND = new Date().toISOString().slice(0, 10);
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
        includeListIds: config.listIds,
        templateId: config.templateId,
        redirectionUrl,
        attributes,
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
