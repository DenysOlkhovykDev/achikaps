import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("multiple-construction-of-different-buildings", async ({ page }) => {
  await page.goto(
    "http://localhost:5173/?scenario=multiple-construction-of-different-buildings",
  );

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 3 * 850);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/multiple-construction-of-different-buildings.png",
    testSettings,
  );
});
