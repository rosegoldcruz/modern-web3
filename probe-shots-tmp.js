/* Capture + analyze coin position across scroll on given URL */
const { chromium } = require("playwright");
const TARGET = process.env.PROBE_URL || "https://www.ironvaulttoken.com/";
const POSITIONS = [0, 350, 700, 1050, 1450, 1800, 2200, 2600, 3000, 3400, 3700];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(TARGET, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(3000);
  const results = [];
  for (const pos of POSITIONS) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(600);
    const buf = await page.screenshot();
    results.push({ pos, buf });
  }
  await browser.close();
  require("fs").mkdirSync("/tmp/hero-probe/local-shots", { recursive: true });
  const fs = require("fs");
  for (let i = 0; i < results.length; i++) {
    fs.writeFileSync(`/tmp/hero-probe/local-shots/pos_${String(POSITIONS[i]).padStart(4, "0")}.png`, results[i].buf);
  }
  console.log("saved", results.length, "shots to /tmp/hero-probe/local-shots");
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
