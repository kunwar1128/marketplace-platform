import { useEffect, useState } from "react";
import { apiFetch } from "./api/apiFetch";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    const fetchUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me", { signal: ac.signal });
        const data = await res.json();
        console.log(data.user);

        setUser(res.ok ? data.user : null);
      } catch (err) {
        if (err.name !== "AbortError") setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    return () => ac.abort();
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        credentials: "include",
        method: "POST",
      });
      console.log("Logout clicked");
    } finally {
      setUser(null);
    }
  }

  if (loading) return <p>Loading...</p>;

  return <AppRoutes user={user} setUser={setUser} onLogout={logout} />;
}

export default App;
