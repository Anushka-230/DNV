import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getAssignmentsByTeacher,
  getTeacherSections,
} from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

import {
  BookOpen,
  School,
  Users,
} from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();

  const [assignments, setAssignments] = useState([]);
  const [sections, setSections] = useState({
    classTeacherOf: [],
    subjectTeacherOf: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teacherProfile) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [aRes, sRes] = await Promise.all([
          getAssignmentsByTeacher(teacherProfile._id),
          getTeacherSections(teacherProfile._id),
        ]);
        setAssignments(aRes.data);
        setSections(sRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [teacherProfile]);

  if (profileLoading || loading) return <Loader />;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Subjects Teaching",
            value: assignments.length,
            color: "border-blue-100 bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            icon: School,
            label: "Class Teacher Of",
            value: sections.classTeacherOf?.length || 0,
            color: "border-purple-100 bg-purple-50",
            iconColor: "text-purple-600",
          },
          {
            icon: Users,
            label: "Total Assignments",
            value: sections.subjectTeacherOf?.length || 0,
            color: "border-green-100 bg-green-50",
            iconColor: "text-green-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.color} p-5 flex items-center gap-4 shadow-sm`}
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <s.icon size={20} className={s.iconColor} />
            </div>

            <div>
              <p className="text-2xl font-extrabold text-gray-900">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My Subjects */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-gray-900">My Subjects</p>
          </div>

          <div className="divide-y divide-gray-50">
            {assignments.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">
                No subject assignments yet
              </p>
            )}

            {assignments.map((a) => (
              <div
                key={a._id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {a.subjectId?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.sectionId?.classId?.name} — Section {a.sectionId?.name} · {a.sectionId?.academicYear}
                  </p>
                </div>

                <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-lg">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Class Teacher Of */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-gray-900">Class Teacher Of</p>
          </div>

          <div className="divide-y divide-gray-50">
            {(!sections.classTeacherOf ||
              sections.classTeacherOf.length === 0) && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">
                Not assigned as class teacher
              </p>
            )}

            {(sections.classTeacherOf || []).map((s) => (
              <div key={s._id} className="px-5 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  {s.classId?.name} — Section {s.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.academicYear} · Capacity {s.capacity}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Profile */}
      {teacherProfile && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="font-bold text-gray-900 mb-4">My Profile</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Employee ID", value: teacherProfile.employeeId },
              { label: "Qualification", value: teacherProfile.qualification || "—" },
              {
                label: "Joining Date",
                value: teacherProfile.joiningDate
                  ? new Date(teacherProfile.joiningDate).toLocaleDateString("en-IN")
                  : "—",
              },
              {
                label: "Salary",
                value: teacherProfile.salary
                  ? `₹${teacherProfile.salary.toLocaleString("en-IN")}`
                  : "—",
              },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;