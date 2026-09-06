import { expect, test } from "@playwright/test";

/**
 * Hero smoke lock. Guards the IV-SOL hero specifically:
 *  - headline + landing-letter targets present
 *  - live WebGL canvas in the hero
 *  - GLB / 3D hero assets served 200
 *  - GSAP/ScrollTrigger actually scrubs the headline while scrolling
 *  - no uncaught page errors and no hero-scoped console errors while scrolling
 *
 * Console noise that is unrelated to the hero is ignored (cross-origin
 * `/academy` RSC prefetch to member.ironvaulttoken.com, Clerk/reddit/gtag
 * third-party chatter). Hero asset failures are still fatal because they are
 * captured by URL via the response/requestfailed handlers below.
 */
test("hero smoke: headline, GLB, canvas, targets, scroll scrubs, no hero errors", async ({ page, request }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const heroAssetFailures: string[] = [];

  const isKnownNonHeroNoise = (text: string): boolean =>
    /member\.ironvaulttoken\.com/.test(text) ||
    /\/academy/.test(text) ||
    /RSC payload/.test(text) ||
    /clerk/i.test(text) ||
    /reddit/i.test(text) ||
    /googletagmanager|gtag/i.test(text) ||
    /blocked by CORS/i.test(text) ||
    /Failed to load resource/i.test(text) ||
    /ERR_ABORTED|ERR_FAILED|ERR_BLOCKED_BY_ORB/.test(text);

  const isHeroAsset = (url: string): boolean =>
    /\.glb($|\?)/.test(url) ||
    /\/animate\//.test(url) ||
    /\/models\//.test(url) ||
    /\/draco\//.test(url) ||
    /\/_next\/static\//.test(url);

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!isKnownNonHeroNoise(text)) consoleErrors.push(text);
    }
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (isHeroAsset(url)) heroAssetFailures.push(`requestfailed ${url} :: ${req.failure()?.errorText}`);
  });
  page.on("response", (resp) => {
    const url = resp.url();
    if (isHeroAsset(url) && resp.status() >= 400) {
      heroAssetFailures.push(`HTTP ${resp.status()} ${url}`);
    }
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

  const heroCanvas = page.locator("section[aria-labelledby='meet-iron-vault'] canvas").first();
  await expect(heroCanvas).toBeVisible();

  const canvasProbe = await heroCanvas.evaluate((canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return {
      width: rect.width,
      height: rect.height,
      hasWebGL: !!gl,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });
  expect(canvasProbe.hasWebGL, "hero canvas should expose a live WebGL context").toBe(true);
  expect(canvasProbe.width, "hero canvas should have non-zero width").toBeGreaterThan(0);
  expect(canvasProbe.height, "hero canvas should have non-zero height").toBeGreaterThan(0);

  await expect(page.locator("#vaultT")).toBeVisible();
  await expect(page.locator("#vaultV")).toBeVisible();
  await expect(page.locator("#ironI")).toBeVisible();
  await expect(page.locator("#meetM")).toBeVisible();

  const transformBefore = await heroHeadline.evaluate((node) => getComputedStyle(node).transform);

  for (let i = 0; i < 14; i += 1) {
    await page.mouse.wheel(0, 115);
    await page.waitForTimeout(80);
  }

  const transformAfter = await heroHeadline.evaluate((node) => getComputedStyle(node).transform);

  // Reduced-motion is intentionally honored (no scrubbed timeline). Normal mode must scrub.
  if (!canvasProbe.reducedMotion) {
    expect(
      transformAfter,
      "ScrollTrigger should scrub the headline transform while scrolling (normal motion mode)",
    ).not.toBe(transformBefore);
  }

  expect(pageErrors, `uncaught page errors during hero scroll: ${pageErrors.join(" | ")}`).toEqual([]);
  expect(
    heroAssetFailures,
    `hero asset (GLB/3D/chunk) failures during hero scroll: ${heroAssetFailures.join(" | ")}`,
  ).toEqual([]);
  expect(consoleErrors, `uncaught hero-scoped console errors during scroll: ${consoleErrors.join(" | ")}`).toEqual([]);
});
