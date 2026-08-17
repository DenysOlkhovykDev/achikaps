import { test, expect } from "@playwright/test";
import { testSettings, skipFrames, initGame } from "./test-infra";

const testName = "showing-pointers";

test(testName, async ({ page }) => {
  await initGame(page, testName);

  await skipFrames(page, 25);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(testName + ".png", testSettings);
});
