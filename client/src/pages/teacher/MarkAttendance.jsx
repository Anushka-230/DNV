import { useEffect, useState } from "react";
import { getAssignmentsByTeacher, getStudentsBySection, markAttendance } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const MarkAttendance = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [attendance, setAttendance]   = useState({});
  const [selected, setSelected]       = useState({ classSubjectId: "", sectionId: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  useEffect(() => {
    if (!teacherProfile) return;
    getAssignmentsByTeacher(teacherProfile._id)
      .then((r) => setAssignments(r.data))
      .catch(() => setError("Failed to load assignments"));
  }, [teacherProfile]);

  const handleSubjectChange = async (classSubjectId) => {
    const assignment = assignments.find((a) => a._id === classSubjectId);
    const sectionId  = assignment?.sectionId?._id;
    setSelected((s) => ({ ...s, classSubjectId, sectionId }));
    setStudents([]); setAttendance({});
    if (!sectionId) return;
    setLoading(true);
    try {
      const res = await getStudentsBySection(sectionId);
      setStudents(res.data);
      const init = {};
      res.data.forEach((st) => { init[st._id] = "present"; });
      setAttendance(init);
    } catch { setError("Failed to load students"); }
    finally { setLoading(false); }
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((st) => { updated[st._id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected.classSubjectId || !selected.date || students.length === 0) return;
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      const records = students.map((st) => ({ studentId: st._id, status: attendance[st._id] || "present" }));
      await markAttendance({ classSubjectId: selected.classSubjectId, date: selected.date, records });
      setSuccess(`Attendance marked for ${students.length} students`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance. It may have already been marked for this date.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = { present: "bg-green-500", absent: "bg-red-500", late: "bg-yellow-500" };
  const statusBg     = { present: "border-green-200 bg-green-50", absent: "border-red-200 bg-red-50", late: "border-yellow-200 bg-yellow-50" };

  if (profileLoading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Select a subject and date, then mark each student.</p>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject + Section</label>
          <select value={selected.classSubjectId} onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select subject --</option>
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.subjectId?.name} — {a.sectionId?.classId?.name} Sec {a.sectionId?.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={selected.date}
            onChange={(e) => setSelected((s) => ({ ...s, date: e.target.value }))}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {loading && <Loader />}

      {!loading && students.length > 0 && (
        <form onSubmit={handleSubmit}>
          {/* Mark all buttons */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600 font-medium">Mark all as:</span>
            {["present", "absent", "late"].map((s) => (
              <button key={s} type="button" onClick={() => markAll(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize ${
                  s === "present" ? "border-green-200 text-green-700 hover:bg-green-50" :
                  s === "absent"  ? "border-red-200 text-red-700 hover:bg-red-50" :
                  "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                } transition`}>
                {s}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400">{students.length} students</span>
          </div>

          {/* Student list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Roll No.", "Name", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-gray-500">{st.rollNumber}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{st.userId?.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {["present", "absent", "late"].map((s) => (
                          <button key={s} type="button"
                            onClick={() => setAttendance((prev) => ({ ...prev, [st._id]: s }))}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border capitalize transition ${
                              attendance[st._id] === s
                                ? `${statusBg[s]} border-current`
                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 mb-5">
            {["present", "absent", "late"].map((s) => {
              const count = Object.values(attendance).filter((v) => v === s).length;
              return (
                <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusBg[s]}`}>
                  <div className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
                  <span className="text-xs font-semibold capitalize text-gray-700">{s}: {count}</span>
                </div>
              );
            })}
          </div>

          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition">
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </form>
      )}

      {!loading && selected.classSubjectId && students.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No students found in this section.
        </div>
      )}

      {!selected.classSubjectId && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a subject and date to start marking attendance.
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;