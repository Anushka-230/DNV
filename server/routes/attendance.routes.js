const express = require("express");
const {
  markAttendance,
  getStudentAttendance,
  updateAttendance
} = require("../controllers/attendance.controller.js");

const verifyToken = require("../middleware/verifyToken.js");
const { isTeacher, isAdminOrTeacher } = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.post("/", verifyToken, isTeacher, markAttendance);
router.get("/student/:studentId", verifyToken, getStudentAttendance);
router.put("/:id", verifyToken, isAdminOrTeacher, updateAttendance);

module.exports = router;