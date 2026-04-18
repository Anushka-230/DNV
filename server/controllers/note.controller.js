const Note = require("../models/Note");

// GET /api/notes/:classSubjectId
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      classSubjectId: req.params.classSubjectId,
    })
      .populate({
        path: "teacherId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/notes/single/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate({
      path: "teacherId",
      populate: { path: "userId", select: "name" },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/notes
const uploadNote = async (req, res) => {
  try {
    const { classSubjectId, title, fileUrl } = req.body;

    const note = await Note.create({
      classSubjectId,
      teacherId: req.user.teacherId, // ⚠️ check token structure
      title,
      fileUrl,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  uploadNote,
  deleteNote,
};