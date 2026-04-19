const express = require("express");
const {
  getExamsBySection,
  getExamById,
  scheduleExam,
  updateExam,
  deleteExam,
} = require("../controllers/exam.controller");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isAdminOrTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/section/:sectionId", verifyToken, getExamsBySection);
router.get("/:id", verifyToken, getExamById);
router.post("/", verifyToken, isAdminOrTeacher, scheduleExam);
router.put("/:id", verifyToken, isAdminOrTeacher, updateExam);
router.delete("/:id", verifyToken, isAdmin, deleteExam);

module.exports = router;