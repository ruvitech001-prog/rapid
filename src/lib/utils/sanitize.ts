/**
 * Security utilities for input sanitization
 */

/**
 * Sanitize search input to prevent SQL injection in ILIKE queries
 * Escapes special PostgreSQL pattern matching characters: %, _
 *
 * @param input - User search input
 * @returns Sanitized string safe for ILIKE queries
 */
export function sanitizeSearchInput(input: string | undefined | null): string {
  if (!input) return '';

  // Escape special pattern matching characters
  return input
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')     // Escape % wildcard
    .replace(/_/g, '\\_')     // Escape _ wildcard
    .replace(/'/g, "''")      // Escape single quotes (SQL string escape)
    .trim()
    .slice(0, 100);           // Limit length to prevent DoS
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumericInput(input: unknown): number | null {
  const num = Number(input);
  return !isNaN(num) && isFinite(num) ? num : null;
}

/**
 * Sanitize UUID input
 */
export function sanitizeUUID(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input) ? input : null;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = input.trim().toLowerCase().slice(0, 255);
  return emailRegex.test(trimmed) ? trimmed : null;
}
