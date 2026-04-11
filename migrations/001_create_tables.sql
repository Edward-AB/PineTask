-- =================================================================
-- PineTask v2 Schema
-- =================================================================

-- Extend existing users table
ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'Europe/London';
ALTER TABLE users ADD COLUMN updated_at INTEGER;
ALTER TABLE users ADD COLUMN last_login_at INTEGER;
ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0;

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color_idx INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  budget REAL,
  archived INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Deadlines
CREATE TABLE IF NOT EXISTS deadlines (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  color_idx INTEGER DEFAULT 0,
  archived INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  deadline_id TEXT REFERENCES deadlines(id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  date TEXT NOT NULL,
  text TEXT NOT NULL,
  priority TEXT CHECK(priority IN ('high','medium','low') OR priority IS NULL),
  duration INTEGER DEFAULT 2,
  slot INTEGER,
  done INTEGER DEFAULT 0,
  done_at INTEGER,
  color_id TEXT DEFAULT 'white',
  note TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  start_slot INTEGER,
  end_slot INTEGER,
  color TEXT DEFAULT '#6366f1',
  all_day INTEGER DEFAULT 0,
  recurring TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Blocked time
CREATE TABLE IF NOT EXISTS blocked_times (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Blocked',
  start_slot INTEGER NOT NULL,
  end_slot INTEGER NOT NULL,
  days TEXT DEFAULT '0,1,2,3,4,5,6',
  color TEXT DEFAULT '#374151',
  created_at INTEGER NOT NULL
);

-- Day notes
CREATE TABLE IF NOT EXISTS day_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  UNIQUE(user_id, date)
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER DEFAULT 0
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER DEFAULT 0
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata TEXT DEFAULT '{}',
  created_at INTEGER NOT NULL
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  work_hours_start INTEGER DEFAULT 32,
  work_hours_end INTEGER DEFAULT 68,
  default_task_duration INTEGER DEFAULT 2,
  week_starts_on INTEGER DEFAULT 1,
  date_format TEXT DEFAULT 'en-GB',
  enable_sounds INTEGER DEFAULT 1,
  enable_celebrations INTEGER DEFAULT 1,
  updated_at INTEGER
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_user ON deadlines(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_project ON deadlines(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_date ON events(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id, created_at);

-- TODO: project_members table for future collaboration features
-- CREATE TABLE IF NOT EXISTS project_members (
--   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
--   user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
--   role TEXT DEFAULT 'viewer',
--   PRIMARY KEY(project_id, user_id)
-- );
