// Shared team helpers for PineTask Cloudflare Pages Functions

/**
 * Get the current user's role in a team.
 * Returns null if not a member.
 */
export async function getTeamRole(DB, teamId, userId) {
  const row = await DB.prepare(
    'SELECT role FROM team_members WHERE team_id = ? AND user_id = ?'
  ).bind(teamId, userId).first();
  return row?.role || null;
}

/**
 * Check whether the user is a member of the team.
 */
export async function isMember(DB, teamId, userId) {
  const role = await getTeamRole(DB, teamId, userId);
  return role !== null;
}

/**
 * Check if user has admin or owner role in team.
 */
export async function isAdmin(DB, teamId, userId) {
  const role = await getTeamRole(DB, teamId, userId);
  return role === 'owner' || role === 'admin';
}

/**
 * Check if user is owner of the team.
 */
export async function isOwner(DB, teamId, userId) {
  const role = await getTeamRole(DB, teamId, userId);
  return role === 'owner';
}

/**
 * Generate a random hex token for invitations.
 */
export function randomToken(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalise two participant IDs to a consistent order (lexicographic)
 * so we don't accidentally create duplicate conversations.
 */
export function orderParticipants(a, b) {
  return a < b ? [a, b] : [b, a];
}
