import { describe, expect, it } from "vitest";

import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/env";

describe("env example", () => {
  it("documents the required Supabase variables", () => {
    const required = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    expect(required).toContain("NEXT_PUBLIC_SUPABASE_URL");
  });
});

describe("supabase env helpers", () => {
  it("returns unconfigured when required values are missing", () => {
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      }),
    ).toBe(false);
  });

  it("returns null config when values are missing", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      }),
    ).toBeNull();
  });
});
