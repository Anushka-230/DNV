import { useEffect, useState } from "react";
import { getTeacherSections, getStudentsBySection } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const MyStudents = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [sections, setSections]   = useState([]);
  const [students, setStudents]   = useState([]);
  const [selected, setSelected]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    if (!teacherProfile) return;
    getTeacherSections(teacherProfile._id)
      .then((res) => {
        const all = [
          ...(res.data.classTeacherOf || []),
          ...(res.data.subjectTeacherOf || []).map((s) => s.sectionId),
        ];
        // deduplicate by _id
        const unique = Array.from(new Map(all.map((s) => [s._id, s])).values());
        setSections(unique);
      })
      .catch(() => setError("Failed to load sections"));
  }, [teacherProfile]);

  const handleSectionChange = async (sectionId) => {
    setSelected(sectionId); setStudents([]); setSearch("");
    if (!sectionId) return;
    setLoading(true);
    try {
      const res = await getStudentsBySection(sectionId);
      setStudents(res.data);
    } catch { setError("Failed to load students"); }
    finally { setLoading(false); }
  };

  const filtered = students.filter((s) =>
    s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (profileLoading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500 text-sm mt-1">View students across your assigned sections.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select value={selected} onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select section --</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.classId?.name} — Section {s.name} ({s.academicYear})
              </option>
            ))}
          </select>
        </div>
        {students.length > 0 && (
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" placeholder="Search by name or roll no..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
      </div>

      {loading && <Loader />}

      {!loading && students.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-3">{filtered.length} students</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Roll No.", "Name", "Email", "Section", "Academic Year"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-gray-500">{s.rollNumber}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{s.userId?.name}</td>
                    <td className="px-5 py-3 text-gray-500">{s.userId?.email}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {s.sectionId?.classId?.name} — Sec {s.sectionId?.name}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{s.sectionId?.academicYear}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No students match your search</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !selected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          Select a section to view its students.
        </div>
      )}
    </div>
  );
};

export default MyStudents;