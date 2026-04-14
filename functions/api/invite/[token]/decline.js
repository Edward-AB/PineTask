// POST /api/invite/:token/decline — public (no auth required)

export async function onRequestPost({ env, params }) {
  try {
    const inv = await env.DB.prepare(
      "SELECT id, status FROM team_invitations WHERE token = ?"
    ).bind(params.token).first();
    if (!inv) return Response.json({ error: 'Invitation not found' }, { status: 404 });
    if (inv.status !== 'pending') {
      return Response.json({ error: `Invitation is already ${inv.status}` }, { status: 400 });
    }

    await env.DB.prepare("UPDATE team_invitations SET status = 'declined' WHERE id = ?")
      .bind(inv.id).run();
    return Response.json({ data: { declined: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
