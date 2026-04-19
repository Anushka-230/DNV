const mongoose=require("mongoose");
const { Schema } = mongoose;

const syllabusSchema = new Schema({
  classSubjectId: { 
    type: Schema.Types.ObjectId, 
    ref: "ClassSubject", 
    required: true,
    unique: true       
  },
  teacherId: { 
    type: Schema.Types.ObjectId, 
    ref: "Teacher", 
    required: true 
  },
  content: { 
    type: String, 
    required: true     
  }
}, { timestamps: true });

const Syllabus=mongoose.model("Syllabus",syllabusSchema);
module.exports=Syllabus;