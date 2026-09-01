/**
 * Centralised access to the environment variables the app expects.
 * Values are intentionally NOT validated at import time yet – wire in a
 * schema (e.g. zod / @t3-oss/env-nextjs) once auth and payments land.
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export function assertSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase-Umgebungsvariablen fehlen. Siehe .env.example (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }
}
