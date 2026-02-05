import { Router } from "express";
import pool from "../db/database.js";

const router = Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email, and message are required" });
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *;`,
      [name.trim(), email.trim(), message.trim()],
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Insert contact message failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
