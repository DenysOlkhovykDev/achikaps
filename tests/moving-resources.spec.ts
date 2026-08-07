import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("moving-resources", async ({ page }) => {
  await expectScenarioSnapshot(page, "moving-resources", 6);
});
