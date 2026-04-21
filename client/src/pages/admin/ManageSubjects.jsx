import { useEffect, useState } from "react";
import { getAllSubjects, createSubject, deleteSubject, getAllAssignments, assignTeacher, removeAssignment, getAllSections, getAllTeachers } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";

const ManageSubjects = () => {
  const [subjects, setSubjects]         = useState([]);
  const [assignments, setAssignments]   = useState([]);
  const [sections, setSections]         = useState([]);
  const [teachers, setTeachers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [subjectName, setSubjectName]   = useState("");
  const [showSubForm, setShowSubForm]   = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignForm, setAssignForm]     = useState({ sectionId: "", subjectId: "", teacherId: "" });

  const fetchAll = async () => {
    try {
      const [subRes, assRes, secRes, tRes] = await Promise.all([
        getAllSubjects(), getAllAssignments(), getAllSections(), getAllTeachers(),
      ]);
      setSubjects(subRes.data);
      setAssignments(assRes.data);
      setSections(secRes.data);
      setTeachers(tRes.data);
    } catch { setError("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await createSubject({ name: subjectName });
      setSuccess(`Subject "${subjectName}" created`);
      setSubjectName("");
      setShowSubForm(false);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await assignTeacher(assignForm);
      setSuccess("Teacher assigned successfully");
      setAssignForm({ sectionId: "", subjectId: "", teacherId: "" });
      setShowAssignForm(false);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleDeleteSubject = async (id, name) => {
    if (!window.confirm(`Delete subject "${name}"?`)) return;
    try {
      await deleteSubject(id);
      setSuccess(`Subject "${name}" deleted`);
      fetchAll();
    } catch { setError("Failed to delete"); }
  };

  const handleRemoveAssignment = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await removeAssignment(id);
      setSuccess("Assignment removed");
      fetchAll();
    } catch { setError("Failed to remove"); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
          <p className="text-gray-500 text-sm mt-1">{subjects.length} subjects · {assignments.length} assignments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowSubForm(!showSubForm); setShowAssignForm(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + Subject
          </button>
          <button onClick={() => { setShowAssignForm(!showAssignForm); setShowSubForm(false); }}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + Assign Teacher
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {showSubForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Create Subject</h2>
          <form onSubmit={handleCreateSubject} className="flex gap-4">
            <input type="text" placeholder="e.g. Mathematics" value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)} required
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
              {submitting ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {showAssignForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Assign Teacher to Subject + Section</h2>
          <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Section", field: "sectionId", options: sections, getLabel: (s) => `${s.sectionId?.classId?.name || ""} - Sec ${s.name}`, getId: (s) => s._id, rawOptions: sections, getOptLabel: (s) => `${s.classId?.name || "?"} - Section ${s.name}` },
            ].map(() => null)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select value={assignForm.sectionId} onChange={(e) => setAssignForm({ ...assignForm, sectionId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select section --</option>
                {sections.map((s) => <option key={s._id} value={s._id}>{s.classId?.name} - Section {s.name} ({s.academicYear})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select value={assignForm.subjectId} onChange={(e) => setAssignForm({ ...assignForm, subjectId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select subject --</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select value={assignForm.teacherId} onChange={(e) => setAssignForm({ ...assignForm, teacherId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select teacher --</option>
                {teachers.map((t) => <option key={t._id} value={t._id}>{t.userId?.name} ({t.employeeId})</option>)}
              </select>
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Assigning..." : "Assign"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subjects list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-gray-900">All Subjects</p>
          </div>
          <div className="divide-y divide-gray-50">
            {subjects.map((s) => (
              <div key={s._id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-medium text-gray-800">{s.name}</span>
                </div>
                <button onClick={() => handleDeleteSubject(s._id, s.name)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
              </div>
            ))}
            {subjects.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">No subjects yet</p>}
          </div>
        </div>

        {/* Assignments list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-gray-900">Subject Assignments</p>
          </div>
          <div className="divide-y divide-gray-50">
            {assignments.map((a) => (
              <div key={a._id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.subjectId?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {a.sectionId?.classId?.name} - Section {a.sectionId?.name} &nbsp;·&nbsp; {a.teacherId?.userId?.name}
                  </p>
                </div>
                <button onClick={() => handleRemoveAssignment(a._id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold">Remove</button>
              </div>
            ))}
            {assignments.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">No assignments yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjects;