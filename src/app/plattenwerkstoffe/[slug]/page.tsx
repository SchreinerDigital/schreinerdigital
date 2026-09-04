import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, getSlugs } from "@/lib/content";
import { Container } from "@/components/ui/container";

export async function generateStaticParams() {
  const slugs = await getSlugs("plattenwerkstoffe");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/plattenwerkstoffe/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("plattenwerkstoffe", slug);
  if (!entry) return {};
  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/plattenwerkstoffe/${slug}` },
  };
}

export default async function PlattenwerkstoffPage({
  params,
}: PageProps<"/plattenwerkstoffe/[slug]">) {
  const { slug } = await params;
  const entry = await getEntry("plattenwerkstoffe", slug);
  if (!entry) notFound();

  const { default: Content, meta } = entry;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.summary,
    articleSection: meta.kategorie,
    inLanguage: "de-DE",
  };

  return (
    <Container className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/plattenwerkstoffe"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Plattenwerkstoffe
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-4xl">{meta.title}</h1>
        {(meta.kategorie || meta.kurzname || meta.norm) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-xs uppercase tracking-wider text-ink-faint">
            {meta.kategorie && <span>{meta.kategorie}</span>}
            {meta.kurzname && <span>· {meta.kurzname}</span>}
            {meta.norm && <span>· {meta.norm}</span>}
          </div>
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
        <div className="relative mt-8 aspect-16/9 max-w-2xl overflow-hidden rounded-[var(--radius)] border border-border">
          <Image
            src={meta.bild}
            alt={meta.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 672px) 672px, 100vw"
          />
        </div>
      )}

      <article className="prose prose-schreiner mt-8 max-w-2xl">
        <Content />
      </article>
    </Container>
  );
}
