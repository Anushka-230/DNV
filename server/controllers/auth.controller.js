const User=require("../models/User.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//POST /api/auth/register (admin only)
const register=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        const exists=await User.findOne({email});
        if(exists) return res.status(400).json({message:"Email already in use"});

        const hashed=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashed,role});

        res.status(201).json({ message: "User created", userId: user._id });
    }catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  }catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe };