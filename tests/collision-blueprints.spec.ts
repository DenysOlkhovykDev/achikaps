import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("collision-blueprints", async ({ page }) => {
  await expectScenarioSnapshot(page, "collision-blueprints", 300);
});
