import { jwtVerify } from 'jose';

async function getUserId(request, secret) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.userId;
  } catch { return null; }
}

export async function onRequestGet({ request, env }) {
  const userId = await getUserId(request, env.JWT_SECRET);
  if (!userId) return new Response('Unauthorised', { status: 401 });
  const row = await env.DB.prepare('SELECT data FROM store WHERE user_id = ?').bind(userId).first();
  return Response.json(row ? JSON.parse(row.data) : {});
}

export async function onRequestPost({ request, env }) {
  const userId = await getUserId(request, env.JWT_SECRET);
  if (!userId) return new Response('Unauthorised', { status: 401 });
  const data = await request.json();
  await env.DB.prepare('INSERT OR REPLACE INTO store (user_id, data, updated_at) VALUES (?, ?, ?)')
    .bind(userId, JSON.stringify(data), Date.now()).run();
  return Response.json({ ok: true });
}
