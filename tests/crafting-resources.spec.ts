import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("crafting-resources", async ({ page }) => {
  await expectScenarioSnapshot(page, "crafting-resources", 50);
});
