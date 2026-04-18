const Teacher=require("../models/Teacher");
const Section=require("../models/Section");
const ClassSubject=require("../models/ClassSubject");

//POST /api/teachers
const createTeacher=async(req,res)=>{
    try{
        const teacher=await Teacher.create(req.body);
        res.status(201).json(teacher);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//GET /api/teachers
const getAllTeachers=async(req,res)=>{
    try{
        const teachers=await Teacher.find();
        res.json(teachers);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//GET /api/teachers/:id
const getTeacherById=async(req,res)=>{
    try{
        const id=req.params.id;
        if (req.user.role === "teacher" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const teacher=await Teacher.findById(id);
        if(!teacher){
            return res.status(404).json({ message: "Teacher Not found" });
        }
        res.json(teacher);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//PUT /api/teachers/:id
const updateTeacher=async (req,res)=>{
    try{
        const id=req.params.id;
        const updated=await Teacher.findByIdAndUpdate(id,req.body,{new:true,runValidators: true});
        if(!updated){
            return res.status(404).json({ message: "Teacher Not found" })
        }
        res.json(updated);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

// GET /api/teachers/:id/sections
const getTeacherSections = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // sections where this teacher is the CLASS TEACHER
    const classTeacherOf = await Section.find({ classTeacherId: teacherId })
      .populate("classId", "name");

    // sections where this teacher teaches a SUBJECT
    const subjectTeacherOf = await ClassSubject.find({ teacherId })
      .populate({
        path: "sectionId",
        populate: { path: "classId", select: "name" }
      })
      .populate("subjectId", "name");

    res.json({
      classTeacherOf,        
      subjectTeacherOf       
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={createTeacher,getAllTeachers,getTeacherById,updateTeacher,getTeacherSections};