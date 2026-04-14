import { getTeamRole, isMember } from '../../_helpers/teams.js';

// GET /api/teams/:id/members — full member list

export async function onRequestGet({ env, data, params }) {
  try {
    const role = await getTeamRole(env.DB, params.id, data.userId);
    if (!role) return Response.json({ error: 'Not a member' }, { status: 403 });

    const rows = await env.DB.prepare(`
      SELECT u.id, u.username, u.email, u.avatar_url, tm.role, tm.joined_at
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
      ORDER BY
        CASE tm.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END,
        tm.joined_at ASC
    `).bind(params.id).all();
    return Response.json({ data: rows.results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
