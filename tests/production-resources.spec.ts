import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("production-resources", async ({ page }) => {
  await expectScenarioSnapshot(page, "production-resources", 20);
});
