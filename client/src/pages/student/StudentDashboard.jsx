import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getSubjectsBySection, getStudentAttendance, getExamsBySection } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { BookOpen, CalendarDays, CheckSquare, GraduationCap, Hash, Users } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl border ${color} p-5 flex items-center gap-4 shadow-sm`}>
    <div className="p-2.5 bg-gray-50 rounded-xl">
      <Icon size={20} className="text-gray-600" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [subjects, setSubjects]     = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams]           = useState([]);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (!studentProfile) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
        const [subRes, attRes, examRes] = await Promise.all([
          getSubjectsBySection(sectionId),
          getStudentAttendance(studentProfile._id),
          getExamsBySection(sectionId),
        ]);
        setSubjects(subRes.data);
        setAttendance(attRes.data);
        setExams(examRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [studentProfile]);

  if (profileLoading || loading) return <Loader />;

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const totalCount   = attendance.length;
  const attendancePct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const upcomingExams = exams
    .filter((e) => new Date(e.examDate) >= new Date())
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .slice(0, 4);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen}     label="Subjects"         value={subjects.length}   color="border-blue-100"   />
        <StatCard icon={CheckSquare}  label="Attendance %"     value={`${attendancePct}%`} color={attendancePct >= 75 ? "border-green-100" : "border-red-100"} />
        <StatCard icon={CalendarDays} label="Upcoming Exams"   value={upcomingExams.length} color="border-purple-100" />
        <StatCard icon={Hash}         label="Roll Number"      value={studentProfile?.rollNumber || "—"} color="border-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My section info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-gray-500" />
            <p className="font-bold text-gray-900">My Section</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Class",          value: studentProfile?.sectionId?.classId?.name || "—" },
              { label: "Section",        value: `Section ${studentProfile?.sectionId?.name || "—"}` },
              { label: "Academic Year",  value: studentProfile?.sectionId?.academicYear || "—" },
              { label: "Class Teacher",  value: studentProfile?.sectionId?.classTeacherId?.userId?.name || "—" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <BookOpen size={16} className="text-gray-500" />
            <p className="font-bold text-gray-900">My Subjects</p>
          </div>
          <div className="divide-y divide-gray-50">
            {subjects.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No subjects assigned yet</p>
            )}
            {subjects.map((s) => (
              <div key={s._id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.subjectId?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.teacherId?.userId?.name}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-lg">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare size={18} className="text-gray-500" />
            <p className="font-bold text-gray-900">Attendance Summary</p>
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={attendancePct >= 75 ? "#22c55e" : "#ef4444"}
                  strokeWidth="3"
                  strokeDasharray={`${attendancePct} ${100 - attendancePct}`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-gray-900">
                {attendancePct}%
              </span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Present", count: presentCount,              color: "bg-green-500" },
                { label: "Absent",  count: attendance.filter((a) => a.status === "absent").length, color: "bg-red-500" },
                { label: "Late",    count: attendance.filter((a) => a.status === "late").length,   color: "bg-yellow-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.label}: <strong>{item.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
          {attendancePct < 75 && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <p className="text-xs text-red-700 font-medium">
                Your attendance is below 75%. Please attend classes regularly.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming exams */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />
            <p className="font-bold text-gray-900">Upcoming Exams</p>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingExams.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No upcoming exams</p>
            )}
            {upcomingExams.map((e) => {
              const daysLeft = Math.ceil((new Date(e.examDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={e._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{e.classSubjectId?.subjectId?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(e.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {e.venue ? ` · ${e.venue}` : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${daysLeft <= 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;