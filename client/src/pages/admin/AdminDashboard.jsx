import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  getAllClasses,
  getAllSections,
  getAllStudents,
  getAllTeachers,
} from "../../api/index.js";
import Loader from "../../components/Loader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

import {
  Users,
  GraduationCap,
  School,
  Layers,
  UserPlus,
} from "lucide-react";

/* ================= STAT CARD ================= */
const StatCard = ({ icon: Icon, label, value, color, bg, iconColor }) => (
  <div
    className={`rounded-2xl border ${color} ${bg} p-6 flex items-center gap-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5`}
  >
    <div className="p-3 rounded-xl bg-white shadow-sm">
      <Icon size={22} className={iconColor} />
    </div>

    <div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

/* ================= DASHBOARD ================= */
const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    teachers: 0,
    classes: 0,
    sections: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, students, teachers, classes, sections] =
          await Promise.all([
            getAllUsers(),
            getAllStudents(),
            getAllTeachers(),
            getAllClasses(),
            getAllSections(),
          ]);

        setStats({
          users: users.data.length,
          students: students.data.length,
          teachers: teachers.data.length,
          classes: classes.data.length,
          sections: sections.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's an overview of your school today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          color="border-gray-100"
          bg="bg-gray-50"
          iconColor="text-gray-700"
        />

        <StatCard
          icon={GraduationCap}
          label="Students"
          value={stats.students}
          color="border-blue-100"
          bg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={Users}
          label="Teachers"
          value={stats.teachers}
          color="border-green-100"
          bg="bg-green-50"
          iconColor="text-green-600"
        />

        <StatCard
          icon={School}
          label="Classes"
          value={stats.classes}
          color="border-purple-100"
          bg="bg-purple-50"
          iconColor="text-purple-600"
        />

        <StatCard
          icon={Layers}
          label="Sections"
          value={stats.sections}
          color="border-amber-100"
          bg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add User", link: "/admin/users", icon: UserPlus },
              { label: "Add Teacher", link: "/admin/teachers", icon: GraduationCap },
              { label: "Add Student", link: "/admin/students", icon: Users },
              { label: "Add Class", link: "/admin/classes", icon: School },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.link}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-700 transition"
              >
                <a.icon size={16} />
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* SYSTEM OVERVIEW */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">
            System Overview
          </h2>

          <ul className="space-y-3">
            {[
              { label: "Total users in system", value: stats.users },
              { label: "Active student profiles", value: stats.students },
              { label: "Active teacher profiles", value: stats.teachers },
              { label: "Classes created", value: stats.classes },
              { label: "Sections across all classes", value: stats.sections },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{item.label}</span>

                <span className="font-bold text-gray-900 bg-gray-50 px-3 py-0.5 rounded-lg">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;