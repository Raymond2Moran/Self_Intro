import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const origin = "http://127.0.0.1:8080";
const routes = ["/", "/cv/", "/publications/", "/repositories/", "/teaching/", "/news/"];
const failures = [];
const screenshotDir = "/tmp/self-intro-checks";
mkdirSync(screenshotDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
try {
  for (const route of routes) {
    await page.setViewportSize({ width: 1280, height: 900 });
    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, route);
    // Audit final theme colors, not intermediate colors from CSS transitions.
    await page.addStyleTag({
      content: "*, *::before, *::after { transition: none !important; animation: none !important; }"
    });
    assert.ok(!(await page.title()).includes("<span"), "Page title must be plain text: " + route);
    // Check rendered local links/assets, including a restored CV PDF if one is added.
    const urls = await page.locator("a[href], img[src]").evaluateAll((elements) =>
      elements.map((el) => el.href || el.src)
    );
    for (const href of urls) {
      const url = new URL(href, origin);
      if (url.origin !== origin) continue;
      const filename = path.join("_site", decodeURIComponent(url.pathname));
      if (!existsSync(filename)) failures.push(route + ": missing local target " + url.pathname);
    }
    if (route === "/") {
      assert.equal(await page.locator(".career-actions a[href^='mailto:']").getAttribute("href"),
        "mailto:guomoran203@gmail.com", "Homepage email action");
      assert.equal(await page.locator(".career-project").count(), 3, "Homepage featured projects");
      assert.ok(!(await page.locator("body").innerText()).includes("mguo31@jh.edu"), "Remove old email");
      assert.ok(!(await page.locator("body").innerText()).includes("585"), "Remove former contact phone");
      const headings = await page.locator("article h2").allTextContents();
      assert.ok(headings.findIndex((text) => text.includes("Featured projects")) <
        headings.findIndex((text) => text.includes("Selected publications")), "Projects precede publications");
    }
    if (route === "/repositories/") {
      assert.equal(await page.locator(".career-project").count(), 3, "Projects page featured work");
      assert.ok((await page.locator(".career-project").first().innerText()).includes("My contribution"),
        "Project contributions must be visible");
      assert.equal(await page.locator("#navbarNav").getByRole("link", { name: "teaching", exact: true }).count(), 0,
        "Teaching belongs in the CV, not the main navigation");
    }
    if (route === "/cv/") {
      assert.ok((await page.locator("body").innerText()).includes("two sections of 30 students"), "Retain teaching detail in CV");
    }
    for (const theme of ["light", "dark"]) {
      // Use the site's switch so table and search-widget themes also update.
      await page.evaluate((value) => setThemeSetting(value), theme);
      await page.locator("html:not(.transition)").waitFor({ state: "attached" });
      if (route === "/repositories/") {
        for (const chart of await page.locator(".github-activity-chart img").all()) {
          const source = await chart.getAttribute("src");
          assert.equal(new URL(source).searchParams.get("theme"), theme === "dark" ? "tokyonight" : "light",
            "Stats chart must follow site theme");
          assert.ok(Number(await chart.getAttribute("width")) > 0 && Number(await chart.getAttribute("height")) > 0,
            "Reserve chart space before loading");
        }
      }
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      for (const violation of result.violations) {
        failures.push(route + " (" + theme + "): " + violation.id + " " +
          violation.nodes.map((node) => node.target.join(" ") + ": " + node.failureSummary).join(", "));
      }
    }
    await page.evaluate(() => setThemeSetting("light"));
    await page.locator("html:not(.transition)").waitFor({ state: "attached" });
    for (const width of [320, 390, 600, 704, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      if (route === "/" || route === "/repositories/") {
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        assert.ok(!overflow, route + ": content overflows at " + width + "px");
      }
      if (route === "/") {
        await page.evaluate(() => scrollTo(0, 0));
        const cvAction = await page.locator(".career-actions a").first().boundingBox();
        assert.ok(cvAction.y + cvAction.height < 844, "CV action must appear in the first viewport at " + width + "px");
      }
      const hiddenNavigation = await page.locator("#navbar a, #navbar button").evaluateAll((elements) => {
        const rightEdge = document.documentElement.clientWidth;
        return elements.filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > rightEdge + 1);
        }).map((el) => el.textContent.trim() || el.getAttribute("aria-label"));
      });
      if (hiddenNavigation.length) failures.push(route + " at " + width + "px: clipped navigation " + hiddenNavigation);
      if (width < 992) {
        const toggle = page.getByRole("button", { name: "Toggle navigation" });
        await toggle.click();
        await page.locator("#navbarNav.show:not(.collapsing)").waitFor();
        for (const name of ["about", "projects", "cv", "publications", "news"]) {
          assert.ok(await page.locator("#navbarNav").getByRole("link", { name, exact: false }).isVisible(),
            route + ": mobile menu missing " + name);
        }
        await toggle.click();
        await page.locator("#navbarNav:not(.collapsing)").waitFor({ state: "attached" });
      }
      if (route === "/") {
        await page.locator(".contact-note").scrollIntoViewIfNeeded();
        const covered = await page.evaluate(() => {
          const contact = document.querySelector(".contact-note").getBoundingClientRect();
          const footer = document.querySelector("footer").getBoundingClientRect();
          return footer.top < contact.bottom && footer.bottom > contact.top;
        });
        if (covered) failures.push("Homepage contact details overlap footer at " + width + "px");
      }
      if (failures.length) await page.screenshot({
        path: path.join(screenshotDir, (route.replaceAll("/", "-") || "home") + width + ".png"),
        fullPage: true
      });
    }
  }
} finally {
  await browser.close();
}
assert.equal(failures.length, 0, failures.join("\n"));
console.log("Main-page links, WCAG A/AA checks, navigation and footer layout passed.");
