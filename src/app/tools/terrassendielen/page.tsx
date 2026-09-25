import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { TerrassendielenRechner } from "./terrassendielen-rechner";
import { TerrassendielenGuide } from "./terrassendielen-guide";

const tool = getTool("terrassendielen")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function TerrassendielenPage() {
  return (
    <ToolShell title={tool.title} description={tool.description} wide>
      <TerrassendielenRechner />
      <TerrassendielenGuide />
    </ToolShell>
  );
}
