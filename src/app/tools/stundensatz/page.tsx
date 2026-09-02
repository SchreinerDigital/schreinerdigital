import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { StundensatzRechner } from "./stundensatz-rechner";

const tool = getTool("stundensatz")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function StundensatzPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <StundensatzRechner />
    </ToolShell>
  );
}
