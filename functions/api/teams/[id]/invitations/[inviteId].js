import { isAdmin } from '../../../_helpers/teams.js';

// DELETE /api/teams/:id/invitations/:inviteId — revoke a pending invite

export async function onRequestDelete({ env, data, params }) {
  try {
    const admin = await isAdmin(env.DB, params.id, data.userId);
    if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const result = await env.DB.prepare(
      "DELETE FROM team_invitations WHERE id = ? AND team_id = ? AND status = 'pending'"
    ).bind(params.inviteId, params.id).run();

    if (!result.meta.changes) return Response.json({ error: 'Invitation not found' }, { status: 404 });
    return Response.json({ data: { revoked: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
