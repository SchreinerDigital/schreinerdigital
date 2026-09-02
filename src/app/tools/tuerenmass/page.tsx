import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { getTool } from "@/components/tools/tools.config";
import { TuerenmassRechner } from "./tuerenmass-rechner";
import { TuerenmassGuide } from "./tuerenmass-guide";

const tool = getTool("tuerenmass")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function TuerenmassPage() {
  return (
    <ToolShell title={tool.title} description={tool.description}>
      <TuerenmassRechner />
      <TuerenmassGuide />
    </ToolShell>
  );
}
