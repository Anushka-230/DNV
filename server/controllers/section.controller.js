const Section = require("../models/Section");

// GET /api/sections
const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("classId", "name")
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name email" },
      });

    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sections/class/:classId
const getSectionsByClass = async (req, res) => {
  try {
    const sections = await Section.find({ classId: req.params.classId })
      .populate("classId", "name")
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ name: 1 });

    if (!sections.length) {
      return res.status(404).json({ message: "No sections found for this class" });
    }

    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sections/:id/class-teacher
const getClassTeacher = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate("classId", "name")
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name email" },
      });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({
      section: section.name,
      class: section.classId?.name,
      classTeacher: {
        name: section.classTeacherId?.userId?.name,
        email: section.classTeacherId?.userId?.email,
        employeeId: section.classTeacherId?.employeeId,
        qualification: section.classTeacherId?.qualification,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sections/:id
const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate("classId", "name")
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name email" },
      });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/sections
const createSection = async (req, res) => {
  try {
    const { classId, name, classTeacherId, academicYear, capacity } = req.body;

    const exists = await Section.findOne({ classId, name, academicYear });
    if (exists) {
      return res.status(400).json({
        message: "Section already exists for this class and year",
      });
    }

    const section = await Section.create({
      classId,
      name,
      classTeacherId,
      academicYear,
      capacity,
    });

    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sections/:id
const updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/sections/:id
const deleteSection = async (req, res) => {
  try {
    const deleted = await Section.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSections,
  getSectionsByClass,
  getClassTeacher,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
};