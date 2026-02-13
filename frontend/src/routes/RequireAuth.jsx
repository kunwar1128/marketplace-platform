import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ user, children }) {
  const location = useLocation();
  console.log("RequireAuth: user =", user, "location =", location);

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  console.log("Verified skipped");

  return children;
}
