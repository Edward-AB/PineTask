// API-key helpers for PineTask public API.
//
// Key shape:  ptk_<32 random url-safe chars>
// We store only a SHA-256 hash plus a short prefix (for masked UI display).

import { b64url } from './jwt.js';

const KEY_PREFIX = 'ptk_';
const KEY_RANDOM_BYTES = 24; // 24 bytes -> 32 base64url chars

/** Generate a fresh plaintext API key (shown to the user once). */
export function generateApiKey() {
  const bytes = new Uint8Array(KEY_RANDOM_BYTES);
  crypto.getRandomValues(bytes);
  const rand = b64url(btoa(String.fromCharCode(...bytes)));
  return `${KEY_PREFIX}${rand}`;
}

/** SHA-256 hash of a key, encoded as url-safe base64. */
export async function hashApiKey(key) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(key));
  return b64url(btoa(String.fromCharCode(...new Uint8Array(buf))));
}

/** Masked form for UI display, e.g. "ptk_abcdEFGH••••••XY34". */
export function maskApiKey(key) {
  if (!key || key.length < 12) return '••••';
  return `${key.slice(0, 12)}••••••${key.slice(-4)}`;
}

/** Short prefix to persist alongside the hash (for masked rendering). */
export function prefixOf(key) {
  return (key || '').slice(0, 12);
}

/**
 * Look up a user by a plaintext API key. Returns { id, isAdmin } or null.
 * Used by the auth middleware when the Authorization bearer token is not a
 * valid JWT.
 */
export async function findUserByApiKey(env, key) {
  if (!key || !key.startsWith(KEY_PREFIX)) return null;
  const hash = await hashApiKey(key);
  const row = await env.DB.prepare(
    'SELECT id, is_admin FROM users WHERE api_key_hash = ? LIMIT 1'
  ).bind(hash).first();
  if (!row) return null;
  return { userId: row.id, isAdmin: !!row.is_admin };
}
