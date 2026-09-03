import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { RestlaengeRechner } from "./restlaenge-rechner";
import { RestlaengeGuide } from "./restlaenge-guide";

const tool = getTool("restlaenge")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function RestlaengePage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <RestlaengeRechner />
      <RestlaengeGuide />
    </ToolShell>
  );
}
