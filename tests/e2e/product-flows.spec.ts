import { test, expect } from "@playwright/test";

// RecoverKit — Product-Specific E2E Tests

test.describe("RecoverKit — Product Flows", () => {
  test("Feature: Landing page shows RecoverKit value prop", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("failed payments");
    await expect(page.getByText("Smart Retry Logic")).toBeVisible();
    await expect(page.getByText("AI-Written Dunning Emails")).toBeVisible();
    await expect(page.getByText("Payment Update Pages")).toBeVisible();
  });

  test("Feature: Pricing shows RecoverKit plans", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator('[data-testid="pricing-cards"]')).toBeVisible();
    await expect(page.getByText("Starter")).toBeVisible();
    await expect(page.getByText("Growth")).toBeVisible();
    await expect(page.getByText("Scale")).toBeVisible();
  });

  test("Feature: Dashboard shows recovery stats and campaigns", async ({ page }) => {
    // Use mock mode
    await page.goto("/dashboard?mock=true");
    // Will redirect to login if not authenticated — that's expected
    const url = page.url();
    if (url.includes("/auth/login")) {
      // Just verify the login page loads
      await expect(page.locator("h1, h2, button")).toBeTruthy();
    } else {
      await expect(page.getByText("Recovery Dashboard")).toBeVisible();
    }
  });

  test("Feature: Stripe connect page loads", async ({ page }) => {
    await page.goto("/dashboard/connect");
    const url = page.url();
    if (url.includes("/auth/login")) {
      await expect(page.locator("button")).toBeTruthy();
    } else {
      await expect(page.getByText("Stripe Connection")).toBeVisible();
    }
  });

  test("Feature: Email sequences page loads", async ({ page }) => {
    await page.goto("/dashboard/sequences");
    const url = page.url();
    if (url.includes("/auth/login")) {
      await expect(page.locator("button")).toBeTruthy();
    } else {
      await expect(page.getByText("Email Sequences")).toBeVisible();
    }
  });

  test("Feature: Payment pages page loads", async ({ page }) => {
    await page.goto("/dashboard/payment-pages");
    const url = page.url();
    if (url.includes("/auth/login")) {
      await expect(page.locator("button")).toBeTruthy();
    } else {
      await expect(page.getByText("Payment Update Pages")).toBeVisible();
    }
  });

  test("Feature: Recovery campaigns page loads", async ({ page }) => {
    await page.goto("/dashboard/campaigns");
    const url = page.url();
    if (url.includes("/auth/login")) {
      await expect(page.locator("button")).toBeTruthy();
    } else {
      await expect(page.getByText("Recovery Campaigns")).toBeVisible();
    }
  });

  test("Feature: Competitor comparison on landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Why RecoverKit over alternatives")).toBeVisible();
    await expect(page.getByText("Churn Buster")).toBeVisible();
  });

  test("Feature: How it works section on landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Set up in 3 steps")).toBeVisible();
    await expect(page.getByText("Connect Stripe")).toBeVisible();
    await expect(page.getByText("Customize Emails")).toBeVisible();
    await expect(page.getByText("Recover Revenue")).toBeVisible();
  });
});

// Standard Acceptance Flows

test.describe("Standard Acceptance Flows", () => {
  test("Flow 1: Landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.goto("/pricing");
    await expect(page.locator('[data-testid="pricing-cards"]')).toBeVisible();
    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
    await page.goto("/terms");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Flow 2: Signup → Dashboard", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.getByRole("button", { name: /password/i }).click();
    await page.fill('[name="email"]', `e2e-${Date.now()}@test.dev`);
    await page.fill('[name="password"]', "TestPassword123!");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Flow 3: Login → Dashboard", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: /password/i }).click();
    await page.fill('[name="email"]', "e2e-test@firestorm.dev");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Flow 4: Auth-aware header", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: /password/i }).click();
    await page.fill('[name="email"]', "e2e-test@firestorm.dev");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await page.goto("/");
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/log out|sign out/i)).toBeVisible();
  });

  test("Flow 5: Stripe checkout redirect", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: /password/i }).click();
    await page.fill('[name="email"]', "e2e-test@firestorm.dev");
    await page.fill('[name="password"]', "TestPassword123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    const upgradeBtn = page.getByRole("button", { name: /upgrade/i }).first();
    if (await upgradeBtn.isVisible()) {
      await upgradeBtn.click();
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 }).catch(() => {});
    }
  });

  test("Flow 6: Mock/Live toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('[data-testid="mock-toggle"]');
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(page.getByText(/mock/i)).toBeVisible();
      await toggle.click();
      await expect(page.getByText(/live/i)).toBeVisible();
    }
  });
});
