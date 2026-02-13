import { Routes, Route, Navigate } from "react-router-dom";

import ListingsBrowse from "../pages/ListingsBrowse";
import AdminInbox from "../components/AdminInbox";
import CreateListing from "../pages/CreateListing";
import Layout from "../layouts/Layout";
import RequireAuth from "./RequireAuth";
import RequireAdmin from "./RequireAdmin";
import LoginRoute from "./LoginRoute";

function AppRoutes({ user, setUser, onLogout }) {
  return (
    <Routes>
      {/* This is the Layout Route */}
      <Route element={<Layout user={user} onLogout={onLogout} />}>
        <Route path="/" element={<ListingsBrowse />} />

        <Route
          path="/login"
          element={<LoginRoute user={user} setUser={setUser} />}
        />

        <Route
          path="/admin/inbox"
          element={
            <RequireAdmin user={user}>
              <AdminInbox user={user} />
            </RequireAdmin>
          }
        />

        <Route
          path="/listings/new"
          element={
            <RequireAuth user={user}>
              <CreateListing />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
