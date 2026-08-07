import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("construction-of-buildings", async ({ page }) => {
  await expectScenarioSnapshot(page, "construction-of-buildings", 6);
});
