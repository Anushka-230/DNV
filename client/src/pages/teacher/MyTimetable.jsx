import { useEffect, useState } from "react";
import { getAssignmentsByTeacher, getTimetableBySection } from "../../api/index.js";
import useTeacherProfile from "../../utils/useTeacherProfile.js";
import Loader from "../../components/Loader.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MyTimetable = () => {
  const { teacherProfile, loading: profileLoading } = useTeacherProfile();
  const [timetable, setTimetable] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!teacherProfile) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const aRes = await getAssignmentsByTeacher(teacherProfile._id);
        setAssignments(aRes.data);

        // get unique section IDs
        const sectionIds = [...new Set(aRes.data.map((a) => a.sectionId?._id).filter(Boolean))];

        // fetch timetable for each section
        const allSlots = [];
        await Promise.all(
          sectionIds.map(async (sid) => {
            try {
              const tRes = await getTimetableBySection(sid);
              // only keep slots for this teacher's subjects
              const mySubjectIds = aRes.data
                .filter((a) => a.sectionId?._id === sid)
                .map((a) => a._id);
              const filtered = tRes.data.filter((slot) =>
                mySubjectIds.includes(slot.classSubjectId?._id)
              );
              allSlots.push(...filtered);
            } catch {}
          })
        );
        setTimetable(allSlots);
      } catch { setError("Failed to load timetable"); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [teacherProfile]);

  // group by day
  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = timetable.filter((s) => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  if (profileLoading || loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">Your weekly teaching schedule across all sections.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {timetable.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-sm">
          No timetable slots found. Ask admin to set up your timetable.
        </div>
      )}

      {timetable.length > 0 && (
        <div className="space-y-4">
          {DAYS.map((day) => (
            byDay[day].length > 0 && (
              <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : day === "Fri" ? "Friday" : "Saturday"}</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {byDay[day].map((slot) => (
                    <div key={slot._id} className="px-5 py-3 flex items-center gap-6">
                      <div className="text-center min-w-20">
                        <p className="text-sm font-bold text-blue-600">{slot.startTime}</p>
                        <p className="text-xs text-gray-400">to {slot.endTime}</p>
                      </div>
                      <div className="h-8 w-0.5 bg-gray-100" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {slot.classSubjectId?.subjectId?.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {slot.classSubjectId?.sectionId?.classId?.name} — Section {slot.classSubjectId?.sectionId?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTimetable;