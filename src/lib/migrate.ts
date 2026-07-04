import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const migrations = [
  `CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    page TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    country TEXT,
    city TEXT,
    user_agent TEXT,
    referrer TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS queries (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied'))
  )`,

  `CREATE TABLE IF NOT EXISTS rate_limits (
    ip_hash TEXT NOT NULL,
    window_start INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (ip_hash, window_start)
  )`,
];

export async function migrate() {
  for (const sql of migrations) {
    await turso.execute(sql);
  }

  const alterQueries = [
    `ALTER TABLE visitors ADD COLUMN session_id TEXT`,
    `ALTER TABLE visitors ADD COLUMN visit_duration INTEGER`,
    `ALTER TABLE visitors ADD COLUMN scroll_depth INTEGER`,
    `ALTER TABLE visitors ADD COLUMN exit_page BOOLEAN DEFAULT FALSE`,
  ];

  for (const query of alterQueries) {
    try {
      await turso.execute(query);
    } catch {
      // Column already exists, ignore
    }
  }

  console.log('[migrate] All tables ready');
}

if (require.main === module) {
  migrate().catch(console.error);
}
