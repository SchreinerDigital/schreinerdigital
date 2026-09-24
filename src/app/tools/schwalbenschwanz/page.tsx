import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { SchwalbenschwanzRechner } from "./schwalbenschwanz-rechner";
import { SchwalbenschwanzGuide } from "./schwalbenschwanz-guide";

const tool = getTool("schwalbenschwanz")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function SchwalbenschwanzPage() {
  return (
    <ToolShell title={tool.title} description={tool.description} wide>
      <SchwalbenschwanzRechner />
      <SchwalbenschwanzGuide />
    </ToolShell>
  );
}
