import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const links = [
    { to: "/",        label: "Home" },
    { to: "/about",   label: "About" },
    { to: "/gallery", label: "Gallery" },
  ];

  const dashboardPath =
    user?.role === "admin"   ? "/admin/dashboard"   :
    user?.role === "teacher" ? "/teacher/dashboard" :
    user?.role === "student" ? "/student/dashboard" : "/login";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-blue-700 tracking-tight">
           DNV
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {user ? (
          <Link
            to={dashboardPath}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;