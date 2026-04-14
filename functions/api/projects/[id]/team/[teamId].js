// DELETE /api/projects/:id/team/:teamId — unassign

export async function onRequestDelete({ env, data, params }) {
  try {
    const proj = await env.DB.prepare('SELECT user_id FROM projects WHERE id = ?').bind(params.id).first();
    if (!proj) return Response.json({ error: 'Project not found' }, { status: 404 });
    if (proj.user_id !== data.userId) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const result = await env.DB.prepare(
      'DELETE FROM project_team_assignments WHERE project_id = ? AND team_id = ?'
    ).bind(params.id, params.teamId).run();
    if (!result.meta.changes) return Response.json({ error: 'Assignment not found' }, { status: 404 });
    return Response.json({ data: { removed: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
