import { test, expect, type Page } from '@playwright/test';

async function openFirstProduct(page: Page) {
  await page.goto('/products');
  await expect(page.getByText('22 products')).toBeVisible();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);
  await expect(page.getByRole('heading', { name: 'Standard Shipping Carton' })).toBeVisible();
}

test('all primary routes show the concept disclosure and working site navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Packaging website concept by PixelAura Technologies.')).toBeVisible();
  await page.getByRole('link', { name: 'Products', exact: true }).first().click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByText('Packaging website concept by PixelAura Technologies.')).toBeVisible();
  await expect(page.getByText('© 2026 PACKFORM')).toBeVisible();
  await expect(page.getByText('Privacy Policy')).toHaveCount(0);
  await expect(page.getByText('Terms of Service')).toHaveCount(0);
});

for (const size of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`product details, manual quantities and guided quote work at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await openFirstProduct(page);
    const quantity = page.getByRole('textbox', { name: 'Quantity for Standard Shipping Carton' });
    await quantity.fill('17');
    await expect(quantity).toHaveValue('17');
    await page.getByRole('button', { name: /Increase quantity for standard shipping carton/i }).click();
    await expect(quantity).toHaveValue('18');
    await page.getByRole('button', { name: /Decrease quantity for standard shipping carton/i }).click();
    await expect(quantity).toHaveValue('17');

    await page.getByRole('button', { name: 'Add to Enquiry' }).click();
    await expect(page).toHaveURL(/\/quote$/);
    await expect(page.getByRole('heading', { name: '2. Specify Requirements' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '1. Select Products' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add more products' })).toBeVisible();

    const quoteQty = page.getByRole('textbox', { name: 'Quantity for Standard Shipping Carton', exact: true });
    await expect(quoteQty).toHaveValue('17');
    await quoteQty.fill('125');
    await expect(quoteQty).toHaveValue('125');
    await page.getByRole('button', { name: /increase quantity for standard shipping carton/i }).first().click();
    await expect(quoteQty).toHaveValue('126');
    await expect(page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth + 2)).resolves.toBeTruthy();
  });
}

test('add more products opens the catalogue only when requested', async ({ page }) => {
  await page.goto('/quote');
  await expect(page.getByRole('heading', { name: '1. Select Products' })).toBeVisible();
  await page.getByRole('button', { name: 'Select Standard Shipping Carton' }).click();
  await page.getByRole('button', { name: /Next: Specify Requirements/i }).click();
  await expect(page.getByRole('heading', { name: '2. Specify Requirements' })).toBeVisible();
  await page.getByRole('button', { name: 'Add more products' }).click();
  await expect(page.getByRole('heading', { name: '1. Select Products' })).toBeVisible();
});

test('preview can edit quantities, copy or download but never pretends to submit', async ({ page }) => {
  await page.goto('/quote');
  await page.getByRole('button', { name: 'Select Standard Shipping Carton' }).click();
  await page.getByRole('button', { name: /Next: Specify Requirements/i }).click();
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await page.getByRole('textbox', { name: /Contact Name/i }).fill('Demo Customer');
  await page.getByRole('textbox', { name: /Company Name/i }).fill('Example Packaging');
  await page.getByRole('textbox', { name: /Email Address/i }).fill('sample@example.com');
  await page.getByRole('button', { name: 'Preview Enquiry', exact: true }).click();

  await expect(page).toHaveURL(/\/quote\/preview$/);
  await expect(page.getByText(/this enquiry has not been sent/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit Enquiry' })).toHaveCount(0);
  await expect(page.getByText('Get a Tailored Quote')).toHaveCount(0);
  const qty = page.getByRole('textbox', { name: /Quantity for Standard Shipping Carton in preview/i });
  await qty.fill('17');
  await page.getByRole('button', { name: /increase quantity for standard shipping carton in preview/i }).click();
  await expect(qty).toHaveValue('18');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download .txt' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('packform-enquiry.txt');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy Summary' }).click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('18 pcs');
  expect(clipboard).toContain('This request has NOT been submitted');
});

test('mobile layouts keep key controls on screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  for (const route of ['/', '/products', '/products/standard-shipping-carton', '/quote']) {
    await page.goto(route);
    await expect(page.getByText('Packaging website concept by PixelAura Technologies.')).toBeVisible();
    const fits = await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth + 2);
    expect(fits, `Horizontal overflow at ${route}`).toBeTruthy();
  }
});
