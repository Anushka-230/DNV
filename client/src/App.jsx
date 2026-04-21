import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// layouts
import PublicLayout    from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute      from "./components/RoleRoute";

/* ── PUBLIC PAGES ── */
import Home         from "./pages/Home";
import About        from "./pages/About";
import Gallery      from "./pages/Gallery";
import Login        from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

/* ── ADMIN PAGES ── */
import AdminDashboard  from "./pages/admin/AdminDashboard";
import ManageUsers     from "./pages/admin/ManageUsers";
import ManageTeachers  from "./pages/admin/ManageTeachers";
import ManageStudents  from "./pages/admin/ManageStudents";
import ManageClasses   from "./pages/admin/ManageClasses";
import ManageSubjects  from "./pages/admin/ManageSubjects";
import AdminAttendance from "./pages/admin/AdminAttendance";
import ManageExams     from "./pages/admin/ManageExams";

/* ── TEACHER PAGES ── */
// import TeacherDashboard from "./pages/teacher/TeacherDashboard";
// import MarkAttendance   from "./pages/teacher/MarkAttendance";
// import MyStudents       from "./pages/teacher/MyStudents";
// import MyTimetable      from "./pages/teacher/MyTimetable";
// import ManageSyllabus   from "./pages/teacher/ManageSyllabus";
// import ManageNotes      from "./pages/teacher/ManageNotes";
// import TeacherExams     from "./pages/teacher/TeacherExams";

/* ── STUDENT PAGES ── */
// import StudentDashboard from "./pages/student/StudentDashboard";
// import MyAttendance     from "./pages/student/MyAttendance";
// import StudentTimetable from "./pages/student/StudentTimetable";
// import MySyllabus       from "./pages/student/MySyllabus";
// import MyNotes          from "./pages/student/MyNotes";
// import MyExams          from "./pages/student/MyExams";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ROUTES ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* ── PRIVATE ROUTES ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* ADMIN */}
            <Route element={<RoleRoute role="admin" />}>
              <Route path="/admin/dashboard"  element={<AdminDashboard />} />
              <Route path="/admin/users"      element={<ManageUsers />} />
              <Route path="/admin/teachers"   element={<ManageTeachers />} />
              <Route path="/admin/students"   element={<ManageStudents />} />
              <Route path="/admin/classes"    element={<ManageClasses />} />
              <Route path="/admin/subjects"   element={<ManageSubjects />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/exams"      element={<ManageExams />} />
            </Route>

            {/* TEACHER */}
            <Route element={<RoleRoute role="teacher" />}>
              {/* <Route path="/teacher/dashboard"  element={<TeacherDashboard />} /> */}
              {/* <Route path="/teacher/attendance" element={<MarkAttendance />} /> */}
              {/* <Route path="/teacher/students"   element={<MyStudents />} /> */}
              {/* <Route path="/teacher/timetable"  element={<MyTimetable />} /> */}
              {/* <Route path="/teacher/syllabus"   element={<ManageSyllabus />} /> */}
              {/* <Route path="/teacher/notes"      element={<ManageNotes />} /> */}
              {/* <Route path="/teacher/exams"      element={<TeacherExams />} /> */}
            </Route>

            {/* STUDENT */}
            <Route element={<RoleRoute role="student" />}>
              {/* <Route path="/student/dashboard"  element={<StudentDashboard />} /> */}
              {/* <Route path="/student/attendance" element={<MyAttendance />} /> */}
              {/* <Route path="/student/timetable"  element={<StudentTimetable />} /> */}
              {/* <Route path="/student/syllabus"   element={<MySyllabus />} /> */}
              {/* <Route path="/student/notes"      element={<MyNotes />} /> */}
              {/* <Route path="/student/exams"      element={<MyExams />} /> */}
            </Route>

          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;