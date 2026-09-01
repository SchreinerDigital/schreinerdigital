import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centered page container with consistent gutters. */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </Tag>
  );
}
