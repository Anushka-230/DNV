const express = require("express");
const {
  getNotes,
  getNoteById,
  uploadNote,
  deleteNote,
} = require("../controllers/note.controller");
const verifyToken = require("../middleware/verifyToken");
const {
  isAdmin,
  isTeacher,
  isAdminOrTeacher,
} = require("../middleware/isAdmin");

const router = express.Router();

router.get("/single/:id", verifyToken, getNoteById);
router.get("/:classSubjectId", verifyToken, getNotes);
router.post("/", verifyToken, isTeacher, uploadNote);
router.delete("/:id", verifyToken, isAdminOrTeacher, deleteNote);

module.exports = router;