const Exam = require("../models/Exam");

// GET /api/exams/section/:sectionId
const getExamsBySection = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate({
        path: "classSubjectId",
        match: { sectionId: req.params.sectionId },
        populate: { path: "subjectId", select: "name" },
      })
      .sort({ examDate: 1 });

    // filter out non-matching results
    const filtered = exams.filter((e) => e.classSubjectId !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/exams/:id
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate({
      path: "classSubjectId",
      populate: [
        { path: "subjectId", select: "name" },
        {
          path: "sectionId",
          populate: { path: "classId", select: "name" },
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/exams
const scheduleExam = async (req, res) => {
  try {
    const { classSubjectId, examDate, venue } = req.body;

    const exam = await Exam.create({
      classSubjectId,
      examDate,
      venue,
    });

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/exams/:id
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/exams/:id
const deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json({ message: "Exam deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getExamsBySection,
  getExamById,
  scheduleExam,
  updateExam,
  deleteExam,
};