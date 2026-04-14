import { isAdmin, isMember } from '../../_helpers/teams.js';

// POST /api/tasks/:id/assign  — body { teamId?, assignedTo? }
// GET  /api/tasks/:id/assign  — list assignments for the task

export async function onRequestGet({ env, data, params }) {
  try {
    // Task must belong to user OR be shared with a team the user is in
    const task = await env.DB.prepare('SELECT user_id FROM tasks WHERE id = ?').bind(params.id).first();
    if (!task) return Response.json({ error: 'Task not found' }, { status: 404 });

    const rows = await env.DB.prepare(`
      SELECT ta.id, ta.team_id, ta.assigned_to, ta.assigned_by, ta.created_at,
             t.name AS team_name, t.color AS team_color,
             u.username AS assignee_username, u.avatar_url AS assignee_avatar
      FROM task_assignments ta
      LEFT JOIN teams t ON t.id = ta.team_id
      LEFT JOIN users u ON u.id = ta.assigned_to
      WHERE ta.task_id = ?
    `).bind(params.id).all();

    // Permission: either the task owner, or a member of an assigned team
    const isOwner = task.user_id === data.userId;
    let canView = isOwner;
    if (!canView) {
      for (const r of rows.results) {
        if (r.team_id && (await isMember(env.DB, r.team_id, data.userId))) {
          canView = true; break;
        }
        if (r.assigned_to === data.userId) { canView = true; break; }
      }
    }
    if (!canView) return Response.json({ error: 'Forbidden' }, { status: 403 });

    return Response.json({ data: rows.results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, data, params }) {
  try {
    const body = await request.json();
    const { teamId = null, assignedTo = null } = body;
    if (!teamId && !assignedTo) {
      return Response.json({ error: 'teamId or assignedTo required' }, { status: 400 });
    }

    const task = await env.DB.prepare(
      'SELECT user_id FROM tasks WHERE id = ?'
    ).bind(params.id).first();
    if (!task) return Response.json({ error: 'Task not found' }, { status: 404 });

    // Only the task owner can assign
    if (task.user_id !== data.userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // The assigner must be a member of the team they're assigning to
    if (teamId) {
      const member = await isMember(env.DB, teamId, data.userId);
      if (!member) return Response.json({ error: 'Not a member of that team' }, { status: 403 });
    }

    // If assignedTo is set, they must share at least one team with the task owner
    if (assignedTo && teamId) {
      const hasMember = await env.DB.prepare(
        'SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?'
      ).bind(teamId, assignedTo).first();
      if (!hasMember) return Response.json({ error: 'Assignee is not a team member' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = Date.now();
    await env.DB.prepare(`
      INSERT INTO task_assignments (id, task_id, team_id, assigned_to, assigned_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, params.id, teamId, assignedTo, data.userId, now).run();

    const row = await env.DB.prepare(`
      SELECT ta.id, ta.team_id, ta.assigned_to, ta.assigned_by, ta.created_at,
             t.name AS team_name, t.color AS team_color,
             u.username AS assignee_username
      FROM task_assignments ta
      LEFT JOIN teams t ON t.id = ta.team_id
      LEFT JOIN users u ON u.id = ta.assigned_to
      WHERE ta.id = ?
    `).bind(id).first();

    return Response.json({ data: row }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
