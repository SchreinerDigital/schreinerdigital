import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { assertSupabaseEnv, env } from "@/lib/env";

/**
 * Supabase client for use in Server Components, Route Handlers and Server Actions.
 *
 * Nothing calls this yet – auth flows are added in a later step.
 */
export async function createClient() {
  assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` from a Server Component – safe to ignore when a
          // proxy/route handler refreshes the session instead.
        }
      },
    },
  });
}
