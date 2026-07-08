export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validSlug(value: string): boolean {
  return SLUG_REGEX.test(value);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sanitiseSlugInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "");
}
