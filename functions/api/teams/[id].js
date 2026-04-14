import { getTeamRole, isMember, isAdmin, isOwner } from '../_helpers/teams.js';

// GET /api/teams/:id — team detail with members
// PATCH /api/teams/:id — update (owner/admin)
// DELETE /api/teams/:id — delete (owner only, requires name confirm)

export async function onRequestGet({ env, data, params }) {
  try {
    const role = await getTeamRole(env.DB, params.id, data.userId);
    if (!role) return Response.json({ error: 'Not a member' }, { status: 403 });

    const team = await env.DB.prepare(
      'SELECT id, name, description, color, owner_id, avatar_url, created_at, updated_at FROM teams WHERE id = ?'
    ).bind(params.id).first();
    if (!team) return Response.json({ error: 'Team not found' }, { status: 404 });

    const members = await env.DB.prepare(`
      SELECT u.id, u.username, u.email, u.avatar_url, tm.role, tm.joined_at
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
      ORDER BY
        CASE tm.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END,
        tm.joined_at ASC
    `).bind(params.id).all();

    return Response.json({ data: { ...team, user_role: role, members: members.results } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPatch({ request, env, data, params }) {
  try {
    const admin = await isAdmin(env.DB, params.id, data.userId);
    if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const allowed = ['name', 'description', 'color', 'avatar_url'];
    const sets = [];
    const values = [];
    for (const f of allowed) {
      if (f in body) {
        sets.push(`${f} = ?`);
        values.push(body[f]);
      }
    }
    if (!sets.length) return Response.json({ error: 'No valid fields' }, { status: 400 });
    sets.push('updated_at = ?'); values.push(Date.now());
    values.push(params.id);

    await env.DB.prepare(`UPDATE teams SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    const team = await env.DB.prepare('SELECT * FROM teams WHERE id = ?').bind(params.id).first();
    return Response.json({ data: team });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env, data, params }) {
  try {
    const owner = await isOwner(env.DB, params.id, data.userId);
    if (!owner) return Response.json({ error: 'Only owner can delete' }, { status: 403 });

    let body = {};
    try { body = await request.json(); } catch {}
    const team = await env.DB.prepare('SELECT name FROM teams WHERE id = ?').bind(params.id).first();
    if (!team) return Response.json({ error: 'Team not found' }, { status: 404 });
    if (body.confirmName !== team.name) {
      return Response.json({ error: 'Name does not match' }, { status: 400 });
    }

    await env.DB.prepare('DELETE FROM teams WHERE id = ?').bind(params.id).run();
    return Response.json({ data: { id: params.id, deleted: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
