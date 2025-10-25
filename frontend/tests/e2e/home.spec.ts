import { expect, test } from "@playwright/test";

test("home page displays documentation link", async ({ page }) => {
  await page.goto("/");
  const docLink = page.getByRole("link", { name: /documentation/i });
  await expect(docLink).toBeVisible();
});
