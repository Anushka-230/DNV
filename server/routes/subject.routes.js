const express = require("express");

const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subject.controller");

const verifyToken = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", verifyToken, getAllSubjects);
router.get("/:id", verifyToken, getSubjectById);
router.post("/", verifyToken, isAdmin, createSubject);
router.put("/:id", verifyToken, isAdmin, updateSubject);
router.delete("/:id", verifyToken, isAdmin, deleteSubject);

module.exports = router;