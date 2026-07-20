import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("crafting-resources", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=crafting-resources");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 50);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/crafting-resources.png",
    testSettings,
  );
});
