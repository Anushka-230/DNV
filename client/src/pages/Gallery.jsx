const categories = ["All", "Sports", "Events", "Classrooms", "Labs", "Cultural"];

const photos = [
  { id: 1,  category: "Sports",     emoji: "⚽", title: "Inter-school Football Tournament",  year: "2024" },
  { id: 2,  category: "Events",     emoji: "🎤", title: "Annual Day Celebration",             year: "2024" },
  { id: 3,  category: "Classrooms", emoji: "📖", title: "Smart Classroom in Action",          year: "2024" },
  { id: 4,  category: "Labs",       emoji: "🔬", title: "Science Lab — Chemistry Experiment", year: "2024" },
  { id: 5,  category: "Cultural",   emoji: "🎭", title: "Drama Club Annual Performance",      year: "2024" },
  { id: 6,  category: "Sports",     emoji: "🏏", title: "Cricket Practice Session",           year: "2023" },
  { id: 7,  category: "Events",     emoji: "🏆", title: "Prize Distribution Ceremony",        year: "2023" },
  { id: 8,  category: "Labs",       emoji: "💻", title: "Computer Lab — Coding Class",        year: "2023" },
  { id: 9,  category: "Cultural",   emoji: "🎵", title: "School Choir Competition",           year: "2023" },
  { id: 10, category: "Events",     emoji: "🌿", title: "Independence Day Parade",            year: "2023" },
  { id: 11, category: "Sports",     emoji: "🏃", title: "Annual Sports Day — 100m Race",      year: "2022" },
  { id: 12, category: "Classrooms", emoji: "✏️", title: "Morning Assembly",                  year: "2022" },
];

const bgColors = [
  "bg-blue-50",   "bg-indigo-50", "bg-green-50", "bg-yellow-50",
  "bg-pink-50",   "bg-purple-50", "bg-teal-50",  "bg-orange-50",
];

import { useState } from "react";

const Gallery = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? photos
    : photos.filter((p) => p.category === active);

  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-700 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">School Gallery</h1>
          <p className="text-purple-100 text-lg max-w-xl mx-auto">
            A glimpse into life at Vidya Mandir — sports, events, labs, and everything in between.
          </p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="sticky top-16 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                active === c
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-8">
            Showing {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
            {active !== "All" ? ` in ${active}` : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className={`${bgColors[i % bgColors.length]} rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition group cursor-pointer`}
              >
                {/* Photo placeholder */}
                <div className="h-44 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {p.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                      {p.category}
                    </span>
                    <span className="text-xs text-gray-400">{p.year}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-2 leading-snug">{p.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📷</p>
              <p className="text-sm">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* NOTE */}
      <section className="bg-gray-50 border-t border-gray-100 py-10 text-center">
        <p className="text-sm text-gray-500">
          Photos are updated regularly by the school administration.
          <br />
          For high-resolution images, contact the school office.
        </p>
      </section>

    </div>
  );
};

export default Gallery;