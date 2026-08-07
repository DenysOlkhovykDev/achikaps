import { test } from "@playwright/test";
import { expectScenarioSnapshot } from "./test-infra";

test("multiple-construction-of-different-buildings", async ({ page }) => {
  await expectScenarioSnapshot(
    page,
    "multiple-construction-of-different-buildings",
    30,
  );
});
