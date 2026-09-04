import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { DurchbiegungRechner } from "./durchbiegung-rechner";
import { DurchbiegungGuide } from "./durchbiegung-guide";

const tool = getTool("durchbiegung")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function DurchbiegungPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <DurchbiegungRechner />
      <DurchbiegungGuide />
    </ToolShell>
  );
}
