import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage returns 200 and has content", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(0);
  });

  test("/api/health returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toMatchObject({ status: "ok" });
  });

  test("/pricing renders", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("/terms renders", async ({ page }) => {
    const response = await page.goto("/terms");
    expect(response?.status()).toBe(200);
  });

  test("/privacy renders", async ({ page }) => {
    const response = await page.goto("/privacy");
    expect(response?.status()).toBe(200);
  });

  test("/auth/login renders form", async ({ page }) => {
    await page.goto("/auth/login");
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});

test.describe("Mobile viewport", () => {
  test.use({ viewport: { width: 393, height: 852 } });

  test("no horizontal overflow on homepage", async ({ page }) => {
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
