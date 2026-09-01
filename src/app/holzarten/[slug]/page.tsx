import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, getSlugs } from "@/lib/content";

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
    <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
      <Content />
    </article>
  );
}
