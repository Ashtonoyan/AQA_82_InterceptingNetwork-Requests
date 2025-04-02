import { test, expect } from '@playwright/test';

test('should replace first product description with custom message', async ({ page }) => {
  await page.route("https://api.demoblaze.com/entries", async (route) => {
    const responce = await route.fetch()
    const json = await responce.json();

    if (json.Items && json.Items.length > 0) {
      json.Items[0].desc = "This phone is IPHONE 16!";
    }

    await route.fulfill({ json });


  })
  await page.goto('https://www.demoblaze.com/');


  await expect(page.locator('.card-block').first().locator('#article.card-text'))
      .toHaveText("This phone is IPHONE 16!");
});

test('should receive 500 Internal Server Error', async ({ page }) => {
  await page.route("https://api.demoblaze.com/entries", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: "Internal Server Error" })
    })
  })
  await page.goto('https://www.demoblaze.com/');

  await expect(page.locator('.card-block').first().locator('#article.card-text'))
      .toBeHidden();
});
