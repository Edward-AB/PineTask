import { isMember } from '../../_helpers/teams.js';

// GET /api/teams/:id/schedules?date=YYYY-MM-DD
// Returns scheduled tasks for every team member for the given date.
// Tasks belonging to this team / a team-project are returned in full.
// Other tasks become { slot, duration, private: true } so privacy is preserved.

export async function onRequestGet({ request, env, data, params }) {
  try {
    const member = await isMember(env.DB, params.id, data.userId);
    if (!member) return Response.json({ error: 'Not a member' }, { status: 403 });

    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    if (!date) return Response.json({ error: 'date is required' }, { status: 400 });

    const members = await env.DB.prepare(`
      SELECT u.id, u.username, u.avatar_url, tm.role
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
    `).bind(params.id).all();

    // Projects assigned to this team
    const projRows = await env.DB.prepare(
      'SELECT project_id FROM project_team_assignments WHERE team_id = ?'
    ).bind(params.id).all();
    const teamProjects = new Set((projRows.results || []).map((r) => r.project_id));

    // Tasks assigned directly (task_assignments) to this team
    const taAssignRows = await env.DB.prepare(
      'SELECT DISTINCT task_id FROM task_assignments WHERE team_id = ?'
    ).bind(params.id).all();
    const teamTaskIds = new Set((taAssignRows.results || []).map((r) => r.task_id));

    // Blocked times for each member (day-of-week based)
    const dayOfWeek = new Date(date + 'T12:00:00').getDay(); // 0 = Sunday

    const schedules = [];
    for (const m of members.results) {
      const tasksRes = await env.DB.prepare(`
        SELECT id, date, text, priority, duration, slot, done, color_id, note, deadline_id, project_id
        FROM tasks
        WHERE user_id = ? AND date = ? AND slot IS NOT NULL
      `).bind(m.id, date).all();

      const tasks = (tasksRes.results || []).map((t) => {
        const isTeamRelevant =
          teamTaskIds.has(t.id) ||
          (t.project_id && teamProjects.has(t.project_id));
        if (isTeamRelevant || m.id === data.userId) {
          return t;
        }
        return { id: t.id, slot: t.slot, duration: t.duration, private: true };
      });

      const btRes = await env.DB.prepare(`
        SELECT id, label, start_slot, end_slot, days, color
        FROM blocked_times
        WHERE user_id = ?
      `).bind(m.id).all();

      const blockedTimes = (btRes.results || []).filter((b) => {
        const days = (b.days || '0,1,2,3,4,5,6').split(',').map(Number);
        return days.includes(dayOfWeek);
      });

      schedules.push({
        userId: m.id,
        username: m.username,
        avatar_url: m.avatar_url,
        role: m.role,
        tasks,
        blockedTimes,
      });
    }

    return Response.json({ data: schedules });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
