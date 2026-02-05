import { apiFetch } from "./api";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminInbox from "./components/AdminInbox";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        const data = await res.json();
        console.log(data.user);
        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("FINALLY");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <AdminInbox user={user} />;
}

export default App;
