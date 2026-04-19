import type { Page } from "@playwright/test";

export const testSettings = {
  threshold: 0,
  maxDiffPixels: 50,
  maxDiffPixelRatio: 0.0005,
};

export async function skipFrames(page: Page, frames: number, step = 16.66) {
  await page.evaluate(
    ({ frames, step }) => {
      const app = (window as any).app;

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

export async function initGame(page: Page, query = "") {
  await page.goto(`http://localhost:5173/${query}`);

  const canvas = page.locator("canvas");

  await canvas.waitFor({ state: "visible" });
  await page.waitForFunction(() => (window as any).app !== undefined);
}

export async function takeCanvasSnapshot(page: Page) {
  return await page.locator("canvas").screenshot();
}
