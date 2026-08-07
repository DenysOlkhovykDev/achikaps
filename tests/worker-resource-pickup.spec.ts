import { expect, test } from "@playwright/test";
import { initGame, skipFrames } from "./test-infra";

test("builder keeps picked resource and completes Laboratory", async ({ page }) => {
  await initGame(page, "laboratory-construction");
  await skipFrames(page, 30);
  const result = await page.evaluate(() => {
    const { buildings, blueprints } = window.gameDebug!;
    return {
      laboratories: buildings.filter(
        (building: { buildingType: string }) =>
          building.buildingType === "Laboratory",
      ).length,
      blueprints: blueprints.length,
      buildingTypes: buildings.map(
        (building: { buildingType: string }) => building.buildingType,
      ),
    };
  });

  expect(result).toEqual({
    laboratories: 1,
    blueprints: 0,
    buildingTypes: expect.arrayContaining(["Laboratory"]),
  });
});
