const express = require("express");
const router= express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const Controller = require("../controllers/user.js");

router.get("/signUp",Controller.signUpForm)

router.post("/signUp",wrapAsync(Controller.signUpUser))

router.get("/login",Controller.LoginForm)

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}), 
    Controller.LoginUser
    )

router.get("/logout",Controller.LogoutUser)

module.exports=router;