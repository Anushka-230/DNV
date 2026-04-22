import { useEffect, useState } from "react";
import { getExamsBySection } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { CalendarDays, MapPin, Clock, BookOpen, AlertTriangle } from "lucide-react";

const MyExams = () => {
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [exams, setExams]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]   = useState("upcoming");
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!studentProfile) return;
    const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
    setLoading(true);
    getExamsBySection(sectionId)
      .then((r) => setExams(r.data))
      .catch(() => setError("Failed to load exams"))
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const now = new Date();

  const upcoming = exams
    .filter((e) => new Date(e.examDate) >= now)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

  const past = exams
    .filter((e) => new Date(e.examDate) < now)
    .sort((a, b) => new Date(b.examDate) - new Date(a.examDate));

  const displayed = filter === "upcoming" ? upcoming : past;

  const getDaysLeft = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return { label: "Today", color: "bg-red-100 text-red-700" };
    if (diff === 1) return { label: "Tomorrow", color: "bg-orange-100 text-orange-700" };
    if (diff <= 3)  return { label: `${diff} days left`, color: "bg-red-100 text-red-700" };
    if (diff <= 7)  return { label: `${diff} days left`, color: "bg-amber-100 text-amber-700" };
    return { label: `${diff} days left`, color: "bg-blue-100 text-blue-700" };
  };

  if (profileLoading || loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exam Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">
          {studentProfile?.sectionId?.classId?.name} — Section {studentProfile?.sectionId?.name}
        </p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Upcoming alert */}
      {upcoming.length > 0 && filter === "upcoming" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            You have <strong>{upcoming.length}</strong> upcoming exam{upcoming.length !== 1 ? "s" : ""}. Stay prepared!
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Exams",    value: exams.length,    icon: BookOpen,     color: "border-gray-100"   },
          { label: "Upcoming",       value: upcoming.length, icon: CalendarDays, color: "border-amber-100"  },
          { label: "Completed",      value: past.length,     icon: Clock,        color: "border-green-100"  },
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

      {/* Tab filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "past",     label: `Past (${past.length})`         },
        ].map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === t.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <CalendarDays size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {filter === "upcoming" ? "No upcoming exams scheduled." : "No past exams found."}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {displayed.map((e, i) => {
          const isPast   = new Date(e.examDate) < now;
          const daysInfo = !isPast ? getDaysLeft(e.examDate) : null;
          const dateObj  = new Date(e.examDate);
          return (
            <div key={e._id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-5 ${
                !isPast && getDaysLeft(e.examDate).label === "Today"
                  ? "border-red-200 ring-1 ring-red-100"
                  : "border-gray-100"
              }`}>

              {/* Date block */}
              <div className={`text-center min-w-16 rounded-xl py-3 px-2 flex-shrink-0 ${isPast ? "bg-gray-50" : "bg-blue-50"}`}>
                <p className={`text-xl font-extrabold ${isPast ? "text-gray-400" : "text-blue-700"}`}>
                  {dateObj.getDate()}
                </p>
                <p className={`text-xs font-semibold uppercase ${isPast ? "text-gray-400" : "text-blue-500"}`}>
                  {dateObj.toLocaleString("en-IN", { month: "short" })}
                </p>
                <p className={`text-xs ${isPast ? "text-gray-400" : "text-blue-400"}`}>
                  {dateObj.getFullYear()}
                </p>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen size={15} className="text-gray-500" />
                  <p className="font-bold text-gray-900">{e.classSubjectId?.subjectId?.name || "—"}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {e.venue && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>{e.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays size={12} />
                    <span>{dateObj.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
                  </div>
                </div>
              </div>

              {/* Badge */}
              {isPast ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 flex-shrink-0">
                  Completed
                </span>
              ) : (
                <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0 ${daysInfo.color}`}>
                  {daysInfo.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyExams;