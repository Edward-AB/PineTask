// GET /api/teams — teams the user is a member of
// POST /api/teams — create a team (creator becomes owner)

export async function onRequestGet({ env, data }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT t.id, t.name, t.description, t.color, t.owner_id, t.avatar_url, t.created_at, t.updated_at,
             tm.role AS user_role,
             (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) AS member_count
      FROM teams t
      JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
      ORDER BY t.created_at ASC
    `).bind(data.userId).all();

    return Response.json({ data: rows.results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, data }) {
  try {
    const body = await request.json();
    const { name, description = '', color = '#3B6D11' } = body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    const teamId = crypto.randomUUID();
    const memberId = crypto.randomUUID();
    const now = Date.now();

    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO teams (id, name, description, color, owner_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(teamId, name.trim(), description, color, data.userId, now, now),
      env.DB.prepare(`
        INSERT INTO team_members (id, team_id, user_id, role, joined_at)
        VALUES (?, ?, ?, 'owner', ?)
      `).bind(memberId, teamId, data.userId, now),
    ]);

    const team = await env.DB.prepare(`
      SELECT t.*, 'owner' AS user_role, 1 AS member_count
      FROM teams t WHERE t.id = ?
    `).bind(teamId).first();

    return Response.json({ data: team }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
