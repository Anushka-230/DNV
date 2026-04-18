const Timetable = require("../models/Timetable");

// GET /api/timetable/section/:sectionId
const getTimetableBySection = async (req, res) => {
  try {
    const slots = await Timetable.find()
      .populate({
        path: "classSubjectId",
        match: { sectionId: req.params.sectionId },
        populate: [
          { path: "subjectId", select: "name" },
          { path: "teacherId", populate: { path: "userId", select: "name" } },
        ],
      })
      .sort({ day: 1, startTime: 1 });

    // filter out null populated results
    const filtered = slots.filter((s) => s.classSubjectId !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/timetable
const createSlot = async (req, res) => {
  try {
    const { classSubjectId, day, startTime, endTime } = req.body;

    // prevent duplicate slot for same subject on same day
    const exists = await Timetable.findOne({ classSubjectId, day });
    if (exists) {
      return res.status(400).json({
        message: "Slot already exists for this subject on this day",
      });
    }

    const slot = await Timetable.create({
      classSubjectId,
      day,
      startTime,
      endTime,
    });

    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/timetable/:id
const updateSlot = async (req, res) => {
  try {
    const slot = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/timetable/:id
const deleteSlot = async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTimetableBySection,
  createSlot,
  updateSlot,
  deleteSlot,
};