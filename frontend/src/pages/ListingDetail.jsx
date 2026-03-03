import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ListingDetail({ user }) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function fetchListing() {
      setError("");
      try {
        const result = await fetch(`/api/listings/${id}`, {
          signal: ac.signal,
          method: "GET",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });

        if (!result.ok) throw new Error("Not found");

        const rows = await result.json();

        console.log(user);

        setListing(rows.listing);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError("Listing not found");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();

    return () => ac.abort();
  }, [id]);

  async function handleToggleStatus() {
    try {
      const newStatus = listing.status === "active" ? "sold" : "active";

      const res = await fetch(`/api/listings/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      setListing((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      setError("Server error");
    }
  }

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div>
      {user && user.id === listing.user_id && (
        <div>
          <Link to={`/listings/${listing.id}/edit`}>Edit</Link>
          <button onClick={handleToggleStatus}>
            Mark as {listing.status === "active" ? "Sold" : "Active"}
          </button>
        </div>
      )}
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>
        {(listing.price_cents / 100).toFixed(2)} {listing.currency}
      </p>
      <p>Category: {listing.category}</p>
      <p>Location: {listing.location}</p>
      <p>Status: {listing.status}</p>
      <p>Posted: {listing.created_at}</p>
    </div>
  );
}

export default ListingDetail;
