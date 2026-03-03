import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_cents: "",
    currency: "CAD",
    category: "",
    location: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setError("");

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${id}`, {
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          method: "GET",
          signal: ac.signal,
        });

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        setForm(data.listing);
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();

    return () => ac.abort();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      navigate(`/listings/${id}`);
    } catch (err) {
      setError("Server error");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <input
        value={form.title}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, title: e.target.value }))
        }
        style={{ width: "100%", padding: 10, marginTop: 6 }}
      />
      <input
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value }))
        }
        rows={6}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          resize: "vertical",
        }}
      />
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditListing;
