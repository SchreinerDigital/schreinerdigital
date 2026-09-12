import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { FalscheGehrungRechner } from "./falsche-gehrung-rechner";

const tool = getTool("falsche-gehrung")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function FalscheGehrungPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <FalscheGehrungRechner />
    </ToolShell>
  );
}
