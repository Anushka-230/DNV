import { useEffect, useState } from "react";
import { getAssignmentsByTeacher, getNotes, uploadNote, deleteNote } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const ManageNotes = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected]       = useState("");
  const [notes, setNotes]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [form, setForm]               = useState({ title: "", fileUrl: "", fileType: "pdf", description: "" });

  useEffect(() => {
    if (!teacherProfile) return;
    getAssignmentsByTeacher(teacherProfile._id)
      .then((r) => setAssignments(r.data))
      .catch(() => setError("Failed to load assignments"));
  }, [teacherProfile]);

  const handleSelect = async (classSubjectId) => {
    setSelected(classSubjectId); setNotes([]); setError(""); setSuccess("");
    if (!classSubjectId) return;
    setLoading(true);
    try {
      const res = await getNotes(classSubjectId);
      setNotes(res.data);
    } catch { setNotes([]); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await uploadNote({ ...form, classSubjectId: selected });
      setSuccess("Note uploaded successfully");
      setForm({ title: "", fileUrl: "", fileType: "pdf", description: "" });
      setShowForm(false);
      handleSelect(selected);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      setSuccess("Note deleted");
      handleSelect(selected);
    } catch { setError("Failed to delete"); }
  };

  const fileTypeIcons = { pdf: "📄", image: "🖼️", doc: "📝" };

  if (profileLoading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Notes</h1>
        <p className="text-gray-500 text-sm mt-1">Upload notes for your students per subject.</p>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject + Section</label>
          <select value={selected} onChange={(e) => handleSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select --</option>
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.subjectId?.name} — {a.sectionId?.classId?.name} Sec {a.sectionId?.name}
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            {showForm ? "Cancel" : "+ Upload Note"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Upload Note</h2>
          <p className="text-xs text-amber-600 mb-4">
            Note: Upload your file to Cloudinary or Google Drive first, then paste the link here.
          </p>
          <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" placeholder="Chapter 3 — Trigonometry" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="doc">Document</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
              <input type="url" placeholder="https://drive.google.com/..." value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input type="text" placeholder="Brief description..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Uploading..." : "Upload Note"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <Loader />}

      {!loading && notes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-gray-900">{notes.length} Note{notes.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {notes.map((n) => (
              <div key={n._id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{fileTypeIcons[n.fileType] || "📄"}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    {n.description && <p className="text-xs text-gray-400 mt-0.5">{n.description}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={n.fileUrl} target="_blank" rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold">View</a>
                  <button onClick={() => handleDelete(n._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && selected && notes.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No notes uploaded yet. Click + Upload Note to add one.
        </div>
      )}

      {!selected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a subject to manage its notes.
        </div>
      )}
    </div>
  );
};

export default ManageNotes;