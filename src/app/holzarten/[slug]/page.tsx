import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, getSlugs } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

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
  const { meta } = entry;
  return {
    title: meta.title,
    description: meta.summary,
    openGraph: meta.bild
      ? { images: [{ url: meta.bild }], title: meta.title, description: meta.summary }
      : undefined,
  };
}

export default async function HolzartPage({
  params,
}: PageProps<"/holzarten/[slug]">) {
  const { slug } = await params;
  const entry = await getEntry("holzarten", slug);
  if (!entry) notFound();

  const { default: Content, meta } = entry;

  return (
    <Container className="py-10 sm:py-14">
      <Link
        href="/holzarten"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Holzarten
      </Link>

      <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {meta.bild && (
          <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius)] border border-border">
            <Image
              src={meta.bild}
              alt={`Holzbild ${meta.title}`}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-4xl sm:text-5xl">{meta.title}</h1>
          {meta.botanical && (
            <p className="mt-2 text-lg italic text-ink-muted">{meta.botanical}</p>
          )}
          {meta.synonyms && meta.synonyms.length > 0 && (
            <p className="mt-1 text-sm text-ink-faint">
              {meta.synonyms.join(" · ")}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.gruppe && <Badge tone="accent">{meta.gruppe}</Badge>}
            {meta.klasse && <Badge>{meta.klasse}</Badge>}
            {meta.dinCode && <Badge>DIN {meta.dinCode}</Badge>}
          </div>
        </div>
      </header>

      <article className="prose prose-schreiner mt-12 max-w-2xl">
        <Content />
      </article>
    </Container>
  );
}
