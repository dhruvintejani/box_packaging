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

// The standalone Arena demo can be distributed as one HTML file. Normal
// /public image URLs require separate asset deployment, which led to missing
// images on some mobile views. Include the eight existing JPG files directly
// in the Vite app, while retaining their public copies for normal hosting.
function embeddedPackagingImages(): Plugin {
  const virtualId = "virtual:packform-images";
  const resolvedId = "\0" + virtualId;
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
  plugins: [embeddedPackagingImages(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
