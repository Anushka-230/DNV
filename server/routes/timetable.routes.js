const express = require("express");
const {
  getTimetableBySection,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/timetable.controller");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin, isAdminOrTeacher } = require("../middleware/isAdmin");

const router = express.Router();

router.get("/section/:sectionId", verifyToken, getTimetableBySection);
router.post("/", verifyToken, isAdminOrTeacher, createSlot);
router.put("/:id", verifyToken, isAdminOrTeacher, updateSlot);
router.delete("/:id", verifyToken, isAdmin, deleteSlot);

module.exports = router;