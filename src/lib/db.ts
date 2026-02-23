import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(connectionString);

let schemaInitialized: Promise<void> | null = null;

async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id                  TEXT PRIMARY KEY,
      user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title               TEXT NOT NULL,
      description         TEXT NOT NULL,
      required_skills     TEXT[] NOT NULL,
      experience_required INT DEFAULT 0,
      status              TEXT DEFAULT 'active',
      created_at          TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS candidates (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id      TEXT REFERENCES jobs(id) ON DELETE SET NULL,
      name        TEXT NOT NULL,
      email       TEXT,
      phone       TEXT,
      resume_text TEXT,
      skills      TEXT[],
      match_score REAL,
      status      TEXT DEFAULT 'pending',
      created_at  TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_logs (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      candidate_id TEXT REFERENCES candidates(id) ON DELETE SET NULL,
      job_id       TEXT REFERENCES jobs(id) ON DELETE SET NULL,
      subject      TEXT NOT NULL,
      body         TEXT NOT NULL,
      to_email     TEXT NOT NULL,
      status       TEXT DEFAULT 'sent',
      sent_at      TIMESTAMPTZ DEFAULT now()
    )
  `;
}

export async function ensureDb() {
  if (!schemaInitialized) {
    schemaInitialized = initSchema();
  }
  return schemaInitialized;
}

