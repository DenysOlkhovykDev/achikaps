import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("moving-resources", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=moving-resources");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 6);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/moving-resources.png",
    testSettings,
  );
});
