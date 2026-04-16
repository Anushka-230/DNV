const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller.js");
const verifyToken = require("../middleware/verifyToken.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.post("/register", verifyToken, isAdmin, register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

module.exports = router;