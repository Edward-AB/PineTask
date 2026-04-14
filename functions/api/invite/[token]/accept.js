// POST /api/invite/:token/accept — requires auth

export async function onRequestPost({ env, data, params }) {
  try {
    const inv = await env.DB.prepare(
      "SELECT id, team_id, status, expires_at FROM team_invitations WHERE token = ?"
    ).bind(params.token).first();

    if (!inv) return Response.json({ error: 'Invitation not found' }, { status: 404 });
    if (inv.status !== 'pending') {
      return Response.json({ error: `Invitation is ${inv.status}` }, { status: 400 });
    }
    if (inv.expires_at < Date.now()) {
      await env.DB.prepare("UPDATE team_invitations SET status = 'expired' WHERE id = ?")
        .bind(inv.id).run();
      return Response.json({ error: 'Invitation expired' }, { status: 400 });
    }

    const already = await env.DB.prepare(
      'SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?'
    ).bind(inv.team_id, data.userId).first();
    if (already) {
      await env.DB.prepare("UPDATE team_invitations SET status = 'accepted' WHERE id = ?")
        .bind(inv.id).run();
      return Response.json({ error: 'Already a member', teamId: inv.team_id }, { status: 409 });
    }

    const memberId = crypto.randomUUID();
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO team_members (id, team_id, user_id, role, joined_at) VALUES (?, ?, ?, 'member', ?)"
      ).bind(memberId, inv.team_id, data.userId, now),
      env.DB.prepare(
        "UPDATE team_invitations SET status = 'accepted' WHERE id = ?"
      ).bind(inv.id),
    ]);

    return Response.json({ data: { teamId: inv.team_id, role: 'member' } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
