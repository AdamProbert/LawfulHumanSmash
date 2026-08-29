/** Building and downloading CSV exports from the admin panel. */

/**
 * One CSV field. Anything containing a comma, quote or newline gets quoted,
 * with inner quotes doubled — a dietary note like `no nuts, no dairy` must not
 * split into two columns.
 */
function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Rows (first row = header) to a CSV string, CRLF as the spec asks. */
export function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(escapeField).join(",")).join("\r\n");
}

/**
 * Hand the CSV to the browser as a download.
 *
 * The leading BOM is what makes Excel read the file as UTF-8; without it the
 * drink emoji and any accented name arrive as mojibake.
 */
export function downloadCsv(filename: string, rows: unknown[][]) {
  const blob = new Blob(["﻿", toCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** "guests-2026-08-29.csv" — dated so successive exports don't overwrite. */
export function datedFilename(stem: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `${stem}-${today}.csv`;
}
