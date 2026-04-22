"use server";

import { env } from "@/lib/env";
import { createServerClient } from "@/lib/supabase/server";

type AuthState = {
  message: string;
};

export async function sendMagicLink(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");

  if (!email) {
    return { message: "Email is required." };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  return { message: "Check your email for the sign-in link." };
}
