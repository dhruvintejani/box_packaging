# Packform — Packaging Website Concept

An interactive **frontend-only** packaging website concept created by **PixelAura Technologies** as a business demonstration. This is not a live manufacturer's website. The product images and specifications are illustrative. No enquiry is transmitted to a sales team.

## What's included

- Responsive homepage and searchable/filterable product catalogue.
- Working details pages for all catalogue products.
- Guided sample enquiry: select products, enter product requirements and sample contact details, preview the result.
- Editable integer quantity controls with manual entry and +/− buttons, including on mobile.
- A live enquiry preview with Copy and Download (.txt) options.
- A banner explaining that this is a PixelAura interactive concept.
- Sticky desktop filters/search and mobile search/filter controls.
- Browser-local storage for product selections and technical preferences only, plus a Clear Enquiry action.

There is intentionally no backend, payment flow, real enquiry submission, file upload or quotation-response promise.

**Privacy:** Contact details and free-text notes are kept **only in memory** while the demo tab is active; they are cleared when the page reloads or the enquiry is cleared. Selected products and non-sensitive technical preferences persist in local storage. Previously saved contact details are automatically removed. Use sample details, not real customer data.

## Run on your laptop

```bash
npm ci
npm run dev
```

Visit the Vite URL shown in your terminal.

## Verify

```bash
npx tsc --noEmit
npm run build
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
```

## Deploy

Use the Vite framework with `npm run build` and output directory `dist`. The normal build serves the JPG images as independently cached assets for quicker initial page loads. The included `vercel.json` enables direct links to product-detail and preview routes.

For a portable standalone HTML demonstration, run `npm run build:standalone` instead. That optional build embeds the images into the HTML; the normal Vercel build is preferred for a hosted demo.

## Adapting for a real business

Real customer enquiries require separately scoped server-side validation, reliable notifications, data-protection controls, storage, integration testing and business-approved content. These are deliberately **not** included in this demo.
