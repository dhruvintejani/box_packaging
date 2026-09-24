import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel's normal build loads photos as independently cached assets rather
// than downloading every JPG with the first HTML request. An optional separate
// standalone build still embeds all photos for sharing a single HTML file.
function embeddedPackagingImages(): Plugin {
  const virtualId = "virtual:packform-images";
  const resolvedId = "\0" + virtualId;
  const inlineAssets = process.env.PACKFORM_STANDALONE === '1';
  const imageFiles = [
    "hero-boxes.jpg",
    "corrugated-stack.jpg",
    "product-shipping-carton.jpg",
    "product-printed-carton.jpg",
    "product-mailer-box.jpg",
    "product-heavy-duty.jpg",
    "product-partition-box.jpg",
    "product-custom-box.jpg",
  ];
  return {
    name: "inline-packform-product-images",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
      return undefined;
    },
    load(id) {
      if (id !== resolvedId) return undefined;
      if (!inlineAssets) return 'export const embeddedImages = {};';
      const embedded = Object.fromEntries(
        imageFiles.map((name) => {
          const bytes = readFileSync(path.resolve(__dirname, "public", "images", name));
          return ["/images/" + name, "data:image/jpeg;base64," + bytes.toString("base64")];
        }),
      );
      return "export const embeddedImages = " + JSON.stringify(embedded) + ";";
    },
  };
}

export default defineConfig({
  plugins: [embeddedPackagingImages(), react(), tailwindcss(), ...(process.env.PACKFORM_STANDALONE === '1' ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
