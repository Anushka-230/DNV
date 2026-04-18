const Student=require("../models/Student");

//POST /api/students/
const createStudent=(req,res)=>{
    try{
        const student=await Student.create(req.body);
        res.status(201).json(student);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//GET /api/students
const getAllStudents=async(req,res)=>{
    try{
        const students=await Student.find();
        res.json(students);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//GET /api/students/:id
const getStudentById=(req,res)=>{
    try{
        const id=req.params.id;
        if ((req.user.role === "teacher" || req.user.role==="student") && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const student=await Student.findById(id);
        if(!student){
            return res.status(404).json({ message: "Student Not found" });
        }
        res.json(student);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//PUT /api/students/:id
const updateStudent=async (req,res)=>{
    try{
        const id=req.params.id;
        const updated=await Student.findByIdAndUpdate(id,req.body,{new:true,runValidators: true});
        if(!updated){
            return res.status(404).json({ message: "Student Not found" })
        }
        res.json(updated);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

//GET /api/students/section/:sectionId
const getStudentBySection=async(req,res)=>{
    try{
        const students = await Student.find({ sectionId: req.params.sectionId })
        .populate("userId", "name email")        // get name + email from USER
        .populate({
            path: "sectionId",
            populate: { path: "classId", select: "name" }  // get section + class name
        })
        .sort({ rollNumber: 1 });                // sort by roll number ascending

        if (!students.length) {
        return res.status(404).json({ message: "No students found in this section" });
        }

        res.json(students);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

module.exports={createStudent,getAllStudents,getStudentById,getStudentBySection,updateStudent};