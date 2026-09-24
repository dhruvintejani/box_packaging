/** Avoid accidental string concatenation and invalid quantities from older saved demos. */
export const MAX_QUANTITY = 9_999_999;
export function safeQuantity(value: number | string | null | undefined): number {
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isSafeInteger(number) || number < 1) return 1;
  return Math.min(number, MAX_QUANTITY);
}
