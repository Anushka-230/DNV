import api from "./axios";

// ─── AUTH ───────────────────────────────────────────────
export const loginUser    = (data)      => api.post("/auth/login", data);
export const getMe        = ()          => api.get("/auth/me");
export const changePassword = (data)   => api.put("/auth/change-password", data);

// ─── USERS ──────────────────────────────────────────────
export const getAllUsers   = ()          => api.get("/users");
export const getUserById   = (id)        => api.get(`/users/${id}`);
export const updateUser    = (id, data)  => api.put(`/users/${id}`, data);
export const deleteUser    = (id)        => api.delete(`/users/${id}`);
export const registerUser  = (data)      => api.post("/auth/register", data);

// ─── TEACHERS ───────────────────────────────────────────
export const getAllTeachers        = ()         => api.get("/teachers");
export const getTeacherById        = (id)       => api.get(`/teachers/${id}`);
export const createTeacher         = (data)     => api.post("/teachers", data);
export const updateTeacher         = (id, data) => api.put(`/teachers/${id}`, data);
export const getTeacherSections    = (id)       => api.get(`/teachers/${id}/sections`);

// ─── STUDENTS ───────────────────────────────────────────
export const getAllStudents         = ()         => api.get("/students");
export const getStudentById        = (id)       => api.get(`/students/${id}`);
export const createStudent         = (data)     => api.post("/students", data);
export const updateStudent         = (id, data) => api.put(`/students/${id}`, data);
export const getStudentsBySection  = (sectionId)=> api.get(`/students/section/${sectionId}`);

// ─── CLASSES ────────────────────────────────────────────
export const getAllClasses  = ()          => api.get("/classes");
export const getClassById  = (id)        => api.get(`/classes/${id}`);
export const createClass   = (data)      => api.post("/classes", data);
export const updateClass   = (id, data)  => api.put(`/classes/${id}`, data);
export const deleteClass   = (id)        => api.delete(`/classes/${id}`);

// ─── SECTIONS ───────────────────────────────────────────
export const getAllSections        = ()          => api.get("/sections");
export const getSectionById        = (id)        => api.get(`/sections/${id}`);
export const getSectionsByClass    = (classId)   => api.get(`/sections/class/${classId}`);
export const getClassTeacher       = (id)        => api.get(`/sections/${id}/class-teacher`);
export const createSection         = (data)      => api.post("/sections", data);
export const updateSection         = (id, data)  => api.put(`/sections/${id}`, data);
export const deleteSection         = (id)        => api.delete(`/sections/${id}`);

// ─── SUBJECTS ───────────────────────────────────────────
export const getAllSubjects = ()          => api.get("/subjects");
export const createSubject = (data)      => api.post("/subjects", data);
export const updateSubject = (id, data)  => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id)        => api.delete(`/subjects/${id}`);

// ─── CLASS SUBJECTS ─────────────────────────────────────
export const getAllAssignments       = ()           => api.get("/class-subjects");
export const getSubjectsBySection   = (sectionId)  => api.get(`/class-subjects/section/${sectionId}`);
export const getAssignmentsByTeacher= (teacherId)  => api.get(`/class-subjects/teacher/${teacherId}`);
export const assignTeacher          = (data)       => api.post("/class-subjects", data);
export const updateAssignment       = (id, data)   => api.put(`/class-subjects/${id}`, data);
export const removeAssignment       = (id)         => api.delete(`/class-subjects/${id}`);

// ─── ATTENDANCE ─────────────────────────────────────────
export const markAttendance         = (data)       => api.post("/attendance", data);
export const getStudentAttendance   = (studentId)  => api.get(`/attendance/student/${studentId}`);
export const getSectionAttendance   = (sectionId)  => api.get(`/attendance/section/${sectionId}`);
export const getClassSubjectAttendance = (id)      => api.get(`/attendance/class-subject/${id}`);
export const updateAttendance       = (id, data)   => api.put(`/attendance/${id}`, data);

// ─── TIMETABLE ──────────────────────────────────────────
export const getTimetableBySection  = (sectionId) => api.get(`/timetable/section/${sectionId}`);
export const createTimetableSlot    = (data)      => api.post("/timetable", data);
export const updateTimetableSlot    = (id, data)  => api.put(`/timetable/${id}`, data);
export const deleteTimetableSlot    = (id)        => api.delete(`/timetable/${id}`);

// ─── SYLLABUS ───────────────────────────────────────────
export const getSyllabus    = (classSubjectId) => api.get(`/syllabus/${classSubjectId}`);
export const createSyllabus = (data)           => api.post("/syllabus", data);
export const updateSyllabus = (id, data)       => api.put(`/syllabus/${id}`, data);

// ─── NOTES ──────────────────────────────────────────────
export const getNotes    = (classSubjectId) => api.get(`/notes/${classSubjectId}`);
export const uploadNote  = (data)           => api.post("/notes", data);
export const deleteNote  = (id)             => api.delete(`/notes/${id}`);

// ─── EXAMS ──────────────────────────────────────────────
export const getExamsBySection = (sectionId) => api.get(`/exams/section/${sectionId}`);
export const scheduleExam      = (data)      => api.post("/exams", data);
export const updateExam        = (id, data)  => api.put(`/exams/${id}`, data);
export const deleteExam        = (id)        => api.delete(`/exams/${id}`);