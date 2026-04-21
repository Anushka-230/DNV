import { Link } from "react-router-dom";

const stats = [
  { label: "Students",   value: "1,200+" },
  { label: "Teachers",   value: "80+"    },
  { label: "Classrooms", value: "40+"    },
  { label: "Years",      value: "25+"    },
];

const features = [
  { icon: "📋", title: "Attendance Tracking", desc: "Teachers mark daily attendance subject-wise. Students can view records anytime." },
  { icon: "📚", title: "Syllabus & Notes",     desc: "Teachers upload syllabus and notes per subject. Students access everything in one place." },
  { icon: "🗓️", title: "Timetable",            desc: "Section-wise weekly timetables always up to date. No more confusion about schedules." },
  { icon: "📝", title: "Exam Schedule",         desc: "Exam dates and venues published instantly. Students never miss an update." },
  { icon: "👨‍🏫", title: "Teacher Profiles",   desc: "View qualifications and assigned subjects of every teacher in the school." },
  { icon: "🏫", title: "Class Management",      desc: "Admin manages classes, sections, subjects and assignments from one dashboard." },
];

const announcements = [
  { date: "Apr 18, 2025", title: "Annual Sports Day — May 10th",          tag: "Event"  },
  { date: "Apr 15, 2025", title: "Class 10 Pre-board Exams Start Apr 28", tag: "Exam"   },
  { date: "Apr 10, 2025", title: "Parent-Teacher Meeting — Apr 25th",     tag: "Notice" },
  { date: "Apr 05, 2025", title: "Summer vacation: May 20 to June 15",    tag: "Notice" },
];

const tagColors = {
  Event:  "bg-green-100 text-green-700",
  Exam:   "bg-red-100 text-red-700",
  Notice: "bg-blue-100 text-blue-700",
};

const roleCards = [
  {
    icon: "👤", title: "Admin",
    border: "border-purple-100", bg: "bg-purple-50", check: "text-purple-500",
    items: ["Manage users, teachers, students", "Create classes and sections", "Assign subjects to teachers", "View all attendance records"],
  },
  {
    icon: "👨‍🏫", title: "Teacher",
    border: "border-green-100", bg: "bg-green-50", check: "text-green-500",
    items: ["Mark subject-wise attendance", "Upload syllabus and notes", "View your timetable", "Schedule exams"],
  },
  {
    icon: "🎒", title: "Student",
    border: "border-blue-100", bg: "bg-blue-50", check: "text-blue-500",
    items: ["View attendance per subject", "Access notes and syllabus", "Check timetable", "See exam schedule"],
  },
];

const Home = () => (
  <div className="bg-white">

    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            Est. 2000 · Kolkata, West Bengal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Shaping Futures at<br />
            <span className="text-yellow-300">Vidya Mandir</span><br />
            School
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-lg leading-relaxed">
            A modern school management platform connecting students, teachers,
            and administrators in one seamless experience.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to="/login" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition text-sm">
              Sign In to Portal
            </Link>
            <Link to="/about" className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl transition text-sm border border-white/20">
              Learn More
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 grid grid-cols-2 gap-6 w-full max-w-xs">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-yellow-300">{s.value}</p>
              <p className="text-blue-200 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gray-50 border-y border-gray-100 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Latest Announcements</h2>
        <p className="text-gray-500 text-sm mb-8">Stay updated with school news</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {announcements.map((a) => (
            <div key={a.title} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${tagColors[a.tag]}`}>{a.tag}</span>
              <p className="text-sm font-semibold text-gray-800 mt-3 leading-snug">{a.title}</p>
              <p className="text-xs text-gray-400 mt-2">{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Everything in one place</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our system gives every role exactly what they need.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-2xl p-6 transition group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Built for every role</h2>
          <p className="text-gray-500 mt-3">Each user gets a personalised dashboard.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleCards.map((r) => (
            <div key={r.title} className={`bg-white rounded-2xl border ${r.border} p-7 shadow-sm`}>
              <div className={`w-12 h-12 ${r.bg} rounded-xl flex items-center justify-center text-2xl mb-5`}>{r.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{r.title}</h3>
              <ul className="space-y-2">
                {r.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={`${r.check} mt-0.5`}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-blue-100 mb-8">Sign in to access your personalised dashboard.</p>
        <Link to="/login" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-xl transition text-sm">
          Sign In to Portal
        </Link>
      </div>
    </section>

  </div>
);

export default Home;