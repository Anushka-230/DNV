import { useEffect, useState } from "react";
import { getSubjectsBySection, getSyllabus } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { BookOpen, ChevronDown, ChevronUp, User, FileText } from "lucide-react";

const MySyllabus = () => {
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [subjects, setSubjects]         = useState([]);
  const [syllabuses, setSyllabuses]     = useState({});
  const [loading, setLoading]           = useState(false);
  const [expanded, setExpanded]         = useState(null);
  const [error, setError]               = useState("");

  useEffect(() => {
    if (!studentProfile) return;
    const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
    setLoading(true);
    getSubjectsBySection(sectionId)
      .then(async (r) => {
        setSubjects(r.data);
        // fetch syllabus for each subject
        const map = {};
        await Promise.all(
          r.data.map(async (s) => {
            try {
              const res = await getSyllabus(s._id);
              map[s._id] = res.data;
            } catch {
              map[s._id] = null;
            }
          })
        );
        setSyllabuses(map);
      })
      .catch(() => setError("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  if (profileLoading || loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Syllabus</h1>
        <p className="text-gray-500 text-sm mt-1">View the syllabus for each of your subjects.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {subjects.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No subjects found for your section.</p>
        </div>
      )}

      <div className="space-y-3">
        {subjects.map((s) => {
          const syl       = syllabuses[s._id];
          const isOpen    = expanded === s._id;
          const hasContent = syl?.content;
          return (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => toggle(s._id)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition text-left">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{s.subjectId?.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <User size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">{s.teacherId?.userId?.name || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasContent ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
                      Available
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">
                      Not uploaded
                    </span>
                  )}
                  {isOpen
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />
                  }
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {hasContent ? (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-xl p-4">
                      {syl.content}
                    </pre>
                  ) : (
                    <div className="text-center py-6">
                      <FileText size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Syllabus not uploaded yet by teacher.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySyllabus;