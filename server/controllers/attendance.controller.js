const Attendance = require("../models/Attendance.js");

// POST /api/attendance
const markAttendance = async (req, res) => {
  try {
    const { classSubjectId, date, records } = req.body;

    const docs = records.map((r) => ({
      studentId: r.studentId,
      classSubjectId,
      date: new Date(date),
      status: r.status
    }));

    await Attendance.insertMany(docs, { ordered: false });

    res.status(201).json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance/student/:studentId
const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      studentId: req.params.studentId
    })
      .populate("classSubjectId")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  updateAttendance
};