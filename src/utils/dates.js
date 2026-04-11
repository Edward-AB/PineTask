/** Format a Date to YYYY-MM-DD */
export function dateKey(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/** Today's date key */
export function todayKey() {
  return dateKey(new Date());
}

/** Days until a date string (YYYY-MM-DD). Negative = overdue */
export function daysUntil(str) {
  if (!str) return null;
  return Math.ceil((new Date(str + 'T12:00:00') - new Date()) / 86400000);
}

/** Format date for display: "Monday, 7 April 2026" */
export function formatDate(d) {
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** Format date string for short display: "7 Apr 2026" */
export function formatShortDate(str) {
  if (!str) return '';
  return new Date(str + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Parse YYYY-MM-DD to Date (at noon to avoid timezone issues) */
export function parseDate(str) {
  return new Date(str + 'T12:00:00');
}

/** Get the Monday of the week containing the given date */
export function getMonday(d) {
  const result = new Date(d);
  const dow = result.getDay();
  result.setDate(result.getDate() - ((dow === 0 ? 7 : dow) - 1));
  return result;
}

/** Add days to a date */
export function addDays(d, n) {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}
