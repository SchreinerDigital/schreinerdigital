import "server-only";
import type { ComponentType } from "react";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type {
  ContentCollection,
  HolzartMeta,
  PlattenwerkstoffMeta,
  VerbindungMeta,
} from "@/types/content";

const CONTENT_ROOT = join(process.cwd(), "src", "content");

type MetaFor<C extends ContentCollection> = C extends "holzarten"
  ? HolzartMeta
  : C extends "plattenwerkstoffe"
    ? PlattenwerkstoffMeta
    : VerbindungMeta;

/** List the MDX slugs in a collection (files prefixed with "_" are ignored). */
export async function getSlugs(collection: ContentCollection): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(join(CONTENT_ROOT, collection));
  } catch {
    return [];
  }
  return entries
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/**
 * Import a single content entry. Returns the rendered MDX component plus its
 * exported `meta`. Uses an explicit switch per collection so the bundler can
 * statically see the import globs.
 */
export async function getEntry<C extends ContentCollection>(
  collection: C,
  slug: string,
): Promise<{
  default: ComponentType;
  meta: MetaFor<C>;
} | null> {
  try {
    const mod =
      collection === "holzarten"
        ? await import(`@/content/holzarten/${slug}.mdx`)
        : collection === "plattenwerkstoffe"
          ? await import(`@/content/plattenwerkstoffe/${slug}.mdx`)
          : await import(`@/content/verbindungstechnik/${slug}.mdx`);
    return {
      default: mod.default,
      meta: { slug, ...(mod.meta ?? {}) } as MetaFor<C>,
    };
  } catch {
    return null;
  }
}

/** All entries' `meta` for listing pages, drafts excluded in production. */
export async function getAllMeta<C extends ContentCollection>(
  collection: C,
): Promise<MetaFor<C>[]> {
  const slugs = await getSlugs(collection);
  const entries = await Promise.all(
    slugs.map((slug) => getEntry(collection, slug)),
  );
  return entries
    .flatMap((e) => (e ? [e.meta] : []))
    .filter((m) => process.env.NODE_ENV === "development" || !m.draft);
}
