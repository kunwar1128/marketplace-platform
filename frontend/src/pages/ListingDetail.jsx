import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import FavouriteButton from "../components/FavouriteButton";

function ListingDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function loadData() {
      setError("");
      try {
        const listingRes = await fetch(`/api/listings/${id}`, {
          signal: ac.signal,
          credentials: "include",
        });

        if (!listingRes.ok) throw new Error("Not found");

        const listingData = await listingRes.json();

        setListing(listingData.listing);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError("Listing not found");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    loadData();

    return () => ac.abort();
  }, [id]);

  // Status toggle function

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

  // Delete listing function

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete the listing?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/listings/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Delete failed");
        return;
      }

      navigate("/listings");
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
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete Listing
          </button>
        </div>
      )}

      {user && (
        <FavouriteButton
          listingId={listing.id}
          initialFavourited={listing.favourited}
        />
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
