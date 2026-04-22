import { expect, test } from "@playwright/test";

test("landing page shows magic-link sign-in when signed out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
});
