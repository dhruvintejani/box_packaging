import { test, expect, type Page } from '@playwright/test';

async function openFirstProduct(page: Page) {
  await page.goto('/products');
  await expect(page.getByText('15 products')).toBeVisible();
  await page.locator('[data-product-slug="standard-shipping-carton"]').getByRole('button', { name: 'View Standard Shipping Carton' }).click();
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

    await page.getByRole('button', { name: /Continue to Enquiry|Add to Enquiry/ }).click();
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
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
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

test('all catalogue photos are local packaging images and filtering uses premium dropdowns', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/products');
  await expect(page.getByText('15 products')).toBeVisible();

  const cards = page.locator('img[loading="lazy"]');
  await expect(cards).toHaveCount(15);
  const localImages = await cards.evaluateAll((images) =>
    images.every((image) => {
      const src = (image as HTMLImageElement).getAttribute('src') ?? '';
      return src.startsWith('/images/') || src.startsWith('data:image/jpeg;base64,');
    })
  );
  expect(localImages).toBeTruthy();

  await page.getByRole('button', { name: 'Sort products' }).click();
  await expect(page.getByRole('listbox', { name: 'Sort products' })).toBeVisible();
  await page.getByRole('option', { name: 'Name Z–A' }).click();
  await expect(page.getByRole('button', { name: 'Sort products' })).toContainText('Name Z–A');

  await page.getByRole('button', { name: 'Product category' }).click();
  await expect(page.getByRole('listbox', { name: 'Product category' })).toBeVisible();
  await page.getByRole('option', { name: 'Mailers' }).click();
  await expect(page.getByText('3 products')).toBeVisible();
  await page.getByRole('button', { name: 'Product category' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox', { name: 'Product category' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox', { name: 'Product category' })).toHaveCount(0);
});

test('quantity controls do not add a product before Continue to Enquiry', async ({ page }) => {
  await page.goto('/products/standard-shipping-carton');
  await expect(page.getByText('Added to your enquiry')).toHaveCount(0);
  const quantity = page.getByRole('textbox', { name: 'Quantity for Standard Shipping Carton' });
  await quantity.fill('17');
  await page.getByRole('button', { name: /Increase quantity for standard shipping carton/i }).click();
  await expect(quantity).toHaveValue('18');

  // Navigating without explicitly continuing leaves the basket empty.
  await page.goto('/quote');
  await expect(page.getByRole('heading', { name: '1. Select Products' })).toBeVisible();

  await page.goto('/products/standard-shipping-carton');
  await page.getByRole('textbox', { name: 'Quantity for Standard Shipping Carton' }).fill('27');
  await page.getByRole('button', { name: 'Continue to Enquiry' }).click();
  await expect(page).toHaveURL(/\/quote$/);
  await expect(page.getByRole('heading', { name: '2. Specify Requirements' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Quantity for Standard Shipping Carton', exact: true })).toHaveValue('27');
});

test('premium category picker escapes the mobile filters panel without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/products');
  await page.getByRole('button', { name: /Filters/ }).click();
  await page.getByRole('button', { name: 'Product category' }).click();
  const menu = page.getByRole('listbox', { name: 'Product category' });
  await expect(menu).toBeVisible();
  await expect(page.getByRole('option', { name: 'Heavy Duty' })).toBeVisible();
  await page.getByRole('option', { name: 'Heavy Duty' }).click();
  await page.getByRole('button', { name: /Show 2 products/ }).click();
  await expect(page.getByText('2 products', { exact: true })).toBeVisible();
  const fits = await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth + 2);
  expect(fits).toBeTruthy();
});

test('all 15 product-detail photographs render on mobile rather than a blank image panel', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/products');
  const slugs = await page.locator('[data-product-slug]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-product-slug')).filter((slug): slug is string => !!slug)
  );
  expect(slugs).toHaveLength(15);

  for (const slug of slugs) {
    await page.goto('/products/' + slug);
    const gallery = page.getByTestId('product-image-gallery');
    await expect(gallery).toBeVisible();
    const img = page.getByTestId('product-photo');
    await expect(img).toBeVisible();
    await expect.poll(async () => img.evaluate((node) => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    }), { message: 'Image must render on mobile for ' + slug }).toBeTruthy();

    const visual = await img.evaluate((node) => {
      const image = node as HTMLImageElement;
      const imgRect = image.getBoundingClientRect();
      const panelRect = image.closest('figure')!.getBoundingClientRect();
      return {
        objectFit: window.getComputedStyle(image).objectFit,
        imgWidth: imgRect.width,
        panelWidth: panelRect.width,
      };
    });
    expect(visual.objectFit).toBe('contain');
    expect(visual.imgWidth).toBeGreaterThan(150);
    expect(visual.panelWidth).toBeGreaterThan(250);
    expect(await page.locator('body').evaluate((body) =>
      body.scrollWidth <= window.innerWidth + 2
    )).toBeTruthy();
  }
});

test('empty previews do not allow exporting blank enquiries', async ({ page }) => {
  await page.goto('/quote/preview');
  await expect(page.getByRole('heading', { name: 'Your sample enquiry is empty' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy|Download|Submit/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Select Packaging Products' }).click();
  await expect(page).toHaveURL(/\/quote$/);
  await expect(page.getByRole('heading', { name: '1. Select Products' })).toBeVisible();
});

test('legacy contact details are scrubbed and new contact details never enter local storage', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.setItem('packform-enquiry', JSON.stringify({
    selectedProductIds: ['standard-shipping-carton'],
    specifications: { 'standard-shipping-carton': {
      productId: 'standard-shipping-carton', quantity: 200,
      length: '120', width: '110', height: '100',
      plyPreference: 'not-sure', printing: 'not-sure',
      whatWillBePacked: 'sensitive sample note',
      additionalRequirements: 'sensitive free text'
    }},
    customerDetails: { contactName: 'Private Name', companyName: 'Private Co', email: 'private@example.com' },
  })));
  await page.reload();
  const savedAfterMigration = await page.evaluate(() => window.localStorage.getItem('packform-enquiry') ?? '');
  expect(savedAfterMigration).not.toContain('Private Name');
  expect(savedAfterMigration).not.toContain('private@example.com');
  expect(savedAfterMigration).not.toContain('sensitive free text');
  expect(savedAfterMigration).toContain('standard-shipping-carton');

  await page.goto('/quote');
  await expect(page.getByRole('heading', { name: '2. Specify Requirements' })).toBeVisible();
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await page.getByRole('textbox', { name: /Contact Name/i }).fill('Sample Visitor');
  await page.getByRole('textbox', { name: /Company Name/i }).fill('Example Ltd');
  await page.getByRole('textbox', { name: /Email Address/i }).fill('visitor@example.com');
  await page.getByRole('button', { name: 'Preview Enquiry', exact: true }).click();
  await expect(page).toHaveURL(/\/quote\/preview$/);
  const savedAfterInput = await page.evaluate(() => window.localStorage.getItem('packform-enquiry') ?? '');
  expect(savedAfterInput).not.toContain('Sample Visitor');
  expect(savedAfterInput).not.toContain('visitor@example.com');
  await page.reload();
  await expect(page.getByText('No details entered yet.')).toBeVisible();
});

test('dimensions must be complete and positive if supplied', async ({ page }) => {
  await page.goto('/quote');
  await page.getByRole('button', { name: 'Select Standard Shipping Carton' }).click();
  await page.getByRole('button', { name: /Next: Specify Requirements/i }).click();
  const length = page.getByRole('textbox', { name: 'Standard Shipping Carton length in millimeters' });
  const width = page.getByRole('textbox', { name: 'Standard Shipping Carton width in millimeters' });
  const height = page.getByRole('textbox', { name: 'Standard Shipping Carton height in millimeters' });
  await length.fill('120');
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Enter all three dimensions' })).toBeVisible();
  await width.fill('80');
  await height.fill('-5');
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'valid dimensions' })).toBeVisible();
  await height.fill('50.5');
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await expect(page.getByRole('heading', { name: '3. Your Details' })).toBeVisible();
});

test('desktop filters and search remain visible while scrolling through products', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/products');
  const tools = page.getByTestId('desktop-catalogue-tools');
  await expect(tools.getByRole('searchbox', { name: 'Search products' })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 970));
  await expect.poll(() => tools.evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(89);
  await expect.poll(() => tools.evaluate((node) => node.getBoundingClientRect().top)).toBeLessThan(105);
  await tools.getByRole('button', { name: 'Product category' }).click();
  await expect(page.getByRole('listbox', { name: 'Product category' })).toBeVisible();
});

test('mobile search and filters stay accessible while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/products');
  await page.evaluate(() => window.scrollTo(0, 1050));
  const tools = page.getByTestId('mobile-catalogue-tools');
  await expect.poll(() => tools.evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(60);
  await expect.poll(() => tools.evaluate((node) => node.getBoundingClientRect().top)).toBeLessThan(78);
  await tools.getByRole('button', { name: 'Filters' }).click();
  await tools.getByRole('button', { name: 'Product category' }).click();
  await page.getByRole('option', { name: 'Mailers' }).click();
  await tools.getByRole('button', { name: 'Show 3 products' }).click();
  await expect(page.getByText('3 products', { exact: true })).toBeVisible();
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth + 2)).toBeTruthy();
});

test('breadcrumbs go home and 320px preview has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/products');
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/quote');
  await page.getByRole('button', { name: 'Select Standard Shipping Carton' }).click();
  await page.getByRole('button', { name: /Next: Specify Requirements/i }).click();
  await page.getByRole('button', { name: /Next: Your Details/i }).click();
  await page.getByRole('textbox', { name: /Contact Name/i }).fill('Example Customer');
  await page.getByRole('textbox', { name: /Company Name/i }).fill('Example Co');
  await page.getByRole('textbox', { name: /Email Address/i }).fill('example@example.com');
  await page.getByRole('button', { name: 'Preview Enquiry', exact: true }).click();
  await expect(page).toHaveURL(/\/quote\/preview$/);
  await expect(page.getByRole('button', { name: 'Copy Summary' })).toBeVisible();
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth + 2)).toBeTruthy();
});
