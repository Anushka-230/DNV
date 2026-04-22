import { useEffect, useState } from "react";
import { getSubjectsBySection, getNotes } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { FileText, Image, File, Download, BookOpen, Search, User } from "lucide-react";

const FILE_ICONS = {
  pdf:   { icon: FileText, color: "text-red-500",  bg: "bg-red-50"   },
  image: { icon: Image,    color: "text-blue-500", bg: "bg-blue-50"  },
  doc:   { icon: File,     color: "text-indigo-500",bg: "bg-indigo-50"},
};

const MyNotes = () => {
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [subjects, setSubjects]   = useState([]);
  const [allNotes, setAllNotes]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState("all");
  const [search, setSearch]       = useState("");
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!studentProfile) return;
    const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
    setLoading(true);
    getSubjectsBySection(sectionId)
      .then(async (r) => {
        setSubjects(r.data);
        const map = {};
        await Promise.all(
          r.data.map(async (s) => {
            try {
              const res = await getNotes(s._id);
              map[s._id] = res.data;
            } catch {
              map[s._id] = [];
            }
          })
        );
        setAllNotes(map);
      })
      .catch(() => setError("Failed to load notes"))
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const flatNotes = subjects.flatMap((s) =>
    (allNotes[s._id] || []).map((n) => ({ ...n, subjectName: s.subjectId?.name, classSubjectId: s._id }))
  );

  const filtered = flatNotes.filter((n) => {
    const subjectMatch = selected === "all" || n.classSubjectId === selected;
    const searchMatch  = n.title.toLowerCase().includes(search.toLowerCase()) ||
                         n.subjectName?.toLowerCase().includes(search.toLowerCase());
    return subjectMatch && searchMatch;
  });

  if (profileLoading || loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        <p className="text-gray-500 text-sm mt-1">{flatNotes.length} notes across all subjects.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search notes..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelected("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selected === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            All subjects
          </button>
          {subjects.map((s) => (
            <button key={s._id} onClick={() => setSelected(s._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selected === s._id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s.subjectId?.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {search || selected !== "all" ? "No notes match your search." : "No notes uploaded yet."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((n) => {
          const cfg = FILE_ICONS[n.fileType] || FILE_ICONS.pdf;
          return (
            <div key={n._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.bg}`}>
                  <cfg.icon size={20} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{n.title}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{n.subjectName}</p>
                </div>
              </div>
              {n.description && (
                <p className="text-xs text-gray-500 leading-relaxed">{n.description}</p>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-400">{n.teacherId?.userId?.name || "—"}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
              <a href={n.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition">
                <Download size={14} />
                View / Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyNotes;