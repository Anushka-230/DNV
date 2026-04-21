import { Link } from "react-router-dom";

const team = [
  { name: "Dr. Ramesh Gupta",    role: "Principal",          subject: "Physics",       exp: "22 yrs" },
  { name: "Mrs. Sunita Sharma",  role: "Vice Principal",     subject: "Mathematics",   exp: "18 yrs" },
  { name: "Mr. Arjun Mehta",     role: "Head of Science",    subject: "Chemistry",     exp: "15 yrs" },
  { name: "Mrs. Priya Das",      role: "Head of Commerce",   subject: "Accounts",      exp: "12 yrs" },
];

const milestones = [
  { year: "2000", event: "School founded with 120 students and 12 teachers" },
  { year: "2005", event: "New science and computer labs inaugurated"         },
  { year: "2010", event: "First batch of Class 12 achieves 100% pass rate"  },
  { year: "2015", event: "Sports complex and auditorium completed"           },
  { year: "2020", event: "Introduced digital classrooms across all sections" },
  { year: "2024", event: "Launched SchoolMS — our online management portal"  },
];

const values = [
  { icon: "🎓", title: "Academic Excellence",  desc: "We set high standards and support every student to reach their potential." },
  { icon: "🤝", title: "Inclusivity",           desc: "Every child, regardless of background, deserves quality education." },
  { icon: "💡", title: "Innovation",            desc: "We embrace modern teaching methods and digital tools." },
  { icon: "🌱", title: "Holistic Development",  desc: "Academics, sports, arts — we nurture the whole child." },
];

const About = () => (
  <div className="bg-white">

    {/* HERO */}
    <section className="bg-gradient-to-br from-indigo-700 to-blue-600 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Our School</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
          For over 25 years, Vidya Mandir School has been committed to providing
          quality education that empowers students for life.
        </p>
      </div>
    </section>

    {/* PRINCIPAL'S MESSAGE */}
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Principal's Message</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5">A message from Dr. Ramesh Gupta</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Welcome to Vidya Mandir School — a place where curiosity is encouraged,
                character is built, and futures are shaped. Since our founding in 2000,
                we have remained committed to one simple belief: every child has the potential to excel.
              </p>
              <p>
                Our dedicated faculty, modern facilities, and vibrant community create an
                environment where students thrive academically and personally. With the
                launch of our digital management portal, we continue to evolve with the times
                while staying true to our values.
              </p>
              <p className="font-semibold text-gray-800">
                — Dr. Ramesh Gupta, Principal
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 text-center">
            <div className="text-7xl mb-4">👨‍💼</div>
            <p className="font-bold text-gray-900 text-lg">Dr. Ramesh Gupta</p>
            <p className="text-gray-500 text-sm">Principal, Vidya Mandir School</p>
            <p className="text-gray-400 text-xs mt-1">M.Sc, Ph.D · 22 years experience</p>
          </div>
        </div>
      </div>
    </section>

    {/* VALUES */}
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="text-gray-500 mt-3">The principles that guide everything we do.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center shadow-sm">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TIMELINE */}
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
          <p className="text-gray-500 mt-3">25 years of milestones.</p>
        </div>
        <div className="relative border-l-2 border-blue-100 pl-8 space-y-8">
          {milestones.map((m) => (
            <div key={m.year} className="relative">
              <div className="absolute -left-10 top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{m.year}</span>
              <p className="text-gray-700 mt-1 font-medium">{m.event}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* LEADERSHIP TEAM */}
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Leadership Team</h2>
          <p className="text-gray-500 mt-3">The people who lead our school every day.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
              <p className="font-bold text-gray-900">{t.name}</p>
              <p className="text-sm text-blue-600 font-medium mt-0.5">{t.role}</p>
              <p className="text-xs text-gray-500 mt-1">{t.subject}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.exp} experience</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Be part of our community</h2>
        <p className="text-blue-100 mb-8">Sign in to the school portal to access your dashboard.</p>
        <Link to="/login" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-xl transition text-sm">
          Sign In to Portal
        </Link>
      </div>
    </section>

  </div>
);

export default About;