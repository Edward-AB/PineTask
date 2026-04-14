import { isMember } from '../../_helpers/teams.js';

// GET  /api/projects/:id/team — current team assignment(s)
// POST /api/projects/:id/team — assign to a team. body { teamId }

export async function onRequestGet({ env, data, params }) {
  try {
    // Must own the project or be a member of an assigned team
    const proj = await env.DB.prepare('SELECT user_id FROM projects WHERE id = ?').bind(params.id).first();
    if (!proj) return Response.json({ error: 'Project not found' }, { status: 404 });

    const rows = await env.DB.prepare(`
      SELECT pta.id, pta.team_id, pta.assigned_by, pta.created_at,
             t.name AS team_name, t.color AS team_color
      FROM project_team_assignments pta
      JOIN teams t ON t.id = pta.team_id
      WHERE pta.project_id = ?
    `).bind(params.id).all();

    const isOwner = proj.user_id === data.userId;
    let canView = isOwner;
    if (!canView) {
      for (const r of rows.results) {
        if (await isMember(env.DB, r.team_id, data.userId)) { canView = true; break; }
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
    const { teamId } = body;
    if (!teamId) return Response.json({ error: 'teamId required' }, { status: 400 });

    const proj = await env.DB.prepare('SELECT user_id FROM projects WHERE id = ?').bind(params.id).first();
    if (!proj) return Response.json({ error: 'Project not found' }, { status: 404 });
    if (proj.user_id !== data.userId) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const member = await isMember(env.DB, teamId, data.userId);
    if (!member) return Response.json({ error: 'Not a member of that team' }, { status: 403 });

    const dup = await env.DB.prepare(
      'SELECT id FROM project_team_assignments WHERE project_id = ? AND team_id = ?'
    ).bind(params.id, teamId).first();
    if (dup) return Response.json({ data: { id: dup.id, team_id: teamId } });

    const id = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO project_team_assignments (id, project_id, team_id, assigned_by, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, params.id, teamId, data.userId, Date.now()).run();

    return Response.json({ data: { id, team_id: teamId } }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
