import { useEffect, useState } from "react";
import { getAllClasses, getSectionsByClass, getSubjectsBySection, getExamsBySection, scheduleExam, deleteExam } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";

const ManageExams = () => {
  const [classes, setClasses]     = useState([]);
  const [sections, setSections]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [exams, setExams]         = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass]     = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [form, setForm] = useState({ classSubjectId: "", examDate: "", venue: "" });

  useEffect(() => {
    getAllClasses().then((r) => setClasses(r.data)).finally(() => setInitLoading(false));
  }, []);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId); setSelectedSection(""); setExams([]); setSubjects([]);
    if (!classId) { setSections([]); return; }
    try { const r = await getSectionsByClass(classId); setSections(r.data); } catch { setSections([]); }
  };

  const handleSectionChange = async (sectionId) => {
    setSelectedSection(sectionId); setExams([]);
    if (!sectionId) { setSubjects([]); return; }
    setLoading(true);
    try {
      const [subRes, examRes] = await Promise.all([getSubjectsBySection(sectionId), getExamsBySection(sectionId)]);
      setSubjects(subRes.data);
      setExams(examRes.data);
    } catch { setSubjects([]); setExams([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await scheduleExam(form);
      setSuccess("Exam scheduled successfully");
      setForm({ classSubjectId: "", examDate: "", venue: "" });
      setShowForm(false);
      if (selectedSection) handleSectionChange(selectedSection);
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      setSuccess("Exam deleted");
      handleSectionChange(selectedSection);
    } catch { setError("Failed to delete"); }
  };

  if (initLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and manage exam dates per section.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          {showForm ? "Cancel" : "+ Schedule Exam"}
        </button>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Schedule New Exam</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject + Section</label>
              <select value={form.classSubjectId} onChange={(e) => setForm({ ...form, classSubjectId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select --</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.subjectId?.name}</option>
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
            <div className="flex items-end">
              <button type="submit" disabled={submitting || !selectedSection}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 rounded-xl transition">
                {submitting ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </form>
          {!selectedSection && <p className="text-xs text-amber-600 mt-2">Select a section below first to see available subjects.</p>}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select value={selectedClass} onChange={(e) => handleClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select class --</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)} disabled={!selectedClass}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
            <option value="">-- Select section --</option>
            {sections.map((s) => <option key={s._id} value={s._id}>Section {s.name}</option>)}
          </select>
        </div>
      </div>

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
                  <td className="px-5 py-3 text-gray-700">{new Date(e.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
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

      {!loading && selectedSection && exams.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No exams scheduled for this section yet.
        </div>
      )}

      {!selectedSection && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a class and section to view exams.
        </div>
      )}
    </div>
  );
};

export default ManageExams;