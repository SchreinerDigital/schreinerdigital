import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { PlattengewichtRechner } from "./plattengewicht-rechner";
import { PlattengewichtGuide } from "./plattengewicht-guide";

const tool = getTool("plattengewicht")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function PlattengewichtPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <PlattengewichtRechner />
      <PlattengewichtGuide />
    </ToolShell>
  );
}
