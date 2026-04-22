import { describe, expect, it } from "vitest";

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
