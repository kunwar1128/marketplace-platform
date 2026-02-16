import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clientValidate } from "../utils/validateListings";

export default function CreateListing() {
  const nav = useNavigate();

  const [listing, setListing] = useState({
    title: "",
    description: "",
    priceDollars: "",
    currency: "CAD",
    category: "",
    location: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const priceCents = useMemo(() => {
    const n = Number(listing.priceDollars);
    if (!Number.isFinite(n)) return null;

    return Math.round(n * 100);
  }, [listing.priceDollars]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setError("");

    if (priceCents === null) {
      setError("Invalid price");
      return;
    }

    const apiListing = {
      title: listing.title.trim(),
      description: listing.description.trim(),
      currency: listing.currency.toUpperCase(),
      price_cents: priceCents,
      category: listing.category.trim(),
      location: listing.location.trim(),
    };

    const v = clientValidate(apiListing);
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(apiListing),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to create Listing");
        return;
      }

      nav("/", { replace: true, state: { created: true } });
    } catch (e) {
      console.log("Error posting the listing", e);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1>Create Listing</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input
            required
            value={listing.title}
            onChange={(e) =>
              setListing((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., iPhone 13"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Description
          <textarea
            required
            value={listing.description}
            onChange={(e) =>
              setListing((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Condition, included items, pickup details..."
            rows={6}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}
        >
          <label>
            Price (in dollars)
            <input
              required
              type="number"
              value={listing.priceDollars}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  priceDollars: e.target.value,
                }))
              }
              placeholder="e.g., 450"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>

          <label>
            Currency
            <select
              required
              value={listing.currency}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <label>
            Category
            <input
              required
              value={listing.category}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="e.g., Electronics"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>

          <label>
            Location
            <input
              required
              value={listing.location}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="e.g., Toronto"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Create Listing"}
          </button>

          <button type="button" onClick={() => nav(-1)} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
