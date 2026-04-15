// API key management for the authenticated user.
//
//   GET    → returns masked prefix + created_at (no plaintext)
//   POST   → generates a new key, rotating any existing one, and returns
//            the plaintext ONCE so the UI can show it
//   DELETE → revokes the key (clears hash + prefix)
//
// API-key authed requests (authMethod === 'api_key') are refused for POST/
// DELETE — only a cookie/JWT session can rotate or revoke the key.

import {
  generateApiKey,
  hashApiKey,
  maskApiKey,
  prefixOf,
} from '../_helpers/apikey.js';

function requireSession(data) {
  if (data.authMethod === 'api_key') {
    return Response.json(
      { error: 'Key management requires a logged-in session, not an API key' },
      { status: 403 }
    );
  }
  return null;
}

export async function onRequestGet({ env, data }) {
  try {
    const row = await env.DB.prepare(
      'SELECT api_key_prefix, api_key_created_at FROM users WHERE id = ?'
    ).bind(data.userId).first();

    if (!row || !row.api_key_prefix) {
      return Response.json({ data: { present: false } });
    }
    return Response.json({
      data: {
        present: true,
        masked: `${row.api_key_prefix}••••••••`,
        created_at: row.api_key_created_at,
      },
    });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestPost({ env, data }) {
  const gate = requireSession(data);
  if (gate) return gate;

  try {
    const key = generateApiKey();
    const hash = await hashApiKey(key);
    const prefix = prefixOf(key);
    const now = Date.now();

    await env.DB.prepare(
      `UPDATE users
         SET api_key_hash = ?, api_key_prefix = ?, api_key_created_at = ?, updated_at = ?
       WHERE id = ?`
    ).bind(hash, prefix, now, now, data.userId).run();

    return Response.json({
      data: {
        key, // plaintext — shown once
        masked: maskApiKey(key),
        prefix,
        created_at: now,
      },
    }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function onRequestDelete({ env, data }) {
  const gate = requireSession(data);
  if (gate) return gate;

  try {
    await env.DB.prepare(
      `UPDATE users
         SET api_key_hash = NULL, api_key_prefix = NULL, api_key_created_at = NULL,
             updated_at = ?
       WHERE id = ?`
    ).bind(Date.now(), data.userId).run();
    return Response.json({ data: { revoked: true } });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
