// GET /api/schedule/today
//
// Returns today's scheduled tasks and the free blocks inside the user's
// working hours. Today is computed in the user's configured timezone.

import {
  slotToTime,
  slotsToMinutes,
  todayInTimezone,
  computeFreeBlocks,
  loadUserSettings,
} from '../_helpers/schedule.js';

export async function onRequestGet({ env, data }) {
  try {
    // Resolve user's timezone, falling back to UTC.
    const userRow = await env.DB.prepare(
      'SELECT timezone FROM users WHERE id = ?'
    ).bind(data.userId).first();
    const tz = userRow?.timezone || 'UTC';
    const date = todayInTimezone(tz);

    const { work_hours_start, work_hours_end } = await loadUserSettings(env, data.userId);

    const tasksRes = await env.DB.prepare(`
      SELECT t.id, t.text, t.priority, t.slot, t.duration, t.done, t.project_id,
             p.name AS project_name
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.user_id = ? AND t.date = ?
      ORDER BY t.slot IS NULL, t.slot ASC, t.sort_order ASC, t.created_at ASC
    `).bind(data.userId, date).all();

    const rows = tasksRes.results || [];

    const scheduled_tasks = rows.map((r) => {
      const hasSlot = r.slot != null;
      const start = hasSlot ? r.slot : null;
      const end = hasSlot ? r.slot + (r.duration || 0) : null;
      return {
        id: r.id,
        title: r.text,
        priority: r.priority || null,
        start_time: hasSlot ? slotToTime(start) : null,
        end_time: hasSlot ? slotToTime(end) : null,
        duration_minutes: slotsToMinutes(r.duration || 0),
        project: r.project_name || null,
        completed: !!r.done,
      };
    });

    // Free blocks: gaps inside working hours, ignoring completed tasks.
    const intervals = rows
      .filter((r) => r.slot != null && !r.done)
      .map((r) => ({
        startSlot: r.slot,
        endSlot: r.slot + (r.duration || 1),
      }));

    const free = computeFreeBlocks(work_hours_start, work_hours_end, intervals)
      .map((b) => ({
        start: slotToTime(b.startSlot),
        end: slotToTime(b.endSlot),
        duration_minutes: (b.endSlot - b.startSlot) * 15,
      }));

    return Response.json({
      date,
      working_hours: {
        start: slotToTime(work_hours_start),
        end: slotToTime(work_hours_end),
      },
      scheduled_tasks,
      free_blocks: free,
    });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
