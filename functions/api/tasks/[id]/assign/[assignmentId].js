// DELETE /api/tasks/:id/assign/:assignmentId — remove an assignment

export async function onRequestDelete({ env, data, params }) {
  try {
    const task = await env.DB.prepare('SELECT user_id FROM tasks WHERE id = ?').bind(params.id).first();
    if (!task) return Response.json({ error: 'Task not found' }, { status: 404 });
    if (task.user_id !== data.userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await env.DB.prepare(
      'DELETE FROM task_assignments WHERE id = ? AND task_id = ?'
    ).bind(params.assignmentId, params.id).run();
    if (!result.meta.changes) return Response.json({ error: 'Assignment not found' }, { status: 404 });
    return Response.json({ data: { removed: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
