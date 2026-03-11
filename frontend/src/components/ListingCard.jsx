import { Link } from "react-router-dom";
import { formatMoney } from "../utils/formatMoney";
import FavouriteButton from "../components/FavouriteButton";

function ListingCard({ listing, handleUnFavourite, handleFavouriteChange }) {
  return (
    <li style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <Link to={`/listings/${listing.id}`}>
            <h3 style={{ margin: "0 0 6px 0" }}>{listing.title}</h3>
          </Link>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            {listing.category} --- {listing.location}
          </div>
        </div>

        <div style={{ fontWeight: 700 }}>
          {formatMoney(listing.price_cents, listing.currency)}
        </div>
      </div>

      <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.9 }}>
        {listing.description}
      </p>

      <FavouriteButton
        listingId={listing.id}
        initialFavourited={listing.favourited}
        handleUnFavourite={handleUnFavourite}
        handleFavouriteChange={handleFavouriteChange}
      />

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
        Status: {listing.status} * Posted:{" "}
        {new Date(listing.created_at).toLocaleDateString()}
      </div>
    </li>
  );
}

export default ListingCard;
