import { test, expect } from "@playwright/test";

test.describe("Auth Tests", () => {
  test("signup form renders and validates", async ({ page }) => {
    await page.goto("/auth/signup");
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Try submitting empty form — should show validation
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      // Form should still be on the page (not navigated away)
      await expect(page).toHaveURL(/\/auth\/signup/);
    }
  });

  test("login form renders and validates", async ({ page }) => {
    await page.goto("/auth/login");
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Try submitting empty form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await expect(page).toHaveURL(/\/auth\/login/);
    }
  });

  test("protected route /dashboard redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await page.waitForURL(/\/auth\/login|\/$/);
    const url = page.url();
    expect(url).toMatch(/\/auth\/login|\/$/);
  });

  test.skip("actual auth flow — needs Supabase running", async () => {
    // TODO: Implement with running Supabase instance
  });
});
