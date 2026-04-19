const mongoose=require("mongoose");

const classSubjectSchema=new mongoose.Schema({
    sectionId:  { type: mongoose.Schema.Types.ObjectId, ref: "Section",  required: true },
  subjectId:  { type: mongoose.Schema.Types.ObjectId, ref: "Subject",  required: true },
  teacherId:  { type: mongoose.Schema.Types.ObjectId, ref: "Teacher",  required: true }
},{timestamps:true});

//preventing duplicate assignment
classSubjectSchema.index({ sectionId: 1, subjectId: 1 }, { unique: true });

const ClassSubject=mongoose.model("ClassSubject",classSubjectSchema);
module.exports=ClassSubject;