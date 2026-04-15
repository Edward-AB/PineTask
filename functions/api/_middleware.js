import { verifyToken } from './_helpers/jwt.js';
import { findUserByApiKey } from './_helpers/apikey.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '86400',
};

const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/reset-password',
  '/api/auth/reset-confirm',
  '/api/auth/verify-email',
];

// Prefix-based public routes (e.g. invite lookup and decline)
const PUBLIC_PREFIXES = [
  '/api/invite/',
];

function addCorsHeaders(response) {
  const res = new Response(response.body, response);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export async function onRequest(context) {
  const { request, env, next } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Public routes skip auth — both exact matches and prefix matches
  // Accept endpoints still require auth, so exclude /accept suffix from the prefix check.
  const isPublicExact = PUBLIC_ROUTES.includes(path);
  const isPublicPrefix = PUBLIC_PREFIXES.some((p) => path.startsWith(p)) && !path.endsWith('/accept');
  const isPublic = isPublicExact || isPublicPrefix;
  if (!isPublic) {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) {
      return addCorsHeaders(Response.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    // Try JWT first. If it doesn't look like a JWT or fails, try API key.
    let authed = false;
    try {
      const payload = await verifyToken(token, env.JWT_SECRET);
      if (payload) {
        context.data.userId = payload.userId;
        context.data.isAdmin = !!payload.isAdmin;
        context.data.authMethod = 'jwt';
        authed = true;
      }
    } catch {
      // fall through to api-key attempt
    }
    if (!authed && token.startsWith('ptk_')) {
      try {
        const byKey = await findUserByApiKey(env, token);
        if (byKey) {
          context.data.userId = byKey.userId;
          context.data.isAdmin = byKey.isAdmin;
          context.data.authMethod = 'api_key';
          authed = true;
        }
      } catch {
        // treat as invalid
      }
    }
    if (!authed) {
      return addCorsHeaders(Response.json({ error: 'Invalid or expired token' }, { status: 401 }));
    }

    // Admin route protection
    if (path.startsWith('/api/admin/') && !context.data.isAdmin) {
      return addCorsHeaders(Response.json({ error: 'Forbidden' }, { status: 403 }));
    }
  }

  const response = await next();
  return addCorsHeaders(response);
}
