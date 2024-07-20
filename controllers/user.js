const User = require("../models/user.js");

module.exports.signUpForm=(req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signUpUser=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registerUser=await User.register(newUser,password)
        req.login(registerUser,(error)=>{
            if(error){
                next(error);
            }
            req.flash("success","Welcome to wanderlust")
            res.redirect("/listings");
        });

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
    
}

module.exports.LoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.LoginUser=async(req,res)=>{
    req.flash("success","You are logged in successfully");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.LogoutUser=(req,res,next)=>{
    req.logOut((error)=>{
        if(error){
            next(error);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}