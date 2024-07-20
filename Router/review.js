const express = require("express");
const router= express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedIn,isAuthor}=require("../middleware.js");

const Controller = require("../controllers/review.js");


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }

  //post
  router.post("/",isLoggedIn,validateReview,wrapAsync(Controller.creteReview))
  
  // Delete Review Route
  router.delete("/:reviewId",isAuthor,wrapAsync(Controller.DeleteReview))

  module.exports=router;