import { embeddedImages } from "virtual:packform-images";

/** Works in Vite dev, normal hosting and single-file standalone previews. */
export function imageUrl(original: string): string {
  return embeddedImages[original] ?? original;
}
