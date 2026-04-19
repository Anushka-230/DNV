const mongoose=require("mongoose");

const studentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
    },
    rollNumber:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Student=mongoose.model("Student",studentSchema);

module.exports=Student;