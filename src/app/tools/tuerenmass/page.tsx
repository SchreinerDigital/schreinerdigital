import type { Metadata } from "next";
import { ToolShell, ToolStub } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";

const tool = getTool("tuerenmass")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function TuerenmassPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <ToolStub />
    </ToolShell>
  );
}
