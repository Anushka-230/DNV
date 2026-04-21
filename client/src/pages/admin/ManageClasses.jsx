import { useEffect, useState } from "react";
import { getAllClasses, createClass, deleteClass, getAllSections, createSection, getSectionsByClass, getAllTeachers, updateSection } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";
import { School } from "lucide-react";

const ManageClasses = () => {
  const [classes, setClasses]       = useState([]);
  const [sections, setSections]     = useState({});
  const [teachers, setTeachers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [classForm, setClassForm]     = useState({ name: "", description: "" });
  const [showClassForm, setShowClassForm] = useState(false);
  const [sectionForm, setSectionForm] = useState({ classId: "", name: "", classTeacherId: "", academicYear: "", capacity: 40 });
  const [showSectionForm, setShowSectionForm] = useState(false);

  const fetchAll = async () => {
    try {
      const [cRes, tRes] = await Promise.all([getAllClasses(), getAllTeachers()]);
      setClasses(cRes.data);
      setTeachers(tRes.data);
      const secMap = {};
      await Promise.all(cRes.data.map(async (c) => {
        try {
          const sRes = await getSectionsByClass(c._id);
          secMap[c._id] = sRes.data;
        } catch { secMap[c._id] = []; }
      }));
      setSections(secMap);
    } catch { setError("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await createClass(classForm);
      setSuccess("Class created");
      setClassForm({ name: "", description: "" });
      setShowClassForm(false);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await createSection(sectionForm);
      setSuccess("Section created");
      setSectionForm({ classId: "", name: "", classTeacherId: "", academicYear: "", capacity: 40 });
      setShowSectionForm(false);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleDeleteClass = async (id, name) => {
    if (!window.confirm(`Delete class "${name}"?`)) return;
    try {
      await deleteClass(id);
      setSuccess(`Class "${name}" deleted`);
      fetchAll();
    } catch { setError("Failed to delete class"); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Classes & Sections</h1>
          <p className="text-gray-500 text-sm mt-1">{classes.length} classes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowClassForm(!showClassForm); setShowSectionForm(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + New Class
          </button>
          <button onClick={() => { setShowSectionForm(!showSectionForm); setShowClassForm(false); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + New Section
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {/* Create Class Form */}
      {showClassForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Create New Class</h2>
          <form onSubmit={handleCreateClass} className="flex gap-4 flex-wrap">
            <input type="text" placeholder='e.g. "Class 10"' value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} required
              className="flex-1 min-w-40 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Description (optional)" value={classForm.description}
              onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
              className="flex-1 min-w-40 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
              {submitting ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {/* Create Section Form */}
      {showSectionForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Create New Section</h2>
          <form onSubmit={handleCreateSection} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select value={sectionForm.classId} onChange={(e) => setSectionForm({ ...sectionForm, classId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select class --</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
              <input type="text" placeholder='e.g. "A"' value={sectionForm.name}
                onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher</label>
              <select value={sectionForm.classTeacherId} onChange={(e) => setSectionForm({ ...sectionForm, classTeacherId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Assign later --</option>
                {teachers.map((t) => <option key={t._id} value={t._id}>{t.userId?.name} ({t.employeeId})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input type="text" placeholder="2025-26" value={sectionForm.academicYear}
                onChange={(e) => setSectionForm({ ...sectionForm, academicYear: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" placeholder="40" value={sectionForm.capacity}
                onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Creating..." : "Create Section"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes + Sections list */}
      <div className="space-y-4">
        {classes.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <School size={20} className="text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">{c.name}</p>
                  {c.description && <p className="text-xs text-gray-500">{c.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{(sections[c._id] || []).length} sections</span>
                <button onClick={() => handleDeleteClass(c._id, c.name)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
              </div>
            </div>
            <div className="p-4">
              {(sections[c._id] || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">No sections yet. Click + New Section to add one.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {(sections[c._id] || []).map((s) => (
                    <div key={s._id} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 min-w-36">
                      <p className="font-bold text-blue-800 text-sm">Section {s.name}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{s.academicYear}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Class teacher: {s.classTeacherId?.userId?.name || "Not assigned"}
                      </p>
                      <p className="text-xs text-gray-400">Capacity: {s.capacity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
            No classes yet. Click + New Class to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;