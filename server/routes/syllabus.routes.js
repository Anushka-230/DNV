const express = require("express");

const {
  getSyllabus,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
} = require("../controllers/syllabus.controller");

const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isTeacher } = require("../middleware/isAdmin");

const router = express.Router();

router.get("/:classSubjectId", verifyToken, getSyllabus);
router.post("/", verifyToken, isTeacher, createSyllabus);
router.put("/:id", verifyToken, isTeacher, updateSyllabus);
router.delete("/:id", verifyToken, isAdmin, deleteSyllabus);

module.exports = router;