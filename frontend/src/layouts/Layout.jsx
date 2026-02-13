import { Link, Outlet } from "react-router-dom";

function Layout({ user, onLogout }) {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/">Browse</Link>
          <Link to="/listings/new">Create Listing</Link>

          {user?.role === "admin" && <Link to="/admin/inbox">Admin Inbox</Link>}

          <div style={{ marginLeft: "auto" }}>
            {user ? (
              <button onClick={onLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default Layout;
