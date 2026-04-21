import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin"   ? "/admin/dashboard"   :
    user?.role === "teacher" ? "/teacher/dashboard" :
    user?.role === "student" ? "/student/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate(dashboardPath)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
        >
          Go to my dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;