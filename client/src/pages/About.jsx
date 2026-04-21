import { Link } from "react-router-dom";
import {
  GraduationCap,
  Handshake,
  Lightbulb,
  Sprout,
  User,
  UserCircle,
} from "lucide-react";

const team = [
  { name: "Dr. Ramesh Gupta", role: "Principal", subject: "Physics", exp: "22 yrs" },
  { name: "Mrs. Sunita Sharma", role: "Vice Principal", subject: "Mathematics", exp: "18 yrs" },
  { name: "Mr. Arjun Mehta", role: "Head of Science", subject: "Chemistry", exp: "15 yrs" },
  { name: "Mrs. Priya Das", role: "Head of Commerce", subject: "Accounts", exp: "12 yrs" },
];

const milestones = [
  { year: "2000", event: "School founded with 120 students and 12 teachers" },
  { year: "2005", event: "New science and computer labs inaugurated" },
  { year: "2010", event: "First batch of Class 12 achieves 100% pass rate" },
  { year: "2015", event: "Sports complex and auditorium completed" },
  { year: "2020", event: "Introduced digital classrooms across all sections" },
  { year: "2024", event: "Launched SchoolMS — our online management portal" },
];

const values = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    desc: "We set high standards and support every student to reach their potential.",
  },
  {
    icon: Handshake,
    title: "Inclusivity",
    desc: "Every child, regardless of background, deserves quality education.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We embrace modern teaching methods and digital tools.",
  },
  {
    icon: Sprout,
    title: "Holistic Development",
    desc: "Academics, sports, arts — we nurture the whole child.",
  },
];

const About = () => (
  <div className="bg-white">

    {/* HERO */}
    <section className="bg-gradient-to-br from-indigo-700 to-blue-600 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          About Our School
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
          For over 25 years, Debagram Netaji Vidyalaya has been committed to providing
          quality education that empowers students for life.
        </p>
      </div>
    </section>

    {/* PRINCIPAL */}
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Principal's Message
          </span>

          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5">
            A message from Mr.Bikash Chandra Das
          </h2>

          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Welcome to Debagram Netaji Vidyalaya — a place where curiosity is encouraged,
              character is built, and futures are shaped.
            </p>
            <p>
              Our dedicated faculty and vibrant environment help students grow
              academically and personally.
            </p>

            <p className="font-semibold text-gray-800">
              — Bikash Chandra Das, Principal
            </p>
          </div>
        </div>

        {/* ICON REPLACED */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 text-center">
          <UserCircle size={64} className="mx-auto mb-4 text-blue-600" />
          <p className="font-bold text-gray-900 text-lg">Bikash Chandra Das</p>
          <p className="text-gray-500 text-sm">Principal, Debagram Netaji Vidyalaya</p>
          <p className="text-gray-400 text-xs mt-1">
            M.Sc · 22 years experience
          </p>
        </div>

      </div>
    </section>

    {/* VALUES */}
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center mb-14">
        <h2 className="text-3xl font-bold text-gray-900">
          Our Core Values
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v) => (
          <div key={v.title} className="bg-white rounded-2xl p-6 border text-center shadow-sm">
            <v.icon size={32} className="mx-auto mb-4 text-blue-600" />
            <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* TEAM */}
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center mb-14">
        <h2 className="text-3xl font-bold text-gray-900">
          Leadership Team
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl border p-6 text-center shadow-sm">
            <User size={28} className="mx-auto mb-4 text-blue-600" />
            <p className="font-bold text-gray-900">{t.name}</p>
            <p className="text-sm text-blue-600">{t.role}</p>
            <p className="text-xs text-gray-500">{t.subject}</p>
            <p className="text-xs text-gray-400">{t.exp} experience</p>
          </div>
        ))}
      </div>
    </section>

  </div>
);

export default About;