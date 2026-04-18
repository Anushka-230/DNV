const User=require("../models/User.js");

//GET /api/users
const getAllUser=async (req,res)=>{
    try{
        const users= await User.find().select("-password");
        res.json(users);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

//GET /api/users/:id
const getUserById=async(req,res)=>{
    try{    
        const id=req.params.id;
        const user=await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User Not found" })
        }
        res.json(user);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

//PUT /api/users/id
const updateUser=async (req,res)=>{
    try{
        const id=req.params.id;
        const updated=await User.findByIdAndUpdate(id,req.body,{new:true,runValidators: true});
        if(!updated){
            return res.status(404).json({ message: "User Not found" })
        }
        res.json(updated);
    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

//DELETE /api/users/id
const deleteUser=async(req,res)=>{
    try{
        const id=req.params.id;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "User Not found" });
        }
        res.json({ message: "User Deleted Successfully" });

    }catch (err) {
    res.status(500).json({ message: err.message });
    }
}

module.exports={getAllUser,getUserById,updateUser,deleteUser};