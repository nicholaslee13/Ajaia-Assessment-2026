import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

type RawEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

function normalizeEnv(input?: RawEnv) {
  return {
    NEXT_PUBLIC_SITE_URL: input?.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: input?.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: input?.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    SUPABASE_SERVICE_ROLE_KEY: input?.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  };
}

export function isSupabaseConfigured(input?: RawEnv) {
  const env = normalizeEnv(input);
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseConfig(input?: RawEnv) {
  const env = normalizeEnv(input);

  if (!isSupabaseConfigured(env)) {
    return null;
  }

  return configSchema.parse(env);
}
