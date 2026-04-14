import { isMember } from '../../_helpers/teams.js';

// GET /api/teams/:id/tasks
// Returns all tasks that are relevant to this team:
//   - Tasks with a task_assignment row targeting this team
//   - Tasks belonging to a project that is assigned to this team
// Results include assignment info so the UI can show who owns them.

export async function onRequestGet({ env, data, params }) {
  try {
    const member = await isMember(env.DB, params.id, data.userId);
    if (!member) return Response.json({ error: 'Not a member' }, { status: 403 });

    const rows = await env.DB.prepare(`
      SELECT DISTINCT t.*,
             ta.id AS assignment_id, ta.team_id AS assignment_team_id, ta.assigned_to,
             u.username AS assignee_username, u.avatar_url AS assignee_avatar
      FROM tasks t
      LEFT JOIN task_assignments ta ON ta.task_id = t.id AND ta.team_id = ?
      LEFT JOIN project_team_assignments pta ON pta.project_id = t.project_id AND pta.team_id = ?
      LEFT JOIN users u ON u.id = ta.assigned_to
      WHERE ta.id IS NOT NULL OR pta.id IS NOT NULL
      ORDER BY t.date ASC, t.created_at ASC
    `).bind(params.id, params.id).all();

    return Response.json({ data: rows.results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
