import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ListingDetail() {
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

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div>
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
