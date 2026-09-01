import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Global MDX component overrides.
 *
 * Required for `@next/mdx` with the App Router – MDX rendering will not work
 * without this file. Content-specific building blocks (e.g. the technical data
 * table for a wood species) live in `src/components/mdx/` and are wired in here.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", ...props }) => {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return <Link href={href} {...props} />;
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
      );
    },
    img: ({ alt = "", ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element -- MDX images can have any src without known dimensions
      <img
        alt={alt}
        loading="lazy"
        decoding="async"
        className="rounded-[var(--radius)] border border-border"
        {...props}
      />
    ),
    ...components,
  };
}
