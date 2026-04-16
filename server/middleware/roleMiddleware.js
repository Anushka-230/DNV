const isAdmin=(req,res,next)=>{
    if(req.user.role != "admin"){
        return res.status(403).json({message:"Admin access only"});
    }
    next();
};

const isTeacher=(req,res,next)=>{
    if(req.user.role!="teacher"){
        return res.status(403).json({message:"Teacher access only"});
    }
    next();
};

const isAdminOrTeacher=(req,res,next)=>{
    if(!["admin","teacher"].includes(req.user.role)){
        return res.status(403).json({message:"Unauthorized"});
    }
    next();
};

module.exports={isAdmin,isTeacher,isAdminOrTeacher};
