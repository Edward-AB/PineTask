export async function onRequestGet({ request, env, data }) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const status = url.searchParams.get('status');

    // Two supported query shapes:
    //   ?from=YYYY-MM-DD&to=YYYY-MM-DD  → date-bounded (internal app use)
    //   ?status=pending|completed|all   → status-filtered (public API)
    const hasDateRange = !!(from && to);
    const hasStatus = status !== null;

    if (!hasDateRange && !hasStatus) {
      return Response.json(
        { error: 'either (from & to) or status query params are required' },
        { status: 400 }
      );
    }

    let clause = '';
    const params = [data.userId];
    if (hasDateRange) {
      clause += ' AND date >= ? AND date <= ?';
      params.push(from, to);
    }
    if (hasStatus) {
      const s = status.toLowerCase();
      if (s === 'pending') clause += ' AND done = 0';
      else if (s === 'completed') clause += ' AND done = 1';
      else if (s !== 'all') {
        return Response.json({
          error: 'status must be pending | completed | all',
        }, { status: 400 });
      }
    }

    const tasks = await env.DB.prepare(`
      SELECT id, parent_task_id, deadline_id, project_id, date, text, priority,
             duration, slot, done, done_at, color_id, note, sort_order, created_at, updated_at
      FROM tasks
      WHERE user_id = ?${clause}
      ORDER BY sort_order ASC, created_at ASC
    `).bind(...params).all();

    // Enrich with team information (direct assignment OR via project-team assignment)
    const results = tasks.results || [];
    if (results.length > 0) {
      const ids = results.map((t) => t.id);
      const placeholders = ids.map(() => '?').join(',');
      const assignRows = await env.DB.prepare(`
        SELECT ta.task_id, t.id AS team_id, t.name AS team_name, t.color AS team_color
        FROM task_assignments ta
        JOIN teams t ON t.id = ta.team_id
        WHERE ta.task_id IN (${placeholders})
      `).bind(...ids).all();
      const projectIds = results.map((t) => t.project_id).filter(Boolean);
      let projAssignMap = new Map();
      if (projectIds.length > 0) {
        const projPlaceholders = projectIds.map(() => '?').join(',');
        const projAssignRows = await env.DB.prepare(`
          SELECT pta.project_id, t.id AS team_id, t.name AS team_name, t.color AS team_color
          FROM project_team_assignments pta
          JOIN teams t ON t.id = pta.team_id
          WHERE pta.project_id IN (${projPlaceholders})
        `).bind(...projectIds).all();
        for (const r of projAssignRows.results || []) {
          if (!projAssignMap.has(r.project_id)) projAssignMap.set(r.project_id, r);
        }
      }
      const taskTeamMap = new Map();
      for (const r of assignRows.results || []) {
        if (!taskTeamMap.has(r.task_id)) taskTeamMap.set(r.task_id, r);
      }
      for (const t of results) {
        let row = taskTeamMap.get(t.id);
        if (!row && t.project_id) row = projAssignMap.get(t.project_id);
        if (row) {
          t.team = { id: row.team_id, name: row.team_name, color: row.team_color };
        }
      }
    }

    return Response.json({ data: results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, data }) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = Date.now();

    const {
      date, text, priority = null, duration = 2, slot = null,
      done = 0, color_id = 'white', note = '', sort_order = 0,
      parent_task_id = null, deadline_id = null, project_id = null,
    } = body;

    if (!date || !text) {
      return Response.json({ error: 'date and text are required' }, { status: 400 });
    }

    await env.DB.prepare(`
      INSERT INTO tasks (id, user_id, parent_task_id, deadline_id, project_id, date, text, priority,
                         duration, slot, done, color_id, note, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, data.userId, parent_task_id, deadline_id, project_id, date, text, priority,
      duration, slot, done ? 1 : 0, color_id, note, sort_order, now, now
    ).run();

    const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
    return Response.json({ data: task }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
