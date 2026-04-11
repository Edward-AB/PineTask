/**
 * PineTask v1 → v2 Data Migration
 *
 * Reads every row from the `store` (JSON blob) table and inserts
 * into the new relational tables: projects, deadlines, tasks.
 * Also creates user_settings rows with defaults.
 *
 * This migration was run manually via Cloudflare MCP on 2026-04-11.
 * Kept here for documentation and repeatability.
 *
 * v1 JSON blob structure per user:
 *   { _projects: [...], _deadlines: [...], "YYYY-MM-DD": [tasks...] }
 *
 * Run via Cloudflare Worker or MCP:
 *   1. Read all rows from `store`
 *   2. Parse JSON, insert into relational tables
 *   3. Rename `store` → `store_v1_backup`
 */

export async function migrateV1Data(DB, dryRun = false) {
  const rows = await DB.prepare('SELECT user_id, data FROM store').all();
  const log = [];

  for (const row of rows.results) {
    const userId = row.user_id;
    let data;
    try {
      data = JSON.parse(row.data);
    } catch {
      log.push(`SKIP user ${userId}: invalid JSON`);
      continue;
    }

    const projects = Array.isArray(data._projects) ? data._projects : [];
    const deadlines = Array.isArray(data._deadlines) ? data._deadlines : [];

    // Insert projects
    for (const p of projects) {
      const sql = `INSERT INTO projects (id, user_id, name, description, color_idx, start_date, end_date, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [p.id, userId, p.name || 'Untitled', p.desc || '', p.colorIdx || 0, p.startDate || null, p.endDate || null, Date.now()];
      log.push(`PROJECT: ${p.name} (${p.id})`);
      if (!dryRun) await DB.prepare(sql).bind(...params).run();
    }

    // Insert deadlines
    for (const d of deadlines) {
      const sql = `INSERT INTO deadlines (id, user_id, project_id, title, description, start_date, due_date, color_idx, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const startDate = d.startDate || d.date;
      const params = [d.id, userId, d.projectId || null, d.title || 'Untitled', d.desc || '', startDate, d.date, d.colorIdx || 0, Date.now()];
      log.push(`DEADLINE: ${d.title} (${d.id})`);
      if (!dryRun) await DB.prepare(sql).bind(...params).run();
    }

    // Insert tasks (keys that look like dates: YYYY-MM-DD)
    for (const [key, tasks] of Object.entries(data)) {
      if (key.startsWith('_') || !Array.isArray(tasks) || !/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      for (const t of tasks) {
        if (!t.id || !t.text) continue;
        const colorId = typeof t.colorId === 'number' ? 'white' : (t.colorId || 'white');
        const sql = `INSERT INTO tasks (id, user_id, date, text, priority, duration, slot, done, deadline_id, note, color_id, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [t.id, userId, key, t.text, t.priority || null, t.dur || 2, t.slot ?? null, t.done ? 1 : 0, t.deadlineId || null, t.note || '', colorId, Date.now()];
        log.push(`TASK: ${t.text} on ${key}`);
        if (!dryRun) await DB.prepare(sql).bind(...params).run();
      }
    }

    // Create user_settings
    if (!dryRun) {
      await DB.prepare('INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)').bind(userId).run();
    }
    log.push(`SETTINGS created for ${userId}`);
  }

  // Rename store table
  if (!dryRun) {
    await DB.prepare('ALTER TABLE store RENAME TO store_v1_backup').run();
    log.push('RENAMED store → store_v1_backup');
  }

  return log;
}
