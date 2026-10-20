import { expect, test } from "@playwright/test";

test("home presents the official identity and working navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /DOUKAGA Destinée Hermella/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Découvrir mon parcours" })).toHaveAttribute("href", "/a-propos");
  await expect(page.locator("img.hero-photo")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeVisible();
});
