import { useEffect, useState } from "react";
import { getAssignmentsByTeacher, getTeacherSections, getExamsBySection, scheduleExam, deleteExam } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const TeacherExams = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [sections, setSections]       = useState([]);
  const [exams, setExams]             = useState([]);
  const [selected, setSelected]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [form, setForm]               = useState({ classSubjectId: "", examDate: "", venue: "" });

  useEffect(() => {
    if (!teacherProfile) return;
    const fetchAll = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          getAssignmentsByTeacher(teacherProfile._id),
          getTeacherSections(teacherProfile._id),
        ]);
        setAssignments(aRes.data);
        const allSections = [
          ...(sRes.data.classTeacherOf || []),
          ...(sRes.data.subjectTeacherOf || []).map((s) => s.sectionId),
        ];
        const unique = Array.from(new Map(allSections.map((s) => [s._id, s])).values());
        setSections(unique);
      } catch { setError("Failed to load data"); }
    };
    fetchAll();
  }, [teacherProfile]);

  const handleSectionChange = async (sectionId) => {
    setSelected(sectionId); setExams([]);
    if (!sectionId) return;
    setLoading(true);
    try {
      const res = await getExamsBySection(sectionId);
      setExams(res.data);
    } catch { setExams([]); }
    finally { setLoading(false); }
  };

  const mySubjectsInSection = assignments.filter(
    (a) => a.sectionId?._id === selected
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await scheduleExam(form);
      setSuccess("Exam scheduled successfully");
      setForm({ classSubjectId: "", examDate: "", venue: "" });
      setShowForm(false);
      handleSectionChange(selected);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule exam");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      setSuccess("Exam deleted");
      handleSectionChange(selected);
    } catch { setError("Failed to delete"); }
  };

  if (profileLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and manage exams for your sections.</p>
        </div>
        {selected && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            {showForm ? "Cancel" : "+ Schedule Exam"}
          </button>
        )}
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Section</label>
        <select value={selected} onChange={(e) => handleSectionChange(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Select section --</option>
          {sections.map((s) => (
            <option key={s._id} value={s._id}>
              {s.classId?.name} — Section {s.name} ({s.academicYear})
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Schedule Exam</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select value={form.classSubjectId} onChange={(e) => setForm({ ...form, classSubjectId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select --</option>
                {mySubjectsInSection.map((a) => (
                  <option key={a._id} value={a._id}>{a.subjectId?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
              <input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input type="text" placeholder="Room 101" value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Scheduling..." : "Schedule Exam"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <Loader />}

      {!loading && exams.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Subject", "Exam Date", "Venue", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exams.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{e.classSubjectId?.subjectId?.name || "—"}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {new Date(e.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{e.venue || "—"}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(e._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selected && exams.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No exams scheduled yet for this section.
        </div>
      )}

      {!selected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a section to view and manage exams.
        </div>
      )}
    </div>
  );
};

export default TeacherExams;