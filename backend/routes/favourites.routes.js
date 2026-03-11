import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import pool from "../db/database.js";

const router = Router();

// -------- Favorites ----------

// GET All favourites for logged in user

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.title, l.price_cents, l.currency, l.location, l.status, l.created_at, TRUE AS favourited FROM listings l JOIN favourites f ON l.id = f.listing_id WHERE f.user_id = $1 ORDER BY f.created_at DESC;`,
      [userId],
    );

    return res.status(200).json({ listings: rows });
  } catch (err) {
    console.error("Error getting all favourites:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST adding a new favourtie listing

router.post("/:listingId", requireAuth, async (req, res) => {
  const listingId = Number(req.params.listingId);
  const userId = req.session.userId;

  if (!Number.isInteger(listingId))
    return res.status(404).json({ error: "Invalid ID format" });

  try {
    await pool.query(
      `INSERT INTO favourites (user_id, listing_id) VALUES ($1, $2);`,
      [userId, listingId],
    );

    return res.status(200).json({ message: "Favourited" });
  } catch (err) {
    console.error("Error adding into favourites:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE removing from favourites

router.delete("/:listingId", requireAuth, async (req, res) => {
  const listingId = Number(req.params.listingId);
  const userId = req.session.userId;

  if (!Number.isInteger(listingId))
    return res.status(404).json({ error: "Invalid ID format" });

  try {
    await pool.query(
      `DELETE FROM favourites WHERE user_id = $1 AND listing_id = $2`,
      [userId, listingId],
    );

    return res.status(200).json({ message: "Unfavourited" });
  } catch (err) {
    console.error("Error removing from favourites:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET check if listing is favourited

router.get("/:listingId", requireAuth, async (req, res) => {
  const listingId = Number(req.params.listingId);
  const userId = req.session.userId;

  if (!Number.isInteger(listingId))
    return res.status(404).json({ error: "Invalid ID format" });

  try {
    const { rows } = await pool.query(
      `SELECT 1 FROM favourites WHERE user_id = $1 AND listing_id = $2`,
      [userId, listingId],
    );

    return res.status(202).json({ isFavourited: rows.length > 0 });
  } catch (err) {
    console.error("Error checking favourites:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
