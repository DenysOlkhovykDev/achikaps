import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("auto-construction-of-buildings", async ({ page }) => {
  await page.goto(
    "http://localhost:5173/?scenario=auto-construction-of-buildings",
  );

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 3 * 5);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/auto-construction-of-buildings.png",
    testSettings,
  );
});
