"use client";

import { useActionState } from "react";

import { sendMagicLink } from "@/app/actions/auth";

const initialState = { message: "" };

export function SignInForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <form action={formAction}>
      <h1>Sign in</h1>
      <p>
        {isConfigured
          ? "Use your email to receive a magic link."
          : "Preview mode: add Supabase environment variables to enable magic-link sign in."}
      </p>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required />
      <button disabled={pending || !isConfigured} type="submit">
        Send magic link
      </button>
      {state.message ? <p>{state.message}</p> : null}
    </form>
  );
}
