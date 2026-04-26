import { test, expect } from "@playwright/test";

import { testSettings, skipFrames } from "./test-infra";

test("scene-render", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=scene-render");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  await skipFrames(page, 3 * 3);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/scene-render.png",
    testSettings,
  );
});
