import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("multiple-construction-of-buildings", async ({ page }) => {
  await expectScenarioSnapshot(page, "multiple-construction-of-buildings", 30);
});
