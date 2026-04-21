import { useEffect, useState } from "react";
import { getAllTeachers, getAllUsers, createTeacher } from "../../api/index.js";
import Loader from "../../components/Loader.jsx";

const ManageTeachers = () => {
  const [teachers, setTeachers]     = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState({ userId: "", employeeId: "", qualification: "", joiningDate: "", salary: "" });

  const fetchAll = async () => {
    try {
      const [tRes, uRes] = await Promise.all([getAllTeachers(), getAllUsers()]);
      setTeachers(tRes.data);
      // only users with role=teacher that don't already have a profile
      const teacherUserIds = tRes.data.map((t) => t.userId?._id || t.userId);
      setUserOptions(uRes.data.filter((u) => u.role === "teacher" && !teacherUserIds.includes(u._id)));
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSubmitting(true);
    try {
      await createTeacher(form);
      setSuccess("Teacher profile created successfully");
      setForm({ userId: "", employeeId: "", qualification: "", joiningDate: "", salary: "" });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create teacher profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">{teachers.length} teacher profiles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          {showForm ? "Cancel" : "+ New Teacher Profile"}
        </button>
      </div>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Create Teacher Profile</h2>
          <p className="text-xs text-gray-400 mb-4">First create the user account in Manage Users, then create the profile here.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select User (role = teacher)</label>
              <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select a user --</option>
                {userOptions.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            {[
              { name: "employeeId",    label: "Employee ID",    type: "text", placeholder: "TCH001" },
              { name: "qualification", label: "Qualification",  type: "text", placeholder: "M.Sc Mathematics" },
              { name: "joiningDate",   label: "Joining Date",   type: "date", placeholder: "" },
              { name: "salary",        label: "Salary (₹)",     type: "number", placeholder: "45000" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
                {submitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name", "Email", "Employee ID", "Qualification", "Joining Date", "Salary"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teachers.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 font-medium text-gray-900">{t.userId?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{t.userId?.email || "—"}</td>
                <td className="px-5 py-3 text-gray-700">{t.employeeId}</td>
                <td className="px-5 py-3 text-gray-700">{t.qualification || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{t.joiningDate ? new Date(t.joiningDate).toLocaleDateString("en-IN") : "—"}</td>
                <td className="px-5 py-3 text-gray-700">{t.salary ? `₹${t.salary.toLocaleString("en-IN")}` : "—"}</td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No teacher profiles yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeachers;