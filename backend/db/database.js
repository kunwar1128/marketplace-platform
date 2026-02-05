import "dotenv/config";
import { Pool } from "pg";

// THIS IS A FALLBACK IF THERE ARE PROBLEMS WITH THE DATABASE
// import { pkg } from "pg";
// const { pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 10, //max connections
  idleTimeoutMillis: 30000, // How long idle connection stay open
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

export async function connectDb() {
  try {
    // this does NOT keep the connection,
    // it just verifies the pool can connect
    await pool.query("SELECT 1");
    console.log(`Database, ${pool.options.database}: CONNECTED`);
  } catch (err) {
    console.error("Database connection FAILED: " + err);
    throw err;
  }
}

export default pool;
