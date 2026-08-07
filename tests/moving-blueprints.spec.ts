import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("moving-blueprints", async ({ page }) => {
  await expectScenarioSnapshot(page, "moving-blueprints", 300);
});
