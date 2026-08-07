import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("scene-render", async ({ page }) => {
  await expectScenarioSnapshot(page, "scene-render", 9);
});
