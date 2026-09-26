import Link from "next/link";
import type { RelatedItem } from "@/lib/related";

export function RelatedPages({
  basePath,
  heading,
  items,
}: {
  basePath: string;
  heading: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 max-w-2xl border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-ink">{heading}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="font-medium text-ink group-hover:text-accent">{item.title}</span>
              <span className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
