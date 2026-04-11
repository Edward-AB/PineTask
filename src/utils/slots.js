import { SLOTS_PER_HOUR } from '../constants';

/** Convert slot index to time string "HH:MM" */
export function slotToTime(slot) {
  const h = Math.floor(slot / SLOTS_PER_HOUR);
  const m = (slot % SLOTS_PER_HOUR) * 15;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Convert time string "HH:MM" to slot index */
export function timeToSlot(time) {
  const [h, m] = time.split(':').map(Number);
  return h * SLOTS_PER_HOUR + Math.floor(m / 15);
}

/** Get current time as a Y-position in the calendar (px) */
export function nowY() {
  const n = new Date();
  return ((n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60) / 60) *
    (SLOTS_PER_HOUR * 16);
}

/** Format current time as HH:MM */
export function formatClock() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
