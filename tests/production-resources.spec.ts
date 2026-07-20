import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("production-resources", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=production-resources");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 20);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/production-resources.png",
    testSettings,
  );
});
