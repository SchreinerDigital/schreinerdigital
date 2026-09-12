import "server-only";

/**
 * Sends the next due episode of the Auftragsabwicklung Lehrzettel-Serie to
 * every contact on BREVO_AUFTRAGSABWICKLUNG_LIST_ID whose turn it is, then
 * advances their progress – called on a schedule by
 * src/app/api/cron/auftragsabwicklung-drip/route.ts.
 *
 * State lives entirely on the Brevo contact as two custom attributes (no
 * extra database): AA_EPISODE (how many episodes already sent, 0–10) and
 * AA_NEXT_SEND (ISO date, set by subscribeToNewsletter() on signup and
 * advanced by EPISODE_INTERVAL_DAYS after each send here).
 */

const EPISODE_INTERVAL_DAYS = 7;

interface BrevoContact {
  email: string;
  attributes?: Record<string, unknown>;
  emailBlacklisted?: boolean;
}

export type DripRunResult =
  | { ok: true; sent: number; skipped: number; failed: number; totalContacts: number }
  | { ok: false; error: string };

function parseTemplateIds(): number[] {
  const raw = process.env.BREVO_AUFTRAGSABWICKLUNG_EPISODE_TEMPLATE_IDS ?? "";
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

async function fetchListContacts(apiKey: string, listId: number): Promise<BrevoContact[]> {
  const contacts: BrevoContact[] = [];
  const limit = 50;
  let offset = 0;

  for (;;) {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`,
      { headers: { "api-key": apiKey, accept: "application/json" } },
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(`Brevo-Listenabruf fehlgeschlagen (${res.status}): ${JSON.stringify(body)}`);
    }
    const data = (await res.json()) as { contacts?: BrevoContact[] };
    const page = data.contacts ?? [];
    contacts.push(...page);
    if (page.length < limit) break;
    offset += limit;
  }

  return contacts;
}

async function sendEpisode(apiKey: string, email: string, templateId: number) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ to: [{ email }], templateId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`Brevo-Versand fehlgeschlagen (${res.status}): ${JSON.stringify(body)}`);
  }
}

async function updateContactAttributes(
  apiKey: string,
  email: string,
  attributes: Record<string, string | number>,
) {
  const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ attributes }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`Brevo-Kontaktupdate fehlgeschlagen (${res.status}): ${JSON.stringify(body)}`);
  }
}

export async function runAuftragsabwicklungDrip(): Promise<DripRunResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_AUFTRAGSABWICKLUNG_LIST_ID;
  const templateIds = parseTemplateIds();

  if (!apiKey || !listId || templateIds.length === 0) {
    return { ok: false, error: "Brevo-Konfiguration (API-Key/Liste/Episoden-Vorlagen) unvollständig." };
  }

  let contacts: BrevoContact[];
  try {
    contacts = await fetchListContacts(apiKey, Number(listId));
  } catch (err) {
    console.error("Drip-Cron: Kontakte konnten nicht geladen werden:", err);
    return { ok: false, error: "Kontakte konnten nicht geladen werden." };
  }

  const today = new Date();
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const contact of contacts) {
    if (contact.emailBlacklisted) {
      skipped++;
      continue;
    }

    const episode = Number(contact.attributes?.AA_EPISODE ?? 0);
    const nextSendRaw = contact.attributes?.AA_NEXT_SEND;
    const nextSend = typeof nextSendRaw === "string" ? new Date(nextSendRaw) : null;

    if (!Number.isFinite(episode) || episode >= templateIds.length) {
      skipped++;
      continue;
    }
    if (nextSend && !Number.isNaN(nextSend.getTime()) && nextSend > today) {
      skipped++;
      continue;
    }

    try {
      await sendEpisode(apiKey, contact.email, templateIds[episode]);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + EPISODE_INTERVAL_DAYS);
      await updateContactAttributes(apiKey, contact.email, {
        AA_EPISODE: episode + 1,
        AA_NEXT_SEND: nextDate.toISOString().slice(0, 10),
      });
      sent++;
    } catch (err) {
      console.error(`Drip-Cron: Fehler bei Kontakt ${contact.email}:`, err);
      failed++;
    }
  }

  return { ok: true, sent, skipped, failed, totalContacts: contacts.length };
}
