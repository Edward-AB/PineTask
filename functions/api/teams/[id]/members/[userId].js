import { getTeamRole } from '../../../_helpers/teams.js';

// DELETE /api/teams/:id/members/:userId — remove member or leave team
// PATCH /api/teams/:id/members/:userId — change role

export async function onRequestDelete({ env, data, params }) {
  try {
    const selfRole = await getTeamRole(env.DB, params.id, data.userId);
    if (!selfRole) return Response.json({ error: 'Not a member' }, { status: 403 });

    const targetRole = await getTeamRole(env.DB, params.id, params.userId);
    if (!targetRole) return Response.json({ error: 'Member not found' }, { status: 404 });

    const isSelf = params.userId === data.userId;
    const canRemove =
      isSelf ||
      (selfRole === 'owner') ||
      (selfRole === 'admin' && targetRole === 'member');

    if (!canRemove) return Response.json({ error: 'Forbidden' }, { status: 403 });
    if (!isSelf && targetRole === 'owner') {
      return Response.json({ error: 'Cannot remove the owner' }, { status: 403 });
    }
    if (isSelf && targetRole === 'owner') {
      return Response.json({ error: 'Owner cannot leave their own team. Delete it instead.' }, { status: 400 });
    }

    await env.DB.prepare(
      'DELETE FROM team_members WHERE team_id = ? AND user_id = ?'
    ).bind(params.id, params.userId).run();

    return Response.json({ data: { removed: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPatch({ request, env, data, params }) {
  try {
    const selfRole = await getTeamRole(env.DB, params.id, data.userId);
    if (selfRole !== 'owner') return Response.json({ error: 'Only owner can change roles' }, { status: 403 });
    if (params.userId === data.userId) return Response.json({ error: 'Cannot change own role' }, { status: 400 });

    const body = await request.json();
    const { role } = body;
    if (!['admin', 'member'].includes(role)) {
      return Response.json({ error: "role must be 'admin' or 'member'" }, { status: 400 });
    }

    const target = await getTeamRole(env.DB, params.id, params.userId);
    if (!target) return Response.json({ error: 'Member not found' }, { status: 404 });
    if (target === 'owner') return Response.json({ error: 'Cannot demote the owner' }, { status: 400 });

    await env.DB.prepare(
      'UPDATE team_members SET role = ? WHERE team_id = ? AND user_id = ?'
    ).bind(role, params.id, params.userId).run();

    return Response.json({ data: { role } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
