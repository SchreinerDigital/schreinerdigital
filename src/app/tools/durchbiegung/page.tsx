import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { DurchbiegungRechner } from "./durchbiegung-rechner";

const tool = getTool("durchbiegung")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function DurchbiegungPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <DurchbiegungRechner />
    </ToolShell>
  );
}
