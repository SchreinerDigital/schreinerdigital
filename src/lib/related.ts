import "server-only";
import { getAllMeta } from "@/lib/content";
import type { ContentCollection } from "@/types/content";

export interface RelatedItem {
  slug: string;
  title: string;
  summary: string;
}

interface MetaLike {
  slug: string;
  title: string;
  summary: string;
}

type Indexable = Record<string, unknown>;

/**
 * Related items from the same collection, preferring entries that share
 * `groupField` (e.g. "gruppe" for Holzarten, "kategorie" elsewhere).
 * Starts right after the current entry within its group and wraps around,
 * so different entries in the same group don't all point at the same
 * top-N neighbors. Backfills from the rest of the collection if the
 * group itself has fewer than `limit` other members.
 */
export async function getRelatedEntries(
  collection: ContentCollection,
  current: MetaLike,
  groupField: string,
  limit = 4,
): Promise<RelatedItem[]> {
  const all = (await getAllMeta(collection)) as unknown as (MetaLike & Indexable)[];
  const others = all.filter((m) => m.slug !== current.slug);

  const groupValue = (current as unknown as Indexable)[groupField];
  const sameGroup = groupValue
    ? others.filter((m) => m[groupField] === groupValue)
    : [];

  let ordered = sameGroup;
  if (sameGroup.length > 0) {
    const currentIndexInGroupSource = all
      .filter((m) => m[groupField] === groupValue)
      .findIndex((m) => m.slug === current.slug);
    const startOffset = currentIndexInGroupSource % sameGroup.length;
    ordered = [...sameGroup.slice(startOffset), ...sameGroup.slice(0, startOffset)];
  }

  const picked = ordered.slice(0, limit);
  if (picked.length < limit) {
    const pickedSlugs = new Set(picked.map((m) => m.slug));
    const backfill = others.filter((m) => !pickedSlugs.has(m.slug));
    picked.push(...backfill.slice(0, limit - picked.length));
  }

  return picked.map((m) => ({ slug: m.slug, title: m.title, summary: m.summary }));
}
