import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/env";

export function createClient() {
  const env = getSupabaseConfig();

  if (!env) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
