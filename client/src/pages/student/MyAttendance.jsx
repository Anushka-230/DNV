import { useEffect, useState } from "react";
import { getStudentAttendance, getSubjectsBySection } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { CheckCircle, XCircle, Clock, BarChart2, Filter } from "lucide-react";

const STATUS_CONFIG = {
  present: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 border-green-100", label: "Present" },
  absent:  { icon: XCircle,     color: "text-red-500",   bg: "bg-red-50 border-red-100",     label: "Absent"  },
  late:    { icon: Clock,       color: "text-yellow-500",bg: "bg-yellow-50 border-yellow-100",label: "Late"    },
};

const MyAttendance = () => {
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [records, setRecords]     = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [filter, setFilter]       = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    if (!studentProfile) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
        const [attRes, subRes] = await Promise.all([
          getStudentAttendance(studentProfile._id),
          getSubjectsBySection(sectionId),
        ]);
        setRecords(attRes.data);
        setSubjects(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [studentProfile]);

  const filtered = records.filter((r) => {
    const statusMatch  = filter === "all" || r.status === filter;
    const subjectMatch = subjectFilter === "all" || r.classSubjectId?._id === subjectFilter;
    return statusMatch && subjectMatch;
  });

  // per-subject stats
  const subjectStats = subjects.map((s) => {
    const subRecords = records.filter((r) => r.classSubjectId?._id === s._id);
    const present    = subRecords.filter((r) => r.status === "present").length;
    const pct        = subRecords.length > 0 ? Math.round((present / subRecords.length) * 100) : 0;
    return { ...s, total: subRecords.length, present, pct };
  });

  if (profileLoading || loading) return <Loader />;

  const overall = records.length > 0
    ? Math.round((records.filter((r) => r.status === "present").length / records.length) * 100)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Track your attendance across all subjects.</p>
      </div>

      {/* Overall summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Overall",  value: `${overall}%`, icon: BarChart2,   color: overall >= 75 ? "border-green-100" : "border-red-100" },
          { label: "Present",  value: records.filter((r) => r.status === "present").length, icon: CheckCircle, color: "border-green-100" },
          { label: "Absent",   value: records.filter((r) => r.status === "absent").length,  icon: XCircle,     color: "border-red-100"   },
          { label: "Late",     value: records.filter((r) => r.status === "late").length,    icon: Clock,       color: "border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.color} p-4 flex items-center gap-3 shadow-sm`}>
            <s.icon size={20} className="text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Per-subject breakdown */}
      {subjectStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <BarChart2 size={16} className="text-gray-500" />
            <p className="font-bold text-gray-900">Subject-wise Breakdown</p>
          </div>
          <div className="divide-y divide-gray-50">
            {subjectStats.map((s) => (
              <div key={s._id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{s.subjectId?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.present} present of {s.total} classes</p>
                </div>
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${s.pct >= 75 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className={`text-sm font-bold min-w-12 text-right ${s.pct >= 75 ? "text-green-600" : "text-red-600"}`}>
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters + Records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-gray-500" />
          <p className="font-bold text-gray-900 mr-2">All Records</p>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.subjectId?.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            {["all", "present", "absent", "late"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {s}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} records</span>
        </div>

        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">No records found</p>
          )}
          {filtered.map((r) => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.present;
            return (
              <div key={r._id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <cfg.icon size={16} className={cfg.color} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {r.classSubjectId?.subjectId?.name || "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize ${cfg.bg} ${cfg.color}`}>
                  {r.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;