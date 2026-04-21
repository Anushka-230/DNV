import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  ClipboardCheck,
  FileText,
  CalendarDays,
  Notebook,
  LogOut,
} from "lucide-react";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/classes", label: "Classes", icon: School },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { to: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admin/exams", label: "Exams", icon: FileText },
];

const teacherLinks = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/teacher/students", label: "My Students", icon: Users },
  { to: "/teacher/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/teacher/syllabus", label: "Syllabus", icon: Notebook },
  { to: "/teacher/notes", label: "Notes", icon: FileText },
  { to: "/teacher/exams", label: "Exams", icon: FileText },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/student/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/student/syllabus", label: "Syllabus", icon: Notebook },
  { to: "/student/notes", label: "Notes", icon: FileText },
  { to: "/student/exams", label: "Exams", icon: FileText },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "teacher"
      ? teacherLinks
      : studentLinks;

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <p className="text-white font-bold text-lg">DNV</p>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">
          {user?.role} panel
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <l.icon
              size={18}
              className="shrink-0 opacity-80 group-hover:opacity-100"
            />
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <p className="text-sm text-white font-medium truncate">
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 truncate mb-3">
          {user?.email}
        </p>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full text-sm bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;