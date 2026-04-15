// Shared schedule helpers.
//
// PineTask stores time-of-day as "slots" — 15-minute blocks from midnight.
//   slot 0  = 00:00
//   slot 32 = 08:00
//   slot 68 = 17:00
//   slot 96 = 24:00
// A task's schedule is { slot (start), duration (slots) }.

export const SLOTS_PER_HOUR = 4;
export const SLOTS_PER_DAY = 96;

export function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Slot index → "HH:MM". */
export function slotToTime(slot) {
  if (slot == null || slot < 0 || slot > SLOTS_PER_DAY) return null;
  const h = Math.floor(slot / SLOTS_PER_HOUR);
  const m = (slot % SLOTS_PER_HOUR) * 15;
  return `${pad2(h)}:${pad2(m)}`;
}

/** "HH:MM" (or "HH:MM:SS") → slot index, rounded DOWN to nearest 15 min. */
export function timeToSlot(time) {
  if (typeof time !== 'string') return null;
  const m = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h < 0 || h > 24 || mm < 0 || mm > 59) return null;
  return h * SLOTS_PER_HOUR + Math.floor(mm / 15);
}

/** Minutes → number of 15-min slots, rounded UP (min 1). */
export function minutesToSlots(minutes) {
  const n = Math.max(1, Math.ceil(Number(minutes || 15) / 15));
  return n;
}

/** Number of slots → minutes. */
export function slotsToMinutes(slots) {
  return (Number(slots) || 0) * 15;
}

/**
 * Compute today's YYYY-MM-DD key in a given IANA timezone.
 * Falls back to UTC if the timezone string is invalid.
 */
export function todayInTimezone(tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz || 'UTC',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch {}
  // Fallback: UTC
  const now = new Date();
  return `${now.getUTCFullYear()}-${pad2(now.getUTCMonth() + 1)}-${pad2(now.getUTCDate())}`;
}

/**
 * Given working hours [startSlot, endSlot] and a list of scheduled
 * intervals [{ startSlot, endSlot }], return the free blocks inside
 * working hours as an array of { startSlot, endSlot }.
 */
export function computeFreeBlocks(workStart, workEnd, intervals) {
  if (workStart >= workEnd) return [];
  // Clip and sort intervals by start.
  const clipped = intervals
    .map((i) => ({
      start: Math.max(workStart, i.startSlot),
      end: Math.min(workEnd, i.endSlot),
    }))
    .filter((i) => i.end > i.start)
    .sort((a, b) => a.start - b.start);

  const free = [];
  let cursor = workStart;
  for (const i of clipped) {
    if (i.start > cursor) {
      free.push({ startSlot: cursor, endSlot: i.start });
    }
    cursor = Math.max(cursor, i.end);
  }
  if (cursor < workEnd) {
    free.push({ startSlot: cursor, endSlot: workEnd });
  }
  return free;
}

export async function loadUserSettings(env, userId) {
  const row = await env.DB.prepare(
    'SELECT work_hours_start, work_hours_end FROM user_settings WHERE user_id = ?'
  ).bind(userId).first();
  return {
    work_hours_start: row?.work_hours_start ?? 32, // 08:00
    work_hours_end: row?.work_hours_end ?? 68,     // 17:00
  };
}
