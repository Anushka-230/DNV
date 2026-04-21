import { Link } from "react-router-dom";
import {
  GraduationCap,
  School,
  User,
  Check,
} from "lucide-react";

const stats = [
  { label: "Students", value: "1,200+" },
  { label: "Teachers", value: "80+" },
  { label: "Classrooms", value: "40+" },
  { label: "Years", value: "25+" },
];

const roleCards = [
  {
    icon: User,
    title: "Admin",
    border: "border-purple-100",
    bg: "bg-purple-50",
    check: "text-purple-500",
    items: [
      "Manage users, teachers, and students",
      "Create and organize classes",
      "Assign subjects to teachers",
      "Monitor attendance records",
    ],
  },
  {
    icon: GraduationCap,
    title: "Teacher",
    border: "border-green-100",
    bg: "bg-green-50",
    check: "text-green-500",
    items: [
      "Mark daily attendance",
      "Upload syllabus and notes",
      "View teaching schedule",
      "Manage exams and assessments",
    ],
  },
  {
    icon: School,
    title: "Student",
    border: "border-blue-100",
    bg: "bg-blue-50",
    check: "text-blue-500",
    items: [
      "Track attendance records",
      "Access study materials",
      "View class timetable",
      "Check exam schedules",
    ],
  },
];

const Home = () => (
  <div className="bg-white">

    {/* HERO */}
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />

      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">

          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            Est. 1999 · Debagram, Gangnapur, Nadia
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Shaping Futures at<br />
            <span className="text-yellow-300">Debagram Netaji Vidyalaya</span>
          </h1>

          <p className="text-blue-100 text-lg mb-8 max-w-lg leading-relaxed">
            A leading high school committed to academic excellence, discipline,
            and the overall development of every student.
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              Sign In to Portal
            </Link>

            <Link
              to="/about"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl transition text-sm border border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* STATS */}
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

    {/* WHY CHOOSE US */}
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center mb-14">
        <h2 className="text-3xl font-bold text-gray-900">
          Why Choose Our School
        </h2>
        <p className="text-gray-500 mt-3">
          Focused on overall development of every student
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          "Experienced and dedicated teachers",
          "Strong academic foundation",
          "Focus on discipline and values",
          "Encouragement in sports and activities",
        ].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-100 rounded-xl p-5 text-sm text-gray-700 shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </section>

    
    {/* ADMISSIONS */}
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white text-center">
      <h2 className="text-3xl font-bold mb-3">
        Admissions Open for 2025–26
      </h2>

      <p className="text-blue-100 mb-6">
        Enroll your child in a school that focuses on both academics and values.
      </p>

      <Link
        to="/contact"
        className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-xl transition text-sm"
      >
        Apply Now
      </Link>
    </section>
    {/* TESTIMONIALS */}
<section className="py-20 bg-gray-50 border-t border-gray-100">
  <div className="max-w-6xl mx-auto px-4 text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900">
      What People Say
    </h2>
    <p className="text-gray-500 mt-2">
      Voices from our students and parents
    </p>
  </div>

  <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
    {[
      {
        name: "Riya Sharma",
        role: "Student",
        text: "The teachers are very supportive and always encourage us to do better. I feel confident about my future here.",
      },
      {
        name: "Amit Das",
        role: "Parent",
        text: "A great school with strong discipline and focus on academics. My child has improved a lot.",
      },
      {
        name: "Rahul Sen",
        role: "Student",
        text: "I really like the environment here. It’s not just studies, we also get chances in sports and activities.",
      },
    ].map((t, i) => (
      <div
        key={i}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left"
      >
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          “{t.text}”
        </p>

        <div>
          <p className="font-semibold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-500">{t.role}</p>
        </div>
      </div>
    ))}
  </div>
</section>

  </div>
);

export default Home;