import { Navigate, useLocation } from "react-router-dom";
import Login from "../pages/Login";

function LoginRoute({ user, setUser }) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace />;
  return <Login onLogin={setUser} />;
}
export default LoginRoute;
