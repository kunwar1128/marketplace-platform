import { useState } from "react";

function FavouriteButton({
  listingId,
  initialFavourited,
  handleUnFavourite,
  handleFavouriteChange,
}) {
  const [favourited, setFavourited] = useState(initialFavourited);

  async function toggleFavourite() {
    try {
      const method = favourited ? "DELETE" : "POST";

      const res = await fetch(`/api/favourites/${listingId}`, {
        method,
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      if (favourited) handleUnFavourite?.(listingId);

      handleFavouriteChange?.(listingId, !favourited);

      setFavourited((prev) => !prev);
    } catch (err) {
      console.log("Error:", err);
    }
  }
  return (
    <button onClick={toggleFavourite}>
      {favourited ? "Unfavourite" : "Favourite"}
    </button>
  );
}

export default FavouriteButton;
