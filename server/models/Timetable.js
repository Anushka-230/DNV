const mongoose=require("mongoose");

const timetableSchema=new mongoose.Schema({
    classSubjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ClassSubject",
        required:true
    },
    day:{
        type:String,
        enum:["Mon","Tue","Wed","Thu","Fri","Sat"],
        required:true
    },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true } 
});

const Timetable=mongoose.model("Timetable",timetableSchema);
module.exports=Timetable;