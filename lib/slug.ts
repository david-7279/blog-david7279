/**
 * Validates a public post slug before it reaches the data layer.
 *
 * Slugs are used to resolve application resources, so rejecting
 * path-like values at the API boundary provides an additional layer
 * of input validation.
 */
export function isValidSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    !slug.includes("..") &&
    !slug.includes("/") &&
    !slug.includes("\\")
  );
}
