import { expect, type Page } from "@playwright/test";

export const testSettings = {
  threshold: 0,
  maxDiffPixels: 50,
  maxDiffPixelRatio: 0.0005,
};

export async function skipFrames(page: Page, frames: number, step = 16.66) {
  await page.evaluate(
    ({ frames, step }) => {
      const app = window.app;

      app.ticker.stop();

      let time = 0;
      const scale = 1;

      for (let i = 0; i < frames / scale; i++) {
        time += step * scale;
        app.ticker.update(time);
      }
    },
    { frames, step },
  );
}

export async function initGame(page: Page, scenario: string) {
  await page.goto(`/?scenario=${encodeURIComponent(scenario)}`);

  const canvas = page.locator("canvas");

  await canvas.waitFor({ state: "visible" });
  await page.waitForFunction(() => window.app !== undefined);
}

export async function takeCanvasSnapshot(page: Page) {
  return page.locator("canvas").screenshot();
}

export async function expectScenarioSnapshot(
  page: Page,
  scenario: string,
  frames = 0,
) {
  await initGame(page, scenario);

  if (frames > 0) {
    await skipFrames(page, frames);
  }

  const screenshot = await takeCanvasSnapshot(page);

  expect(screenshot).toMatchSnapshot(
    `./tests/screenshots/${scenario}.png`,
    testSettings,
  );
}
