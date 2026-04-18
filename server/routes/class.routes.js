const express =require("express");
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} =require("../controllers/class.controller.js");
const verifyToken = require("../middleware/verifyToken");
const { isAdmin} = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/",     verifyToken,          getAllClasses);
router.get("/:id",  verifyToken,          getClassById);
router.post("/",    verifyToken, isAdmin,  createClass);
router.put("/:id",  verifyToken, isAdmin,  updateClass);
router.delete("/:id", verifyToken, isAdmin, deleteClass);

module.exports=router;