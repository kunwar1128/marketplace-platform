import { Router } from "express";
import pool from "../db/database.js";
import { requireAuth } from "../middleware/auth.js";
import {
  validateLength,
  validatePositiveInteger,
  validateNonNegativeInteger,
} from "../utils/validation.js";

const router = Router();

/* POST /api/listings -- Create a listing (requires login) */

router.post("/", requireAuth, async (req, res) => {
  const {
    title,
    description,
    price_cents,
    currency = "CAD",
    category,
    location,
  } = req.body;

  //   API validation

  if (
    !title ||
    !description ||
    price_cents === undefined ||
    !category ||
    !location
  ) {
    return res.status(400).json({
      error:
        "title, description, price_cents, category, and location are required",
    });
  }

  const cleaned = {
    title: String(title).trim(),
    description: String(description).trim(),
    category: String(category).trim(),
    location: String(location).trim(),
    currency: String(currency).trim(),
    price_cents: Number(price_cents),
  };

  //   Validating the length and non-negative numbers
  const error =
    validateLength("title", cleaned.title, 3, 120) ||
    validateLength("description", cleaned.description, 10, 5000) ||
    validateLength("category", cleaned.category, 2, 40) ||
    validateLength("location", cleaned.location, 2, 80) ||
    validateNonNegativeInteger("price_cents", cleaned.price_cents);

  if (error) {
    return res.status(400).json({ error: error });
  }

  if (cleaned.currency.length !== 3)
    return res
      .status(400)
      .json({ error: "currency must be a 3-letter code (e.g., CAD)" });

  try {
    const result = await pool.query(
      `INSERT INTO listings (user_id, title, description, price_cents, currency, category, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, title, description, price_cents, currency, category, location, status, created_at;`,
      [
        req.session.userId,
        cleaned.title,
        cleaned.description,
        cleaned.price_cents,
        cleaned.currency,
        cleaned.category,
        cleaned.location,
      ],
    );

    return res.status(201).json({ ok: true, listing: result.rows[0] });
  } catch (err) {
    console.error("Create listing failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* GET /api/listings -- This is to browse the listings
    -- public, no login required
    -- Supports: ?status=active&limit=20&offset=0
  */

router.get("/", async (req, res) => {
  const status = req.query.status ? String(req.query.status).trim() : "active";
  const limit = Math.min(Number(req.query.limit ?? 20), 50);
  const offset = Number(req.query.offset ?? 0);

  if (!["active", "sold", "archived"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  //   Validating the non-negative and positive numbers for limit and offset
  const error =
    validatePositiveInteger("limit", limit) ||
    validateNonNegativeInteger("offset", offset);
  if (error) return res.status(400).json({ error: error });

  try {
    const result = await pool.query(
      `SELECT id, user_id, title, description, price_cents, currency, category, location, status, created_at 
      FROM listings 
      WHERE status = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3;`,
      [status, limit, offset],
    );

    return res.json({
      listings: result.rows,
      paging: { status, limit, offset },
    });
  } catch (err) {
    console.error("Fetch listings failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
