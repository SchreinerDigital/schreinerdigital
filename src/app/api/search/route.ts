import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search-index";

/** Static JSON search index, rebuilt only on deploy (no dynamic request data used). */
export async function GET() {
  const docs = await buildSearchIndex();
  return NextResponse.json(docs);
}
