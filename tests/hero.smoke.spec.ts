import { expect, test } from "@playwright/test";

test("hero smoke: headline, GLB, canvas, targets, no scroll errors", async ({ page, request }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  const glbResponse = await request.get("/animate/ivsol_coin_LIVE.optimized.glb");
  expect(glbResponse.status(), "GLB should be served from expected public path").toBe(200);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const heroHeadline = page.locator("#meet-iron-vault");
  await expect(heroHeadline).toBeVisible();
  await expect(heroHeadline).toContainText("MEET", { ignoreCase: true });
  await expect(heroHeadline).toContainText("IRON", { ignoreCase: true });
  await expect(heroHeadline).toContainText("VAULT", { ignoreCase: true });

  const whiteSpace = await heroHeadline.evaluate((node) => getComputedStyle(node).whiteSpace);
  expect(whiteSpace).toBe("nowrap");

  await expect(page.locator("section[aria-labelledby='meet-iron-vault'] canvas").first()).toBeVisible();
  await expect(page.locator("#vaultT")).toBeVisible();
  await expect(page.locator("#vaultV")).toBeVisible();
  await expect(page.locator("#ironI")).toBeVisible();
  await expect(page.locator("#meetM")).toBeVisible();

  for (let i = 0; i < 14; i += 1) {
    await page.mouse.wheel(0, 115);
    await page.waitForTimeout(80);
  }

  expect(consoleErrors, `runtime errors during hero scroll: ${consoleErrors.join(" | ")}`).toEqual([]);
});
