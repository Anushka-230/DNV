const express=require("express");
const {getAllUser,getUserById,updateUser,deleteUser}=require("../controllers/user.controller");
const {isAdmin}=require("../middleware/roleMiddleware");
const verifyToken = require("../middleware/verifyToken.js");


const router = express.Router();
router.get("/",verifyToken,isAdmin,getAllUser);
router.get("/:id",verifyToken,isAdmin,getUserById);
router.put("/:id",verifyToken,isAdmin,updateUser);
router.delete("/:id",verifyToken,isAdmin,deleteUser);

module.exports=router;