import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// usage: <Route element={<RoleRoute role="admin" />}>
const RoleRoute = ({ role }) => {
  const { user } = useAuth();

  return user?.role === role
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;