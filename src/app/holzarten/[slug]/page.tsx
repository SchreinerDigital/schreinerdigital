import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, getSlugs } from "@/lib/content";
import { Container } from "@/components/ui/container";

export async function generateStaticParams() {
  const slugs = await getSlugs("holzarten");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/holzarten/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("holzarten", slug);
  if (!entry) return {};
  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/holzarten/${slug}` },
  };
}

export default async function HolzartPage({
  params,
}: PageProps<"/holzarten/[slug]">) {
  const { slug } = await params;
  const entry = await getEntry("holzarten", slug);
  if (!entry) notFound();

  const { default: Content, meta } = entry;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.summary,
    articleSection: meta.gruppe,
    about: meta.botanical,
    inLanguage: "de-DE",
  };

  return (
    <Container className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/holzarten"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Holzarten
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">{meta.title}</h1>
        {(meta.gruppe || meta.klasse || meta.dinCode) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-xs uppercase tracking-wider text-ink-faint">
            {meta.gruppe && <span>{meta.gruppe}</span>}
            {meta.klasse && <span>· {meta.klasse}</span>}
            {meta.dinCode && <span>· DIN {meta.dinCode}</span>}
          </div>
        )}
        {meta.botanical && (
          <p className="mt-2 text-base italic text-ink-faint">{meta.botanical}</p>
        )}
        {meta.synonyms && meta.synonyms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.synonyms.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-ink-muted"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {meta.bild && (
        <div className="mt-8 max-w-2xl">
          <div className="relative aspect-16/9 overflow-hidden rounded-[var(--radius)] border border-border">
            <Image
              src={meta.bild}
              alt={meta.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 672px) 672px, 100vw"
            />
          </div>
          {meta.bildCredit && (
            <p className="mt-1.5 text-xs text-ink-faint">
              {meta.bildCreditHref ? (
                <a
                  href={meta.bildCreditHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:text-accent hover:underline"
                >
                  {meta.bildCredit}
                </a>
              ) : (
                meta.bildCredit
              )}
            </p>
          )}
        </div>
      )}

      <article className="prose prose-schreiner mt-8 max-w-2xl">
        <Content />
      </article>
    </Container>
  );
}
