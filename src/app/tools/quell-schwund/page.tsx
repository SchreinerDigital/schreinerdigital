import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { QuellSchwundRechner } from "./quell-schwund-rechner";
import { QuellSchwundGuide } from "./quell-schwund-guide";

const tool = getTool("quell-schwund")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function QuellSchwundPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <QuellSchwundRechner />
      <QuellSchwundGuide />
    </ToolShell>
  );
}
