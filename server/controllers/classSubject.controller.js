const ClassSubject = require("../models/ClassSubject");

// POST /api/class-subjects
const assignTeacher = async (req, res) => {
  try {
    const { sectionId, subjectId, teacherId } = req.body;

    // prevent duplicate subject in same section
    const exists = await ClassSubject.findOne({ sectionId, subjectId });
    if (exists) {
      return res.status(400).json({
        message: "This subject is already assigned in this section",
      });
    }

    const assignment = await ClassSubject.create({
      sectionId,
      subjectId,
      teacherId,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/class-subjects
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await ClassSubject.find()
      .populate({
        path: "sectionId",
        populate: { path: "classId", select: "name" },
      })
      .populate("subjectId", "name")
      .populate({
        path: "teacherId",
        populate: { path: "userId", select: "name email" },
      });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/class-subjects/section/:sectionId
const getSubjectsBySection = async (req, res) => {
  try {
    const assignments = await ClassSubject.find({
      sectionId: req.params.sectionId,
    })
      .populate("subjectId", "name")
      .populate({
        path: "teacherId",
        populate: { path: "userId", select: "name email" },
      });

    if (!assignments.length) {
      return res
        .status(404)
        .json({ message: "No subjects found for this section" });
    }

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/class-subjects/teacher/:teacherId
const getAssignmentsByTeacher = async (req, res) => {
  try {
    const assignments = await ClassSubject.find({
      teacherId: req.params.teacherId,
    })
      .populate({
        path: "sectionId",
        populate: { path: "classId", select: "name" },
      })
      .populate("subjectId", "name");

    if (!assignments.length) {
      return res
        .status(404)
        .json({ message: "No assignments found for this teacher" });
    }

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/class-subjects/:id
const updateAssignment = async (req, res) => {
  try {
    const assignment = await ClassSubject.findByIdAndUpdate(
      req.params.id,
      { teacherId: req.body.teacherId },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/class-subjects/:id
const removeAssignment = async (req, res) => {
  try {
    const deleted = await ClassSubject.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  assignTeacher,
  getAllAssignments,
  getSubjectsBySection,
  getAssignmentsByTeacher,
  updateAssignment,
  removeAssignment,
};