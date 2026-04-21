import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard",  icon: "📊" },
  { to: "/admin/users",     label: "Users",       icon: "👥" },
  { to: "/admin/teachers",  label: "Teachers",    icon: "👨‍🏫" },
  { to: "/admin/students",  label: "Students",    icon: "🎒" },
  { to: "/admin/classes",   label: "Classes",     icon: "🏫" },
  { to: "/admin/subjects",  label: "Subjects",    icon: "📚" },
  { to: "/admin/attendance",label: "Attendance",  icon: "✅" },
  { to: "/admin/exams",     label: "Exams",       icon: "📝" },
];

const teacherLinks = [
  { to: "/teacher/dashboard",  label: "Dashboard",  icon: "📊" },
  { to: "/teacher/attendance", label: "Attendance", icon: "✅" },
  { to: "/teacher/students",   label: "My Students",icon: "🎒" },
  { to: "/teacher/timetable",  label: "Timetable",  icon: "🗓️" },
  { to: "/teacher/syllabus",   label: "Syllabus",   icon: "📋" },
  { to: "/teacher/notes",      label: "Notes",      icon: "📄" },
  { to: "/teacher/exams",      label: "Exams",      icon: "📝" },
];

const studentLinks = [
  { to: "/student/dashboard",  label: "Dashboard",  icon: "📊" },
  { to: "/student/attendance", label: "Attendance", icon: "✅" },
  { to: "/student/timetable",  label: "Timetable",  icon: "🗓️" },
  { to: "/student/syllabus",   label: "Syllabus",   icon: "📋" },
  { to: "/student/notes",      label: "Notes",      icon: "📄" },
  { to: "/student/exams",      label: "Exams",      icon: "📝" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links =
    user?.role === "admin"   ? adminLinks   :
    user?.role === "teacher" ? teacherLinks :
    studentLinks;

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-gray-300 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <p className="text-white font-bold text-lg">🏫 SchoolMS</p>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{user?.role} panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <p className="text-sm text-white font-medium truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full text-sm bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;