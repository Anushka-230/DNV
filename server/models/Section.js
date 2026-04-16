const mongoose=require("mongoose");

const sectionSchema=new mongoose.Schema({
    classId:{
        type:Schema.Types.ObjectId,
        ref:"Class",
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    classTeacherId:{
        type:Schema.Types.ObjectId,
        ref:"Teacher",
        required:true
    },
    academicYear:{
        type:String,
        required:true
    },
    capacity:{
        type:Number
    }
},{timestamps:true});

const Section=mongoose.model("Section",sectionSchema);

module.exports=Section;