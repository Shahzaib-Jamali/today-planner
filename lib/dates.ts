/**
 * Returns YYYY-MM-DD string in LOCAL timezone (not UTC).
 * Using toISOString() returns UTC which is wrong at night in US timezones.
 */
export function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}
