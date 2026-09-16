const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// SignUp
router.post("/signup", userController.user_signup_post);

// SignIn
router.post("/signin", userController.user_signin_post);

module.exports = router;