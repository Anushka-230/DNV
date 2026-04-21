import { useEffect, useState } from "react";
import { getAssignmentsByTeacher, getSyllabus, createSyllabus, updateSyllabus } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const ManageSyllabus = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected]       = useState("");
  const [syllabus, setSyllabus]       = useState(null);
  const [content, setContent]         = useState("");
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

  const handleSelect = async (classSubjectId) => {
    setSelected(classSubjectId); setSyllabus(null); setContent(""); setError(""); setSuccess("");
    if (!classSubjectId) return;
    setLoading(true);
    try {
      const res = await getSyllabus(classSubjectId);
      setSyllabus(res.data);
      setContent(res.data.content || "");
    } catch (err) {
      if (err.response?.status === 404) {
        setSyllabus(null); setContent("");
      } else {
        setError("Failed to load syllabus");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      if (syllabus) {
        await updateSyllabus(syllabus._id, { content });
        setSuccess("Syllabus updated successfully");
      } else {
        await createSyllabus({ classSubjectId: selected, content });
        setSuccess("Syllabus created successfully");
        handleSelect(selected);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save syllabus");
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) return <Loader />;

  const selectedAssignment = assignments.find((a) => a._id === selected);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Syllabus</h1>
        <p className="text-gray-500 text-sm mt-1">Add or update the syllabus for each of your subjects.</p>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject + Section</label>
        <select value={selected} onChange={(e) => handleSelect(e.target.value)}
          className="w-full sm:w-96 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Select --</option>
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.subjectId?.name} — {a.sectionId?.classId?.name} Sec {a.sectionId?.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}

      {!loading && selected && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900">{selectedAssignment?.subjectId?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedAssignment?.sectionId?.classId?.name} — Section {selectedAssignment?.sectionId?.name}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${syllabus ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {syllabus ? "Syllabus exists" : "No syllabus yet"}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder={`Enter the syllabus for ${selectedAssignment?.subjectId?.name}...\n\nUnit 1: Introduction\n- Topic 1\n- Topic 2\n\nUnit 2: ...\n`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
            />
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={submitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                {submitting ? "Saving..." : syllabus ? "Update Syllabus" : "Create Syllabus"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!selected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a subject to manage its syllabus.
        </div>
      )}
    </div>
  );
};

export default ManageSyllabus;