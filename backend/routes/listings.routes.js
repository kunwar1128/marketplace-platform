import { Router } from "express";
import pool from "../db/database.js";
import { requireAuth } from "../middleware/auth.js";
import {
  validateLength,
  validatePositiveInteger,
  validateNonNegativeInteger,
  validateListing,
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

// GET for fetching the ad with the id

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id))
    return res
      .status(400)
      .json({ error: "Invalid ID format. ID must be a number." });
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, title, description, price_cents, currency, category, location, status, created_at FROM listings WHERE id = $1`,
      [id],
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Listing not found" });

    res.status(200).json({ listing: rows[0] });
  } catch (err) {
    console.log("Error getting the listing:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT for the owner of the listings to edit

router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id))
    return res.status(400).json({ error: "Invalid ID format." });

  try {
    // Check ownership
    const { rows } = await pool.query(
      `SELECT user_id FROM listings WHERE id = $1`,
      [id],
    );
    console.log(rows);

    if (rows.length === 0)
      return res.status(404).json({ error: "Listings not found" });

    console.log(
      "User requesting:",
      rows[0].user_id,
      "Logged in user:",
      req.session.userId,
    );
    if (rows[0].user_id !== req.session.userId)
      return res.status(403).json({ error: "Forbidden" });

    const {
      title,
      description,
      price_cents,
      currency,
      category,
      location,
      status,
    } = req.body;

    const { error } = validateListing(req.body);
    if (error) return res.status(400).json({ error });

    const updated = await pool.query(
      `UPDATE listings SET title=$1, description=$2, price_cents=$3, currency=$4, category=$5, location=$6, status=$7 WHERE id=$8 RETURNING *;`,
      [
        title,
        description,
        price_cents,
        currency,
        category,
        location,
        status,
        id,
      ],
    );

    res.status(200).json({ listing: updated.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH to edit the status of the listing given by the id

router.patch("/:id/status", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id))
    return res.status(400).json({ error: "Invalid ID format." });

  const { status } = req.body;

  if (!["active", "sold"].includes(status))
    return res.status(400).json({ error: "Invalid status value." });

  try {
    // Checking the ownership
    const { rows } = await pool.query(
      `SELECT user_id FROM listings WHERE id = $1`,
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Listing not found" });

    if (rows[0].user_id !== req.session.userId)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await pool.query(
      `UPDATE listings SET status = $1 WHERE id = $2 RETURNING status;`,
      [status, id],
    );

    return res.status(200).json({ status: updated.rows[0].status });
  } catch (err) {
    console.error("Error patching status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
