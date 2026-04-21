import { useEffect, useState } from "react";
import { getAllClasses, getSectionsByClass, getSubjectsBySection, getStudentsBySection, getClassSubjectAttendance, updateAttendance } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";

const STATUS_COLORS = {
  present: "bg-green-100 text-green-700",
  absent:  "bg-red-100 text-red-700",
  late:    "bg-yellow-100 text-yellow-700",
};

const AdminAttendance = () => {
  const [classes, setClasses]     = useState([]);
  const [sections, setSections]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const [selectedClass,   setSelectedClass]   = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    getAllClasses().then((r) => setClasses(r.data)).finally(() => setInitLoading(false));
  }, []);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId); setSelectedSection(""); setSelectedSubject(""); setRecords([]);
    if (!classId) { setSections([]); return; }
    try { const r = await getSectionsByClass(classId); setSections(r.data); } catch { setSections([]); }
  };

  const handleSectionChange = async (sectionId) => {
    setSelectedSection(sectionId); setSelectedSubject(""); setRecords([]);
    if (!sectionId) { setSubjects([]); return; }
    try { const r = await getSubjectsBySection(sectionId); setSubjects(r.data); } catch { setSubjects([]); }
  };

  const handleSubjectChange = async (classSubjectId) => {
    setSelectedSubject(classSubjectId); setRecords([]);
    if (!classSubjectId) return;
    setLoading(true);
    try {
      const r = await getClassSubjectAttendance(classSubjectId);
      setRecords(r.data);
    } catch { setError("Failed to load attendance"); }
    finally { setLoading(false); }
  };

  const handleEdit = async (id) => {
    try {
      await updateAttendance(id, { status: editStatus });
      setSuccess("Attendance updated");
      setEditingId(null);
      handleSubjectChange(selectedSubject);
    } catch { setError("Failed to update"); }
  };

  if (initLoading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-500 text-sm mt-1">View and edit attendance for any class, section and subject.</p>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)} disabled={!selectedSection}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
            <option value="">-- Select subject --</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.subjectId?.name}</option>)}
          </select>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && records.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Student", "Date", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{r.studentId?.userId?.name || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3">
                    {editingId === r._id ? (
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {["present", "absent", "late"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === r._id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(r._id)} className="text-green-600 hover:text-green-800 text-xs font-semibold">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(r._id); setEditStatus(r.status); }}
                        className="text-blue-500 hover:text-blue-700 text-xs font-semibold">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedSubject && records.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No attendance records found for this subject.
        </div>
      )}

      {!selectedSubject && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a class, section and subject to view attendance records.
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;