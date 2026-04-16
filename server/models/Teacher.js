const mongoose=require("mongoose");

const teacherSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    employeeId:{
        type:String,
        required:true,
        unique:true
    },
    qualification:{
        type:String
    },
    joiningDate:{
        type:Date
    },
    salary:{
        type:Number
    }
},{timestamps:true});

const Teacher=mongoose.model("Teacher",teacherSchema);
module.exports=Teacher;