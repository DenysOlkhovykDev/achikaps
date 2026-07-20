import { test, expect } from "@playwright/test";
import { testSettings } from "./test-infra";

test("showing-pointers", async ({ page }) => {
  await page.goto("http://localhost:5173/?scenario=showing-pointers");

  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => (window as any).app !== undefined);

  const screenshot = await page.locator("canvas").screenshot();

  expect(screenshot).toMatchSnapshot(
    "./tests/screenshots/showing-pointers.png",
    testSettings,
  );
});
