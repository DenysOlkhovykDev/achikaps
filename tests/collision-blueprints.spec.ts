import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("collision-blueprints", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=collision-blueprints");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 3 * 100);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/collision-blueprints.png",
    testSettings,
  );
});
