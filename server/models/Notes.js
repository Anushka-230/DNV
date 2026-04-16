const mongoose=require("mongoose");

const notesSchema=new mongoose.Schema({
    classSubjectId: { type: Schema.Types.ObjectId, ref: "ClassSubject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    title:     { type: String, required: true },
    fileUrl:   { type: String, required: true }
});

const Notes=mongoose.model("Notes",notesSchema);
module.exports=Notes;