const express = require("express");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentBySection,
  updateStudent
} = require("../controllers/student.controller");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isAdminOrTeacher } = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/", verifyToken, isAdmin, createStudent);
router.get("/", verifyToken, isAdmin, getAllStudents);
router.get("/section/:sectionId", verifyToken, isAdminOrTeacher, getStudentBySection);
router.get("/:id", verifyToken, getStudentById);
router.put("/:id", verifyToken, isAdmin, updateStudent);


module.exports = router;