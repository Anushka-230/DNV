const express = require("express");
const {
  assignTeacher,
  getAllAssignments,
  getSubjectsBySection,
  getAssignmentsByTeacher,
  updateAssignment,
  removeAssignment,
} = require("../controllers/classSubject.controller");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isAdminOrTeacher } = require("../middleware/isAdmin");

const router = express.Router();

router.get("/section/:sectionId", verifyToken, getSubjectsBySection);
router.get("/teacher/:teacherId", verifyToken, isAdminOrTeacher, getAssignmentsByTeacher);
router.get("/", verifyToken, isAdmin, getAllAssignments);
router.post("/", verifyToken, isAdmin, assignTeacher);
router.put("/:id", verifyToken, isAdmin, updateAssignment);
router.delete("/:id", verifyToken, isAdmin, removeAssignment);

module.exports = router;