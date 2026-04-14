import { isAdmin, randomToken, isMember } from '../../_helpers/teams.js';

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const INVITE_LIMIT_PER_DAY = 20;

// POST /api/teams/:id/invite — send an email invite
// GET  /api/teams/:id/invite — list pending invitations
// DELETE via separate revoke endpoint below

export async function onRequestPost({ request, env, data, params }) {
  try {
    const member = await isMember(env.DB, params.id, data.userId);
    if (!member) return Response.json({ error: 'Not a member' }, { status: 403 });

    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: 'valid email required' }, { status: 400 });
    }

    // Rate limit: max 20 per team per day
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = await env.DB.prepare(
      'SELECT COUNT(*) AS c FROM team_invitations WHERE team_id = ? AND created_at > ?'
    ).bind(params.id, dayAgo).first();
    if ((recent?.c || 0) >= INVITE_LIMIT_PER_DAY) {
      return Response.json({ error: 'Daily invite limit reached' }, { status: 429 });
    }

    // Don't send duplicate pending invites to the same email for the same team
    const dup = await env.DB.prepare(
      "SELECT id FROM team_invitations WHERE team_id = ? AND invitee_email = ? AND status = 'pending'"
    ).bind(params.id, email).first();
    if (dup) return Response.json({ error: 'Pending invite already exists for this email' }, { status: 409 });

    // Check if email belongs to an existing user
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    // If the existing user is already a member, reject
    if (existingUser) {
      const alreadyMember = await env.DB.prepare(
        'SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?'
      ).bind(params.id, existingUser.id).first();
      if (alreadyMember) {
        return Response.json({ error: 'User is already a member of this team' }, { status: 409 });
      }
    }

    const id = crypto.randomUUID();
    const token = randomToken(16);
    const now = Date.now();
    const expires = now + INVITE_TTL_MS;

    await env.DB.prepare(`
      INSERT INTO team_invitations (id, team_id, invited_by, invitee_email, token, status, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `).bind(id, params.id, data.userId, email, token, now, expires).run();

    const url = new URL(request.url);
    const inviteUrl = `${url.origin}/invite/${token}`;

    // TODO: integrate email sending with Resend/SendGrid.
    console.log(`[invite] team=${params.id} email=${email} url=${inviteUrl}`);

    return Response.json({
      data: {
        id,
        token,
        inviteUrl,
        email,
        status: 'pending',
        expiresAt: expires,
        isExistingUser: !!existingUser,
      },
    }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestGet({ env, data, params }) {
  try {
    const member = await isMember(env.DB, params.id, data.userId);
    if (!member) return Response.json({ error: 'Not a member' }, { status: 403 });

    const now = Date.now();
    // Mark expired entries lazily
    await env.DB.prepare(
      "UPDATE team_invitations SET status = 'expired' WHERE team_id = ? AND status = 'pending' AND expires_at < ?"
    ).bind(params.id, now).run();

    const rows = await env.DB.prepare(`
      SELECT i.id, i.invitee_email, i.status, i.created_at, i.expires_at, u.username AS invited_by_username
      FROM team_invitations i
      LEFT JOIN users u ON u.id = i.invited_by
      WHERE i.team_id = ?
      ORDER BY i.created_at DESC
    `).bind(params.id).all();

    return Response.json({ data: rows.results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
