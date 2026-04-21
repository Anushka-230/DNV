const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const attendanceRoutes = require("./routes/attendance.routes.js");
const teacherRoutes     = require( "./routes/teacher.routes.js");
const studentRoutes     = require( "./routes/student.routes.js");
const classRoutes       = require( "./routes/class.routes.js");
const sectionRoutes     = require( "./routes/section.routes.js");
const subjectRoutes     = require( "./routes/subject.routes.js");
const classSubjectRoutes= require( "./routes/classSubject.routes.js");
const timetableRoutes   = require( "./routes/timetable.routes.js");
const syllabusRoutes    = require( "./routes/syllabus.routes.js");
const noteRoutes        = require( "./routes/note.routes.js");
const examRoutes        = require( "./routes/exam.routes.js");

dotenv.config(); //load enviornment variables

const app=express();

connectDB();
app.use(cors({
  origin:"https://dnv-beta.vercel.app",
  credentials: true
}));
app.use(express.json());

//test route
app.get("/",(req,res)=>{
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/teachers",      teacherRoutes);
app.use("/api/students",      studentRoutes);
app.use("/api/classes",       classRoutes);
app.use("/api/sections",      sectionRoutes);
app.use("/api/subjects",      subjectRoutes);
app.use("/api/class-subjects",classSubjectRoutes);
app.use("/api/timetable",     timetableRoutes);
app.use("/api/syllabus",      syllabusRoutes);
app.use("/api/notes",         noteRoutes);
app.use("/api/exams",         examRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT=process.env.PORT || 5000;
//starts the server
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT} `);
});