// GET /api/invite/:token — inspect an invitation (public, no auth)
// POST /api/invite/:token/decline handled in decline.js

export async function onRequestGet({ env, params }) {
  try {
    const inv = await env.DB.prepare(`
      SELECT i.id, i.team_id, i.invitee_email, i.status, i.expires_at, i.invited_by,
             u.username AS invited_by_username,
             t.name AS team_name, t.description AS team_description, t.color AS team_color,
             (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) AS member_count
      FROM team_invitations i
      LEFT JOIN users u ON u.id = i.invited_by
      LEFT JOIN teams t ON t.id = i.team_id
      WHERE i.token = ?
    `).bind(params.token).first();

    if (!inv) return Response.json({ error: 'Invitation not found' }, { status: 404 });

    let status = inv.status;
    if (status === 'pending' && inv.expires_at < Date.now()) {
      status = 'expired';
      await env.DB.prepare("UPDATE team_invitations SET status = 'expired' WHERE id = ?")
        .bind(inv.id).run();
    }

    return Response.json({
      data: {
        status,
        team: {
          id: inv.team_id,
          name: inv.team_name,
          description: inv.team_description,
          color: inv.team_color,
          memberCount: inv.member_count,
        },
        invitedBy: { username: inv.invited_by_username },
        inviteeEmail: inv.invitee_email,
        expiresAt: inv.expires_at,
      },
    });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
