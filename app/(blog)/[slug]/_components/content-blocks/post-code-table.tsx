import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type PostCodeTableProps = ComponentPropsWithoutRef<"table">;
type PostCodeTableHeadProps = ComponentPropsWithoutRef<"thead">;
type PostCodeTableBodyProps = ComponentPropsWithoutRef<"tbody">;
type PostCodeTableRowProps = ComponentPropsWithoutRef<"tr">;
type PostCodeTableHeaderProps = ComponentPropsWithoutRef<"th">;
type PostCodeTableCellProps = ComponentPropsWithoutRef<"td">;

/**
 * PostCodeTable - Wrapper for responsive, modern tables.
 *
 * Provides:
 * - Horizontal scrolling on small screens
 * - Rounded corners and subtle borders
 * - Dark mode support
 * - Accessible and semantic HTML
 *
 * Usage:
 * ```tsx
 * <PostCodeTable>
 *   <PostCodeTableHead>
 *     <PostCodeTableRow>
 *       <PostCodeTableHeader>Column 1</PostCodeTableHeader>
 *     </PostCodeTableRow>
 *   </PostCodeTableHead>
 *   <PostCodeTableBody>
 *     <PostCodeTableRow>
 *       <PostCodeTableCell>Data</PostCodeTableCell>
 *     </PostCodeTableRow>
 *   </PostCodeTableBody>
 * </PostCodeTable>
 * ```
 */
export function PostCodeTable({
  className,
  children,
  ...props
}: PostCodeTableProps) {
  return (
    <div
      className="
        w-full
        overflow-x-auto
        rounded-xl
        border
        border-y-border/60
        bg-background
      "
    >
      <table className={cn("w-full min-w-max text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

/**
 * PostCodeTableHead - Table header wrapper.
 *
 * Applies subtle background color to distinguish header row.
 * Automatically styled with font-semibold and appropriate contrast.
 */
export function PostCodeTableHead({
  className,
  children,
  ...props
}: PostCodeTableHeadProps) {
  return (
    <thead className={cn("bg-muted/50", className)} {...props}>
      {children}
    </thead>
  );
}

/**
 * PostCodeTableBody - Table body wrapper.
 *
 * Removes bottom border from last row for clean appearance.
 */
export function PostCodeTableBody({
  className,
  children,
  ...props
}: PostCodeTableBodyProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0 ", className)} {...props}>
      {children}
    </tbody>
  );
}

/**
 * PostCodeTableRow - Table row with hover effect.
 *
 * Features:
 * - Subtle border separator between rows
 * - Smooth hover background color transition
 * - Accessible color contrast
 *
 * Works in both header and body contexts.
 */
export function PostCodeTableRow({
  className,
  children,
  ...props
}: PostCodeTableRowProps) {
  return (
    <tr
      className={cn("transition-colors", "hover:bg-muted/30", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

/**
 * PostCodeTableHeader - Table header cell (<th>).
 *
 * Features:
 * - Bold font weight for visual hierarchy
 * - Appropriate padding and alignment
 * - Prevents text wrapping for compact headers
 * - Accessible color contrast in light and dark modes
 *
 * Text is left-aligned by default (common for data tables).
 */
export function PostCodeTableHeader({
  className,
  children,
  ...props
}: PostCodeTableHeaderProps) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3",
        "text-left align-middle",
        "font-semibold text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

/**
 * PostCodeTableCell - Table data cell (<td>).
 *
 * Features:
 * - Consistent padding with header cells
 * - Muted text color for visual hierarchy
 * - Middle vertical alignment
 * - Works with both text and complex content
 *
 * Color automatically adapts in dark mode via CSS variables.
 */
export function PostCodeTableCell({
  className,
  children,
  ...props
}: PostCodeTableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3",
        "align-middle",
        "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
