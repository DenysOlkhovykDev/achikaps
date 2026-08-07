import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("showing-pointers", async ({ page }) => {
  await expectScenarioSnapshot(page, "showing-pointers");
});
