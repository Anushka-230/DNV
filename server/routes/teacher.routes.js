const express = require("express");

const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  getTeacherSections
} = require("../controllers/teacher.controller");

const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isAdminOrTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();


router.post("/", verifyToken, isAdmin, createTeacher);
router.get("/", verifyToken, isAdmin, getAllTeachers);
router.get("/:id/sections", verifyToken,isAdminOrTeacher, getTeacherSections);
router.get("/:id", verifyToken, isAdminOrTeacher, getTeacherById);
router.put("/:id", verifyToken, isAdmin, updateTeacher);


module.exports = router;