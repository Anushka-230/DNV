const mongoose=require("mongoose");

const examSchema=new mongoose.Schema({
  classSubjectId: { type: Schema.Types.ObjectId, ref: "ClassSubject", required: true },
  examDate: { type: Date, required: true },
  venue:    { type: String }
});

const Exam=mongoose.model("Exam",examSchema);
module.exports=Exam;