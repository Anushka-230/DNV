const Syllabus = require("../models/Syllabus");

// GET /api/syllabus/:classSubjectId
const getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      classSubjectId: req.params.classSubjectId,
    }).populate({
      path: "classSubjectId",
      populate: [
        { path: "subjectId", select: "name" },
        { path: "sectionId", populate: { path: "classId", select: "name" } },
      ],
    });

    if (!syllabus) {
      return res
        .status(404)
        .json({ message: "Syllabus not found for this subject" });
    }

    res.json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/syllabus
const createSyllabus = async (req, res) => {
  try {
    const { classSubjectId, content } = req.body;

    const exists = await Syllabus.findOne({ classSubjectId });
    if (exists) {
      return res.status(400).json({
        message: "Syllabus already exists. Use PUT to update.",
      });
    }

    const syllabus = await Syllabus.create({
      classSubjectId,
      teacherId: req.user.teacherId, // from token
      content,
    });

    res.status(201).json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/syllabus/:id
const updateSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    );

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    res.json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/syllabus/:id
const deleteSyllabus = async (req, res) => {
  try {
    const deleted = await Syllabus.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    res.json({ message: "Syllabus deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSyllabus,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
};