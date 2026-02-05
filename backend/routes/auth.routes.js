import { Router } from "express";
import pool from "../db/database.js";
import bcrypt from "bcrypt";

const router = Router();

// REGISTERING USER

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "password must be at least 8 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') RETURNING id, email, role;`,
      [email.toLowerCase().trim(), passwordHash],
    );

    // auto-login after register
    req.session.userId = result.rows[0].id;
    req.session.role = result.rows[0].role;

    return res.status(201).json({ ok: true, user: result.rows[0] });
  } catch (err) {
    // unique constraint conflict
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error("Register failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGIN USER

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash, role FROM users WHERE email = $1;`,
      [email.toLowerCase().trim()],
    );

    //do NOT reveal whether user exists (security best practices)
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    return res.status(200).json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGOUT USER

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout failed:", err);
      return res.status(500).json({ error: "Server error" });
    }

    res.clearCookie("connect.sid"); // default cookie name
    return res.json({ ok: true });
  });
});

// Who Am I

router.get("/me", (req, res) => {
  if (!req.session?.userId) return res.json({ user: null });

  res.json({
    user: {
      id: req.session.userId,
      role: req.session.role,
    },
  });
});

export default router;
