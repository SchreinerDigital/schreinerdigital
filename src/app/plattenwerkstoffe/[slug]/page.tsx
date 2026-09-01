import type { Metadata } from "next";
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
  };
}

export default async function PlattenwerkstoffPage({
  params,
}: PageProps<"/plattenwerkstoffe/[slug]">) {
  const { slug } = await params;
  const entry = await getEntry("plattenwerkstoffe", slug);
  if (!entry) notFound();

  const { default: Content } = entry;

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/plattenwerkstoffe"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
      >
        ← Plattenwerkstoffe
      </Link>
      <article className="prose prose-schreiner mt-6 max-w-2xl">
        <Content />
      </article>
    </Container>
  );
}
