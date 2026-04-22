import { useEffect, useState } from "react";
import { getTimetableBySection } from "../../api/index.js";
import useStudentProfile from "../../utils/useStudentProfile.js";
import Loader from "../../components/Loader.jsx";
import { Clock, BookOpen, User, CalendarDays } from "lucide-react";

const DAYS = [
  { key: "Mon", label: "Monday"    },
  { key: "Tue", label: "Tuesday"   },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday"  },
  { key: "Fri", label: "Friday"    },
  { key: "Sat", label: "Saturday"  },
];

const DAY_COLORS = [
  "border-l-blue-400",
  "border-l-indigo-400",
  "border-l-purple-400",
  "border-l-green-400",
  "border-l-amber-400",
  "border-l-pink-400",
];

const StudentTimetable = () => {
  const { studentProfile, loading: profileLoading } = useStudentProfile();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 0 : new Date().getDay() - 1]?.key || "Mon");

  useEffect(() => {
    if (!studentProfile) return;
    const sectionId = studentProfile.sectionId?._id || studentProfile.sectionId;
    setLoading(true);
    getTimetableBySection(sectionId)
      .then((r) => setTimetable(r.data))
      .catch(() => setError("Failed to load timetable"))
      .finally(() => setLoading(false));
  }, [studentProfile]);

  const byDay = DAYS.reduce((acc, d) => {
    acc[d.key] = timetable
      .filter((s) => s.day === d.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const todaySlots = byDay[activeDay] || [];

  if (profileLoading || loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">
          {studentProfile?.sectionId?.classId?.name} — Section {studentProfile?.sectionId?.name} · {studentProfile?.sectionId?.academicYear}
        </p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {timetable.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <CalendarDays size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No timetable set up yet. Check back later.</p>
        </div>
      )}

      {timetable.length > 0 && (
        <>
          {/* Day tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {DAYS.map((d) => {
              const count = byDay[d.key]?.length || 0;
              const isToday = d.key === DAYS[new Date().getDay() === 0 ? 5 : new Date().getDay() - 1]?.key;
              return (
                <button key={d.key} onClick={() => setActiveDay(d.key)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    activeDay === d.key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                  }`}>
                  {d.label.slice(0, 3)}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeDay === d.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}>{count}</span>
                  )}
                  {isToday && <span className={`w-1.5 h-1.5 rounded-full ${activeDay === d.key ? "bg-yellow-300" : "bg-blue-500"}`} />}
                </button>
              );
            })}
          </div>

          {/* Slots for active day */}
          {todaySlots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
              <CalendarDays size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No classes scheduled for {DAYS.find((d) => d.key === activeDay)?.label}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot, i) => (
                <div key={slot._id} className={`bg-white rounded-2xl border border-l-4 ${DAY_COLORS[i % DAY_COLORS.length]} border-gray-100 shadow-sm p-5 flex items-center gap-5`}>
                  <div className="text-center min-w-24 bg-gray-50 rounded-xl py-3 px-2">
                    <p className="text-sm font-bold text-gray-900">{slot.startTime}</p>
                    <p className="text-xs text-gray-400 mt-0.5">to</p>
                    <p className="text-sm font-bold text-gray-900">{slot.endTime}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={15} className="text-blue-500" />
                      <p className="text-base font-bold text-gray-900">
                        {slot.classSubjectId?.subjectId?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User size={13} />
                      <span>{slot.classSubjectId?.teacherId?.userId?.name || "—"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={13} />
                      <span>
                        {(() => {
                          const [sh, sm] = slot.startTime.split(":").map(Number);
                          const [eh, em] = slot.endTime.split(":").map(Number);
                          return `${(eh * 60 + em) - (sh * 60 + sm)} min`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weekly overview */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <p className="font-bold text-gray-900 text-sm">Weekly Overview</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-gray-50">
              {DAYS.map((d) => (
                <div key={d.key} className="p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 mb-2">{d.key}</p>
                  <p className="text-lg font-extrabold text-gray-900">{byDay[d.key]?.length || 0}</p>
                  <p className="text-xs text-gray-400">classes</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTimetable;