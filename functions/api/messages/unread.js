// GET /api/messages/unread — total unread messages for the current user

export async function onRequestGet({ env, data }) {
  try {
    const row = await env.DB.prepare(
      'SELECT COALESCE(SUM(count), 0) AS total FROM unread_counts WHERE user_id = ?'
    ).bind(data.userId).first();
    return Response.json({ data: { count: row?.total || 0 } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
