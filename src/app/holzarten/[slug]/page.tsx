import type { Metadata } from "next";
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
  };
}

export default async function HolzartPage({
  params,
}: PageProps<"/holzarten/[slug]">) {
  const { slug } = await params;
  const entry = await getEntry("holzarten", slug);
  if (!entry) notFound();

  const { default: Content } = entry;

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/holzarten"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Holzarten
      </Link>
      <article className="prose prose-schreiner mt-6 max-w-2xl">
        <Content />
      </article>
    </Container>
  );
}
