import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { StundensatzRechner } from "./stundensatz-rechner";
import { StundensatzGuide } from "./stundensatz-guide";

const tool = getTool("stundensatz")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function StundensatzPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <StundensatzRechner />
      <StundensatzGuide />
    </ToolShell>
  );
}
