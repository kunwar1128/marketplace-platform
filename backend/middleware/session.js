import session from "express-session";
import connectPgSimple from "connect-pg-simple";

// Session
const PgSession = connectPgSimple(session);

export function sessionMiddleware(pool) {
  return session({
    store: new PgSession({
      pool, // uses your pg Pool
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  });
}
