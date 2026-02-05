// CREATE TABLE IF NOT EXISTS contact_messages (
//   id BIGSERIAL PRIMARY KEY,
//   name TEXT NOT NULL,
//   email TEXT NOT NULL,
//   message TEXT NOT NULL,
//   is_read BOOLEAN NOT NULL DEFAULT FALSE,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE TABLE IF NOT EXISTS users (
//   id BIGSERIAL PRIMARY KEY,
//   email TEXT NOT NULL UNIQUE,
//   password_hash TEXT NOT NULL,
//   role TEXT NOT NULL DEFAULT 'admin',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE TABLE IF NOT EXISTS "session" (
//   "sid" varchar NOT NULL COLLATE "default",
//   "sess" json NOT NULL,
//   "expire" timestamp(6) NOT NULL
// )
// WITH (OIDS=FALSE);

// ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
// CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

// SESSION_SECRET=some-long-random-string
// NODE_ENV=development
