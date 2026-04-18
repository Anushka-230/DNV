const Class=require("../models/Class.js");

// GET /api/classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ name: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/classes/:id
const getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/classes
const createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Class.findOne({ name });
    if (exists) return res.status(400).json({ message: "Class already exists" });
    const cls = await Class.create({ name, description });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/classes/:id
const updateClass = async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/classes/:id
const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={getAllClasses,getClassById,createClass,updateClass,deleteClass};