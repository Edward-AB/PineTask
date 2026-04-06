import { SignJWT } from 'jose';

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json();
  if (!email || !password) return Response.json({ error: 'Missing fields' }, { status: 400 });

  // Hash the password securely
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(password + env.SALT));
  const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuf)));

  const id = crypto.randomUUID();
  try {
    await env.DB.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, email.toLowerCase(), hash, Date.now()).run();
  } catch {
    return Response.json({ error: 'Email already in use' }, { status: 409 });
  }

  const token = await new SignJWT({ userId: id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(enc.encode(env.JWT_SECRET));

  return Response.json({ token });
}
