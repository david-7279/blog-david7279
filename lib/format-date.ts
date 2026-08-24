/**
 * Formats a date using the Intl.DateTimeFormat API.
 *
 * The function accepts both ISO date strings and Date instances and
 * defaults to the standard US English date format used throughout
 * the application.
 *
 * Example:
 *   formatDate("2026-08-24")
 *   // "August 24, 2026"
 *
 * Custom formatting options can be provided when a different
 * presentation is required.
 */
export function formatDate(
  date: string | Date,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return parsedDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}
