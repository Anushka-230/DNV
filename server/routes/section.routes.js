const express = require("express");
const {
  getAllSections,
  getSectionsByClass,
  getClassTeacher,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/section.controller");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.get("/class/:classId", verifyToken, getSectionsByClass);
router.get("/:id/class-teacher", verifyToken, getClassTeacher);
router.get("/", verifyToken, getAllSections);
router.get("/:id", verifyToken, getSectionById);
router.post("/", verifyToken, isAdmin, createSection);
router.put("/:id", verifyToken, isAdmin, updateSection);
router.delete("/:id", verifyToken, isAdmin, deleteSection);

module.exports = router;