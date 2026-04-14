// GET /api/messages/contacts — list of all team-mates the user can message,
// grouped by team.

export async function onRequestGet({ env, data }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT t.id AS team_id, t.name AS team_name, t.color AS team_color,
             u.id AS user_id, u.username, u.avatar_url, tm.role
      FROM team_members me
      JOIN teams t ON t.id = me.team_id
      JOIN team_members tm ON tm.team_id = t.id
      JOIN users u ON u.id = tm.user_id
      WHERE me.user_id = ? AND tm.user_id != ?
      ORDER BY t.name ASC, u.username ASC
    `).bind(data.userId, data.userId).all();

    const teams = new Map();
    for (const r of rows.results) {
      if (!teams.has(r.team_id)) {
        teams.set(r.team_id, {
          teamId: r.team_id,
          teamName: r.team_name,
          teamColor: r.team_color,
          members: [],
        });
      }
      teams.get(r.team_id).members.push({
        id: r.user_id,
        username: r.username,
        avatar_url: r.avatar_url,
        role: r.role,
      });
    }

    return Response.json({ data: Array.from(teams.values()) });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
