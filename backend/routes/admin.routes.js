import { Router } from "express";
import pool from "../db/database.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/admin/messages
router.get("/messages", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC`,
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/admin/messages/:id/read
router.patch("/messages/:id/read", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { is_read } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (typeof is_read !== "boolean") {
    return res.status(400).json({ error: "is_read must be boolean" });
  }

  try {
    const result = await pool.query(
      `UPDATE contact_messages SET is_read = $1 WHERE id = $2 RETURNING id, is_read;`,
      [is_read, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ ok: true, message: result.rows[0] });
  } catch (err) {
    console.error("Failed to update read status:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/admin/messages/:id
router.delete("/messages/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM contact_messages WHERE id = $1 RETURNING id;`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ ok: true, deletedId: result.rows[0].id });
  } catch (err) {
    console.error("Failed to delete message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
