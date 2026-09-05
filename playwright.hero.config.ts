import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.HERO_SMOKE_BASE_URL ?? "https://ironvaulttoken.com",
    trace: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },
});
