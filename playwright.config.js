import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  webServer: {
    command: "npm run dev:test",
    port: 5173,
    reuseExistingServer: true,
    timeout: 50_000,
  },

  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1920, height: 1080 },
  },

  snapshotPathTemplate: "{testDir}/screenshots/{arg}{ext}",
});
