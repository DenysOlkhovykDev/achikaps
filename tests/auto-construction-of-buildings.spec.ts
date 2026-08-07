import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("auto-construction-of-buildings", async ({ page }) => {
  await expectScenarioSnapshot(page, "auto-construction-of-buildings", 15);
});
