import { useEffect, useState } from "react";
import { getAllStudents, getAllUsers, getAllSections, getAllClasses, createStudent, getSectionsByClass } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";

const ManageStudents = () => {
  const [students, setStudents]       = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [classes, setClasses]         = useState([]);
  const [sections, setSections]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [search, setSearch]           = useState("");
  const [form, setForm]               = useState({ userId: "", sectionId: "", rollNumber: "" });
  const [selectedClass, setSelectedClass] = useState("");

  const fetchAll = async () => {
    try {
      const [sRes, uRes, cRes] = await Promise.all([getAllStudents(), getAllUsers(), getAllClasses()]);
      setStudents(sRes.data);
      const studentUserIds = sRes.data.map((s) => s.userId?._id || s.userId);
      setUserOptions(uRes.data.filter((u) => u.role === "student" && !studentUserIds.includes(u._id)));
      setClasses(cRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setForm((f) => ({ ...f, sectionId: "" }));
    if (!classId) { setSections([]); return; }
    try {
      const res = await getSectionsByClass(classId);
      setSections(res.data);
    } catch { setSections([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSubmitting(true);
    try {
      await createStudent(form);
      setSuccess("Student profile created successfully");
      setForm({ userId: "", sectionId: "", rollNumber: "" });
      setSelectedClass("");
      setSections([]);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create student profile");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter((s) =>
  s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
  String(s.rollNumber ?? "").toLowerCase().includes(search.toLowerCase())
);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} student profiles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          {showForm ? "Cancel" : "+ New Student Profile"}
        </button>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Create Student Profile</h2>
          <p className="text-xs text-gray-400 mb-4">First create the user account in Manage Users, then create the profile here.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select User (role = student)</label>
              <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select a user --</option>
                {userOptions.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
              <select value={selectedClass} onChange={(e) => handleClassChange(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select class --</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Section</label>
              <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select section --</option>
                {sections.map((s) => <option key={s._id} value={s._id}>Section {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input type="text" placeholder="01" value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input type="text" placeholder="Search by name or roll number..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Roll No.", "Name", "Email", "Class", "Section", "Academic Year"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 font-mono text-gray-700">{s.rollNumber}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{s.userId?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{s.userId?.email || "—"}</td>
                <td className="px-5 py-3 text-gray-700">{s.sectionId?.classId?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-700">Section {s.sectionId?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{s.sectionId?.academicYear || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;