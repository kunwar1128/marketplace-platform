import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../api/apiFetch";

function formatMoney(priceCents, currency = "CAD") {
  const amount = (priceCents ?? 0) / 100;
  // Language sensitive number formating
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ListingsBrowse() {
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(0);
  const limit = 20;
  console.log("Page number:", page);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //   Use the computation below only if page or limit changes
  const offset = useMemo(() => limit * page, [page, limit]);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const qs = new URLSearchParams({
          status,
          limit: String(limit),
          offset: String(offset),
        });

        // Using the fetch for testing purposes, might change later
        const res = await fetch(`/api/listings?${qs.toString()}`, {
          credentials: "include",
          signal: ac.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load listings");
          setListings([]);
          return;
        }

        setListings(data.listings || []);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }

    load();

    // React calls the function below
    return () => ac.abort();
  }, [status, limit, offset]);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1>Browse Listings</h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        {/* Status */}
        <label>
          Status{" "}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="active">active</option>
            <option value="sold">sold</option>
            <option value="archived">archived</option>
          </select>
        </label>

        {/* Pagination */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || listings.length < limit}
            title={listings.length < limit ? "No more results" : ""}
          >
            Next
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && listings.length === 0 && <p>No listings found.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {listings.map((l) => (
          <li
            key={l.id}
            style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 6px 0" }}>{l.title}</h3>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {l.category} * {l.location}
                </div>
              </div>

              <div style={{ fontWeight: 700 }}>
                {formatMoney(l.price_cents, l.currency)}
              </div>
            </div>

            <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.9 }}>
              {l.description}
            </p>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              Status: {l.status} * Posted:{" "}
              {new Date(l.created_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
