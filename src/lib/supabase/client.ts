"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv, env } from "@/lib/env";

/**
 * Supabase client for use in Client Components.
 *
 * Nothing calls this yet – auth flows are added in a later step.
 */
export function createClient() {
  assertSupabaseEnv();
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
