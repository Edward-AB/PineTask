-- =================================================================
-- PineTask — API Keys (personal, single-user)
-- =================================================================
-- One key per user. We store a SHA-256 hash (never the plaintext)
-- plus a short prefix for masked display and a creation timestamp
-- so the UI can show when the key was last rotated.

ALTER TABLE users ADD COLUMN api_key_hash TEXT;
ALTER TABLE users ADD COLUMN api_key_prefix TEXT;
ALTER TABLE users ADD COLUMN api_key_created_at INTEGER;

-- Lookup index for middleware auth by hash
CREATE INDEX IF NOT EXISTS idx_users_api_key_hash ON users(api_key_hash);
