import { useState, useEffect } from "react";

import ListingCard from "../components/ListingCard";

function MyFavourites() {
  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function fetchFavourites() {
      try {
        const res = await fetch("/api/favourites", {
          credentials: "include",
          signal: ac.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load favourites");
          return;
        }

        setListings(data.listings);
      } catch (err) {
        if (err.name !== "AbortError") setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchFavourites();
    return () => ac.abort();
  }, []);

  // Remove listing for the favourite list if unfavourited

  function handleUnFavourite(id) {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Favourites</h2>

      {listings.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              handleUnFavourite={handleUnFavourite}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyFavourites;
