const mongoose=require("mongoose");

const attendanceSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    classSubjectId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassSubject", required: true },
    date:{ type: Date, required: true },
    status:{
        type:String,
        enum:["absent","present"],
        required:true
    }
},{timestamps:true});

//one record per student
attendanceSchema.index({studentId:1,classSubjectId:1,date:1},{unique:true});

const Attendance=mongoose.model("Attendance",attendanceSchema);
module.exports=Attendance;