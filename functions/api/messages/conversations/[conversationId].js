// GET /api/messages/conversations/:conversationId — fetch messages (pagination)
//     ?before=messageId → older pages
//     ?after=messageId  → incremental polling (no read mark on after-queries)
// POST — send message (content ≤ 2000 chars)

const PAGE_SIZE = 50;

async function requireParticipation(env, conversationId, userId) {
  const conv = await env.DB.prepare(
    'SELECT id, team_id, participant_a, participant_b FROM conversations WHERE id = ?'
  ).bind(conversationId).first();
  if (!conv) return null;
  if (conv.participant_a !== userId && conv.participant_b !== userId) return null;
  return conv;
}

export async function onRequestGet({ request, env, data, params }) {
  try {
    const conv = await requireParticipation(env, params.conversationId, data.userId);
    if (!conv) return Response.json({ error: 'Not found or forbidden' }, { status: 404 });

    const url = new URL(request.url);
    const before = url.searchParams.get('before');
    const after = url.searchParams.get('after');

    let messages;
    if (after) {
      const anchor = await env.DB.prepare(
        'SELECT created_at FROM messages WHERE id = ? AND conversation_id = ?'
      ).bind(after, conv.id).first();
      const ts = anchor?.created_at || 0;
      const res = await env.DB.prepare(`
        SELECT id, conversation_id, sender_id, content, read_at, created_at
        FROM messages
        WHERE conversation_id = ? AND created_at > ?
        ORDER BY created_at ASC
        LIMIT ?
      `).bind(conv.id, ts, PAGE_SIZE).all();
      messages = res.results || [];
    } else if (before) {
      const anchor = await env.DB.prepare(
        'SELECT created_at FROM messages WHERE id = ? AND conversation_id = ?'
      ).bind(before, conv.id).first();
      const ts = anchor?.created_at || Date.now();
      const res = await env.DB.prepare(`
        SELECT id, conversation_id, sender_id, content, read_at, created_at
        FROM messages
        WHERE conversation_id = ? AND created_at < ?
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(conv.id, ts, PAGE_SIZE).all();
      messages = (res.results || []).reverse();
    } else {
      const res = await env.DB.prepare(`
        SELECT id, conversation_id, sender_id, content, read_at, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(conv.id, PAGE_SIZE).all();
      messages = (res.results || []).reverse();
    }

    // Mark messages from the OTHER participant as read (only on initial / non-after queries)
    if (!after) {
      const now = Date.now();
      await env.DB.batch([
        env.DB.prepare(
          'UPDATE messages SET read_at = ? WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL'
        ).bind(now, conv.id, data.userId),
        env.DB.prepare(
          'INSERT INTO unread_counts (user_id, conversation_id, count) VALUES (?, ?, 0) ' +
          'ON CONFLICT(user_id, conversation_id) DO UPDATE SET count = 0'
        ).bind(data.userId, conv.id),
      ]);
    }

    return Response.json({ data: messages });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, data, params }) {
  try {
    const conv = await requireParticipation(env, params.conversationId, data.userId);
    if (!conv) return Response.json({ error: 'Not found or forbidden' }, { status: 404 });

    const body = await request.json();
    const content = String(body.content || '').trim();
    if (!content) return Response.json({ error: 'content required' }, { status: 400 });
    if (content.length > 2000) return Response.json({ error: 'content too long' }, { status: 400 });

    const id = crypto.randomUUID();
    const now = Date.now();
    const otherId = conv.participant_a === data.userId ? conv.participant_b : conv.participant_a;

    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(id, conv.id, data.userId, content, now),
      env.DB.prepare(
        'UPDATE conversations SET last_message_at = ? WHERE id = ?'
      ).bind(now, conv.id),
      env.DB.prepare(
        'INSERT INTO unread_counts (user_id, conversation_id, count) VALUES (?, ?, 1) ' +
        'ON CONFLICT(user_id, conversation_id) DO UPDATE SET count = count + 1'
      ).bind(otherId, conv.id),
    ]);

    const msg = await env.DB.prepare(
      'SELECT * FROM messages WHERE id = ?'
    ).bind(id).first();

    return Response.json({ data: msg }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
