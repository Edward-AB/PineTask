// POST /api/schedule/tasks
//
// Bulk-adds tasks to the user's schedule. Each task may carry:
//   title              required
//   priority           high | medium | low (optional)
//   duration_minutes   number (default 30)
//   suggested_time     "HH:MM" (optional; maps to a 15-min slot)
//   project            project NAME to attach to (optional; silently
//                      ignored if no match)
//   deadline           ISO date "YYYY-MM-DD" (optional; matched against
//                      deadlines.due_date; silently ignored if no match)
//
// All tasks land on today (user timezone) unless the suggested_time implies
// otherwise — we don't try to reschedule forward here; callers asking for
// later dates should use the existing internal task API.

import {
  timeToSlot,
  minutesToSlots,
  todayInTimezone,
  slotToTime,
  slotsToMinutes,
} from '../_helpers/schedule.js';

const VALID_PRIORITY = new Set(['high', 'medium', 'low']);

export async function onRequestPost({ request, env, data }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const list = Array.isArray(body?.tasks) ? body.tasks : null;
  if (!list || list.length === 0) {
    return Response.json({ error: '`tasks` must be a non-empty array' }, { status: 400 });
  }
  if (list.length > 50) {
    return Response.json({ error: 'At most 50 tasks per request' }, { status: 400 });
  }

  // Validate each task up front — fail fast on bad input.
  for (const [i, t] of list.entries()) {
    if (!t || typeof t.title !== 'string' || !t.title.trim()) {
      return Response.json({ error: `tasks[${i}]: title is required` }, { status: 400 });
    }
    if (t.priority && !VALID_PRIORITY.has(t.priority)) {
      return Response.json({
        error: `tasks[${i}]: priority must be high | medium | low`,
      }, { status: 400 });
    }
    if (t.duration_minutes != null && (
      typeof t.duration_minutes !== 'number' || t.duration_minutes <= 0 || t.duration_minutes > 24 * 60
    )) {
      return Response.json({
        error: `tasks[${i}]: duration_minutes must be 1..1440`,
      }, { status: 400 });
    }
    if (t.suggested_time != null && timeToSlot(t.suggested_time) == null) {
      return Response.json({
        error: `tasks[${i}]: suggested_time must be "HH:MM"`,
      }, { status: 400 });
    }
  }

  try {
    const userRow = await env.DB.prepare(
      'SELECT timezone FROM users WHERE id = ?'
    ).bind(data.userId).first();
    const tz = userRow?.timezone || 'UTC';
    const today = todayInTimezone(tz);

    // Collect lookups in single round-trips.
    const projectNames = [...new Set(list.map((t) => (t.project || '').trim()).filter(Boolean))];
    const projectByName = new Map();
    if (projectNames.length > 0) {
      const ph = projectNames.map(() => '?').join(',');
      const rows = await env.DB.prepare(
        `SELECT id, name FROM projects WHERE user_id = ? AND name IN (${ph})`
      ).bind(data.userId, ...projectNames).all();
      for (const r of rows.results || []) {
        if (!projectByName.has(r.name)) projectByName.set(r.name, r.id);
      }
    }

    const deadlineDates = [...new Set(list.map((t) => (t.deadline || '').slice(0, 10)).filter(Boolean))];
    const deadlineByDate = new Map();
    if (deadlineDates.length > 0) {
      const ph = deadlineDates.map(() => '?').join(',');
      const rows = await env.DB.prepare(
        `SELECT id, due_date FROM deadlines
           WHERE user_id = ? AND due_date IN (${ph}) AND archived = 0
           ORDER BY created_at ASC`
      ).bind(data.userId, ...deadlineDates).all();
      for (const r of rows.results || []) {
        if (!deadlineByDate.has(r.due_date)) deadlineByDate.set(r.due_date, r.id);
      }
    }

    const created = [];
    for (const t of list) {
      const id = crypto.randomUUID();
      const now = Date.now();
      const slot = t.suggested_time ? timeToSlot(t.suggested_time) : null;
      const duration = minutesToSlots(t.duration_minutes ?? 30);
      const project_id = t.project ? (projectByName.get(t.project.trim()) || null) : null;
      const deadline_id = t.deadline
        ? (deadlineByDate.get(String(t.deadline).slice(0, 10)) || null)
        : null;

      await env.DB.prepare(`
        INSERT INTO tasks (id, user_id, project_id, deadline_id, date, text, priority,
                           duration, slot, done, color_id, note, sort_order,
                           created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'white', '', 0, ?, ?)
      `).bind(
        id, data.userId, project_id, deadline_id, today,
        t.title.trim(), t.priority || null,
        duration, slot, now, now
      ).run();

      created.push({
        id,
        title: t.title.trim(),
        priority: t.priority || null,
        start_time: slot != null ? slotToTime(slot) : null,
        end_time: slot != null ? slotToTime(slot + duration) : null,
        duration_minutes: slotsToMinutes(duration),
        project: t.project || null,
        deadline: deadline_id ? (String(t.deadline).slice(0, 10)) : null,
        date: today,
        completed: false,
      });
    }

    return Response.json({ data: created }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
