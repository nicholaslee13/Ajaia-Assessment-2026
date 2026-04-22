"use client";

import { useActionState } from "react";

import { sendMagicLink } from "@/app/actions/auth";

const initialState = { message: "" };

export function SignInForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);

  return (
    <form action={formAction}>
      <h1>Sign in</h1>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required />
      <button disabled={pending} type="submit">
        Send magic link
      </button>
      {state.message ? <p>{state.message}</p> : null}
    </form>
  );
}
