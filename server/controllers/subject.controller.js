const Subject = require("../models/Subject");

// GET /api/subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/subjects
const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Subject.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({ name });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};