import { orderParticipants, isMember } from '../../_helpers/teams.js';

// GET  /api/messages/conversations — list all conversations for current user
// POST /api/messages/conversations — start (or fetch) a conversation. body { teamId, participantId }

export async function onRequestGet({ env, data }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT c.id, c.team_id, c.participant_a, c.participant_b, c.last_message_at, c.created_at,
             t.name AS team_name, t.color AS team_color,
             uc.count AS unread_count,
             (
               SELECT content FROM messages m
               WHERE m.conversation_id = c.id
               ORDER BY m.created_at DESC LIMIT 1
             ) AS last_message_preview,
             (
               SELECT sender_id FROM messages m
               WHERE m.conversation_id = c.id
               ORDER BY m.created_at DESC LIMIT 1
             ) AS last_sender_id
      FROM conversations c
      LEFT JOIN teams t ON t.id = c.team_id
      LEFT JOIN unread_counts uc ON uc.user_id = ? AND uc.conversation_id = c.id
      WHERE c.participant_a = ? OR c.participant_b = ?
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC
    `).bind(data.userId, data.userId, data.userId).all();

    const convs = [];
    for (const c of rows.results) {
      const otherId = c.participant_a === data.userId ? c.participant_b : c.participant_a;
      const other = await env.DB.prepare(
        'SELECT id, username, avatar_url FROM users WHERE id = ?'
      ).bind(otherId).first();
      const preview = c.last_message_preview
        ? String(c.last_message_preview).slice(0, 60)
        : '';
      convs.push({
        id: c.id,
        teamId: c.team_id,
        teamName: c.team_name,
        teamColor: c.team_color,
        other,
        lastMessageAt: c.last_message_at,
        lastMessagePreview: preview,
        lastSenderId: c.last_sender_id,
        unreadCount: c.unread_count || 0,
      });
    }

    return Response.json({ data: convs });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env, data }) {
  try {
    const body = await request.json();
    const { teamId, participantId } = body;
    if (!teamId || !participantId) {
      return Response.json({ error: 'teamId and participantId required' }, { status: 400 });
    }
    if (participantId === data.userId) {
      return Response.json({ error: 'Cannot message yourself' }, { status: 400 });
    }

    // Both users must be in the team
    const selfMember = await isMember(env.DB, teamId, data.userId);
    const otherMember = await isMember(env.DB, teamId, participantId);
    if (!selfMember || !otherMember) {
      return Response.json({ error: 'Both users must be team members' }, { status: 403 });
    }

    const [a, b] = orderParticipants(data.userId, participantId);

    // Check for existing conversation in this team
    const existing = await env.DB.prepare(
      'SELECT id FROM conversations WHERE team_id = ? AND participant_a = ? AND participant_b = ?'
    ).bind(teamId, a, b).first();

    if (existing) {
      return Response.json({ data: { id: existing.id, teamId, participant_a: a, participant_b: b } });
    }

    const id = crypto.randomUUID();
    const now = Date.now();
    await env.DB.prepare(`
      INSERT INTO conversations (id, team_id, participant_a, participant_b, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, teamId, a, b, now).run();

    return Response.json({
      data: { id, teamId, participant_a: a, participant_b: b, created_at: now },
    }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
