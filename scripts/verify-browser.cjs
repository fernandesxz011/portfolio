const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { chromium } = require("playwright");
const { source: axeSource } = require("axe-core");
const baseUrl =
  process.env.TEST_URL || "http://127.0.0.1:4173/portfolio-preview/";

async function run() {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL
      ? { channel: process.env.BROWSER_CHANNEL }
      : {}),
  });
  const results = [];
  await fs.mkdir("test-results", { recursive: true });
  try {
    for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.route("https://api.github.com/**", (route) =>
        route.fulfill({ json: [] }),
      );
      await page.goto(baseUrl);
      await page.locator("#hero-title").waitFor();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Overflow em ${width}px`,
      );
      for (const image of await page.locator("main img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => element.decode());
      }
      for (const summary of await page.locator("details summary").all()) {
        await summary.click();
        assert.equal(
          await summary.evaluate((element) => element.parentElement.open),
          true,
        );
        await summary.click();
      }
      if (width <= 760) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator(".menu-toggle").click();
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "true",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "false",
        );
        assert.equal(
          await page
            .locator(".menu-toggle")
            .evaluate((element) => element === document.activeElement),
          true,
        );
        await page.locator(".menu-toggle").click();
        await page.locator('.main-nav a[href="#projetos"]').click();
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "false",
        );
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "projetos",
        );
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      if ([390, 768, 1440].includes(width)) {
        await page.evaluate(axeSource);
        const audit = await page.evaluate(() =>
          axe.run(document, {
            runOnly: {
              type: "tag",
              values: [
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "best-practice",
              ],
            },
          }),
        );
        const violations = audit.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          nodes: item.nodes.map((node) => node.target),
        }));
        await fs.writeFile(
          `test-results/accessibility-${width}.json`,
          JSON.stringify({ violations }, null, 2),
        );
        assert.deepEqual(violations, [], `Acessibilidade em ${width}px`);
        await page.screenshot({
          path: `test-results/desktop-${width}.png`,
          fullPage: true,
        });
        if (width === 1440)
          await page.screenshot({ path: "test-results/hero-desktop.png" });
        if (width === 390)
          await page.screenshot({ path: "test-results/hero-mobile.png" });
      }
      assert.deepEqual(errors, [], `Console em ${width}px`);
      results.push({
        width,
        overflow: false,
        images: "ok",
        interactions: "ok",
        consoleErrors: 0,
      });
      await page.close();
    }

    const keyboardPage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await keyboardPage.route("https://api.github.com/**", (route) =>
      route.fulfill({ json: [] }),
    );
    await keyboardPage.goto(baseUrl);
    await keyboardPage.keyboard.press("Tab");
    assert.equal(
      await keyboardPage.evaluate(() => document.activeElement.className),
      "skip-link",
    );
    assert.notEqual(
      await keyboardPage
        .locator(".skip-link")
        .evaluate((element) => getComputedStyle(element).outlineStyle),
      "none",
    );
    await keyboardPage.keyboard.press("Enter");
    for (const target of [
      "#sobre",
      "#projetos",
      "#conhecimentos",
      "#trajetoria",
      "#github",
      "#contato",
    ]) {
      await keyboardPage.locator(target).scrollIntoViewIfNeeded();
    }
    await keyboardPage.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await keyboardPage.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    assert.equal(
      await keyboardPage
        .locator(".reveal-pending:not(.reveal-visible)")
        .count(),
      0,
    );
    await keyboardPage.close();

    const noJs = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    await noJs.goto(baseUrl);
    assert.equal(await noJs.locator(".main-nav").isVisible(), true);
    assert.equal(await noJs.locator("#trs-title").isVisible(), true);
    await noJs.locator("details summary").first().click();
    assert.equal(
      await noJs.locator("details").first().getAttribute("open"),
      "",
    );
    await noJs.close();

    const apiPage = await browser.newPage({ reducedMotion: "reduce" });
    await apiPage.route("https://api.github.com/**", (route) =>
      route.fulfill({
        json: [
          {
            name: "trs-serralheria",
            owner: { login: "fernandesxz011" },
            description: '<img src=x onerror="window.injected=true">',
            language: "HTML",
            html_url: "javascript:alert(1)",
          },
        ],
      }),
    );
    await apiPage.goto(baseUrl);
    await apiPage.locator("#github").scrollIntoViewIfNeeded();
    await apiPage.waitForFunction(() =>
      document
        .querySelector("#repo-status")
        .textContent.includes("ATUALIZADAS"),
    );
    assert.equal(
      await apiPage.locator(".repo-row small").first().textContent(),
      '<img src=x onerror="window.injected=true">',
    );
    assert.equal(
      await apiPage.locator(".repo-row").first().getAttribute("href"),
      "https://github.com/fernandesxz011/trs-serralheria",
    );
    assert.equal(await apiPage.evaluate(() => Boolean(window.injected)), false);
    await apiPage.unroute("https://api.github.com/**");
    await apiPage.route("https://api.github.com/**", (route) =>
      route.fulfill({ status: 403, json: { message: "Rate limit exceeded" } }),
    );
    await apiPage.goto(baseUrl);
    await apiPage.locator("#github").scrollIntoViewIfNeeded();
    await apiPage.waitForFunction(() =>
      document.querySelector("#repo-status").textContent.includes("CONSULTE"),
    );
    assert.equal(await apiPage.locator(".repo-row").count(), 3);
    await apiPage.goto(new URL("404.html", baseUrl).href);
    assert.equal(
      await apiPage.locator("h1").textContent(),
      "Esse caminhoainda não existe.",
    );
    await apiPage.close();

    await fs.writeFile(
      "test-results/summary.json",
      JSON.stringify(
        {
          viewports: results,
          keyboard: "ok",
          reducedMotion: "ok",
          noJavaScript: "ok",
          apiXssProtection: "ok",
          apiFallback: "ok",
          subdirectory: "ok",
        },
        null,
        2,
      ),
    );
    console.log(
      "OK: 7 larguras, imagens, menu, cases, teclado, movimento reduzido, ausência de JS, API/XSS, fallback e subdiretório.",
    );
    console.log("OK: axe-core sem violações nas larguras 390, 768 e 1440px.");
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
